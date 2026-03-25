import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { Message } from "../types/db";

const UUID_PATTERN =
  "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
const ISO_8601_PATTERN = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$";
const WS_MAX_CONNECTIONS_PER_ROOM = 10;
const WS_MAX_MESSAGES_PER_WINDOW = 30;
const WS_WINDOW_MS = 10_000;
const WS_PING_INTERVAL_MS = 30_000;
const HTTP_READ_MAX_REQUESTS_PER_WINDOW = 30;
const HTTP_READ_WINDOW_MS = 10_000;

const getMessagesSchema = {
  params: {
    type: "object",
    required: ["connectionId"],
    properties: {
      connectionId: { type: "string", pattern: UUID_PATTERN },
    },
  },
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      before: { type: "string", pattern: ISO_8601_PATTERN },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 50 },
    },
  },
};

const postMessageSchema = {
  params: {
    type: "object",
    required: ["connectionId"],
    properties: {
      connectionId: { type: "string", pattern: UUID_PATTERN },
    },
  },
  body: {
    type: "object",
    required: ["content"],
    additionalProperties: false,
    properties: {
      content: { type: "string", minLength: 1, maxLength: 1000 },
    },
  },
};

const readMessagesParamsSchema = {
  params: {
    type: "object",
    required: ["connectionId"],
    properties: {
      connectionId: { type: "string", pattern: UUID_PATTERN },
    },
  },
};

type WsSocket = {
  send: (data: string) => void;
  close: (code?: number, data?: string) => void;
  on: (ev: string, cb: (...args: any[]) => void) => void;
  ping?: () => void;
};

type WsClient = {
  socket: WsSocket;
  userId: string;
  frameTimestamps: number[];
};

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function verifyConnectionAccess(app: FastifyInstance, connectionId: UUID, userId: UUID) {
  const result = await app.db.query<{ id: string }>(
    `SELECT id
     FROM connections
     WHERE id = $1
       AND status = 'accepted'
       AND (requester_id = $2 OR receiver_id = $2)`,
    [connectionId, userId]
  );
  return result.rows.length > 0;
}

function getCookieToken(request: any) {
  return request?.cookies?.token as string | undefined;
}

function authenticateWs(request: any): { userId: string; email?: string } | null {
  const token = getCookieToken(request);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; email?: string };
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export async function messagesRoute(app: FastifyInstance) {
  const rooms = new Map<string, Set<WsClient>>();

  function closeSocket(socket: WsSocket, code = 1008, reason = "Policy violation") {
    try {
      socket.close(code, reason);
    } catch {
      // ignore close errors
    }
  }

  function isWsFrameRateAllowed(client: WsClient) {
    const now = Date.now();
    client.frameTimestamps = client.frameTimestamps.filter((ts) => now - ts < WS_WINDOW_MS);
    client.frameTimestamps.push(now);
    return client.frameTimestamps.length <= WS_MAX_MESSAGES_PER_WINDOW;
  }

  function broadcast(connectionId: string, payload: unknown, excludeUserId?: string) {
    const clients = rooms.get(connectionId);
    if (!clients) return;
    const raw = JSON.stringify(payload);
    for (const client of clients) {
      if (excludeUserId && client.userId === excludeUserId) continue;
      try {
        client.socket.send(raw);
      } catch {
        clients.delete(client);
      }
    }
    if (clients.size === 0) rooms.delete(connectionId);
  }

  // GET /api/messages/:connectionId — history (cursor pagination)
  app.get(
    "/messages/:connectionId",
    { preHandler: app.authenticate, schema: getMessagesSchema },
    async (request, reply) => {
      const { userId } = request.user as { userId: UUID };
      const { connectionId } = request.params as { connectionId: UUID };
      const { before, limit = 50 } = request.query as { before?: string; limit?: number };

      const allowed = await verifyConnectionAccess(app, connectionId, userId);
      if (!allowed) {
        return reply.code(404).send({ statusCode: 404, error: "Not Found", message: "Conversation not found" });
      }

      const beforeDate = before ? new Date(before) : null;
      if (before && Number.isNaN(beforeDate?.getTime())) {
        return reply.code(400).send({ statusCode: 400, error: "Bad Request", message: "Invalid before cursor" });
      }

      const result = await app.db.query<Message>(
        `SELECT id, connection_id, sender_id, content, is_read, created_at
         FROM messages
         WHERE connection_id = $1
           AND ($2::timestamptz IS NULL OR created_at < $2::timestamptz)
         ORDER BY created_at DESC
         LIMIT $3`,
        [connectionId, beforeDate ? beforeDate.toISOString() : null, limit]
      );

      // Return chronological order for UI rendering
      const messages = [...result.rows].reverse();
      const nextCursor = result.rows.length > 0 ? result.rows[result.rows.length - 1].created_at : null;

      return reply.code(200).send({ messages, nextCursor });
    }
  );

  // POST /api/messages/:connectionId — send message
  app.post(
    "/messages/:connectionId",
    { preHandler: app.authenticate, schema: postMessageSchema },
    async (request, reply) => {
      const { userId } = request.user as { userId: UUID };
      const { connectionId } = request.params as { connectionId: UUID };
      const { content } = request.body as { content: string };

      const allowed = await verifyConnectionAccess(app, connectionId, userId);
      if (!allowed) {
        return reply.code(404).send({ statusCode: 404, error: "Not Found", message: "Conversation not found" });
      }

      const inserted = await app.db.query<Message>(
        `INSERT INTO messages (connection_id, sender_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, connection_id, sender_id, content, is_read, created_at`,
        [connectionId, userId, content]
      );

      const message = inserted.rows[0];
      broadcast(String(connectionId), { type: "message", message }, String(userId));

      return reply.code(201).send({ message });
    }
  );

  // PATCH /api/messages/:connectionId/read — mark all received messages as read
  app.patch(
    "/messages/:connectionId/read",
    {
      preHandler: app.authenticate,
      schema: readMessagesParamsSchema,
      config: {
        rateLimit: {
          max: HTTP_READ_MAX_REQUESTS_PER_WINDOW,
          timeWindow: HTTP_READ_WINDOW_MS,
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.user as { userId: UUID };
      const { connectionId } = request.params as { connectionId: UUID };

      const allowed = await verifyConnectionAccess(app, connectionId, userId);
      if (!allowed) {
        return reply.code(404).send({ statusCode: 404, error: "Not Found", message: "Conversation not found" });
      }

      const updated = await app.db.query<{ id: string }>(
        `UPDATE messages
         SET is_read = true
         WHERE connection_id = $1
           AND sender_id != $2
           AND is_read = false
         RETURNING id`,
        [connectionId, userId]
      );

      return reply.code(200).send({ updatedCount: updated.rowCount ?? 0 });
    }
  );

  // WS /api/ws?connectionId=... — join conversation room
  app.get("/ws", { websocket: true }, async (connection: any, request: any) => {
    const auth = authenticateWs(request);
    const connectionId = (request.query as any)?.connectionId as string | undefined;

    if (!auth || !connectionId || !new RegExp(UUID_PATTERN).test(connectionId)) {
      try {
        connection.socket.close();
      } catch {
        // ignore
      }
      return;
    }

    const allowed = await verifyConnectionAccess(app, connectionId as UUID, auth.userId as UUID);
    if (!allowed) {
      try {
        connection.socket.close();
      } catch {
        // ignore
      }
      return;
    }

    const roomKey = String(connectionId);
    if (!rooms.has(roomKey)) rooms.set(roomKey, new Set());
    const roomClients = rooms.get(roomKey)!;
    if (roomClients.size >= WS_MAX_CONNECTIONS_PER_ROOM) {
      closeSocket(connection.socket, 1008, "Too many active connections");
      return;
    }

    const client: WsClient = { socket: connection.socket, userId: auth.userId, frameTimestamps: [] };
    roomClients.add(client);

    connection.socket.on("close", () => {
      const set = rooms.get(roomKey);
      if (!set) return;
      set.delete(client);
      if (set.size === 0) rooms.delete(roomKey);
    });

    // Receive-only socket path. Message creation happens via REST POST.
    connection.socket.on("message", (raw: any) => {
      try {
        if (!isWsFrameRateAllowed(client)) {
          closeSocket(connection.socket, 1008, "Rate limit exceeded");
          return;
        }

        const text = typeof raw === "string" ? raw : raw?.toString?.();
        if (!text) return;
        const payload = safeJsonParse<{ type?: string }>(text);
        if (!payload) return;
        if (payload.type === "ping") {
          connection.socket.send(JSON.stringify({ type: "pong" }));
        }
      } catch {
        closeSocket(connection.socket, 1011, "Unexpected error");
      }
    });
  });

  setInterval(() => {
    for (const clients of rooms.values()) {
      for (const client of clients) {
        try {
          client.socket.ping?.();
        } catch {
          clients.delete(client);
        }
      }
    }
    for (const [roomKey, clients] of rooms.entries()) {
      if (clients.size === 0) rooms.delete(roomKey);
    }
  }, WS_PING_INTERVAL_MS).unref();
}

