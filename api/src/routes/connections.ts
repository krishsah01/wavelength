import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import { Connection, User } from "../types/db";

const UUID_PATTERN = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'

const requestBodySchema = {
    body: {
        type: 'object',
        required: ['receiver_id'],
        additionalProperties: false,
        properties: {
            receiver_id: { type: 'string', pattern: UUID_PATTERN },
        },
    },
}

const acceptParamsSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', pattern: UUID_PATTERN },
        },
    },
}

export async function connectionsRoute(app: FastifyInstance) {
    // POST /api/connections — send a connection request
    app.post('/connections', {
        preHandler: app.authenticate,
        schema: requestBodySchema,
    }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }
        const { receiver_id } = request.body as { receiver_id: UUID }

        if (userId === receiver_id) {
            return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: 'Cannot connect with yourself' })
        }

        // Verify receiver exists
        const receiver = await app.db.query<User>(
            'SELECT id FROM users WHERE id = $1', [receiver_id]
        )
        if (receiver.rows.length === 0) {
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'User not found' })
        }

        // Insert — unique constraint prevents duplicates
        try {
            await app.db.query<Connection>(
                `INSERT INTO connections (requester_id, receiver_id, status)
                 VALUES ($1, $2, 'pending')`,
                [userId, receiver_id]
            )
            return reply.code(201).send({ message: 'Connection request sent' })
        } catch (err: unknown) {
            const pg = err as { code?: string }
            if (pg.code === '23505') {
                // Unique violation — request already exists in either direction
                return reply.code(409).send({ statusCode: 409, error: 'Conflict', message: 'Connection request already exists' })
            }
            throw err
        }
    })

    // POST /api/connections/:id/accept — accept a pending request
    app.post('/connections/:id/accept', {
        preHandler: app.authenticate,
        schema: acceptParamsSchema,
    }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }
        const { id: connectionId } = request.params as { id: UUID }

        const result = await app.db.query<Connection>(
            `UPDATE connections
             SET status = 'accepted'
             WHERE id = $1 AND receiver_id = $2 AND status = 'pending'
             RETURNING *`,
            [connectionId, userId]
        )

        if (result.rows.length === 0) {
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'Pending connection request not found' })
        }

        return reply.code(200).send({ message: 'Connection accepted', connection: result.rows[0] })
    })

    // POST /api/connections/:id/decline — decline or cancel a request
    app.post('/connections/:id/decline', {
        preHandler: app.authenticate,
        schema: acceptParamsSchema,
    }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }
        const { id: connectionId } = request.params as { id: UUID }

        // Allow both receiver (declining) and requester (cancelling) to remove
        const result = await app.db.query<Connection>(
            `DELETE FROM connections
             WHERE id = $1 AND (receiver_id = $2 OR requester_id = $2) AND status = 'pending'
             RETURNING id`,
            [connectionId, userId]
        )

        if (result.rows.length === 0) {
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'Pending connection request not found' })
        }

        return reply.code(200).send({ message: 'Connection request declined' })
    })

    // GET /api/connections — list accepted connections + pending requests
    app.get('/connections', { preHandler: app.authenticate }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }

        const [accepted, pending, sent] = await Promise.all([
            // Accepted connections (either direction)
            app.db.query<{ connection_id: string; user_id: string; username: string; bio: string; connected_at: Date }>(
                `SELECT c.id AS connection_id,
                        u.id AS user_id,
                        u.username,
                        LEFT(p.bio, 150) AS bio,
                        c.created_at AS connected_at
                 FROM connections c
                 JOIN users u ON u.id = CASE WHEN c.requester_id = $1 THEN c.receiver_id ELSE c.requester_id END
                 LEFT JOIN profiles p ON p.user_id = u.id
                 WHERE (c.requester_id = $1 OR c.receiver_id = $1) AND c.status = 'accepted'
                 ORDER BY c.created_at DESC`,
                [userId]
            ),
            // Pending requests where current user is the receiver
            app.db.query<{ connection_id: string; user_id: string; username: string; bio: string; requested_at: Date }>(
                `SELECT c.id AS connection_id,
                        u.id AS user_id,
                        u.username,
                        LEFT(p.bio, 150) AS bio,
                        c.created_at AS requested_at
                 FROM connections c
                 JOIN users u ON u.id = c.requester_id
                 LEFT JOIN profiles p ON p.user_id = u.id
                 WHERE c.receiver_id = $1 AND c.status = 'pending'
                 ORDER BY c.created_at DESC`,
                [userId]
            ),
            // Sent requests where current user is the requester
            app.db.query<{ connection_id: string; user_id: string; username: string; bio: string; requested_at: Date }>(
                `SELECT c.id AS connection_id,
                        u.id AS user_id,
                        u.username,
                        LEFT(p.bio, 150) AS bio,
                        c.created_at AS requested_at
                 FROM connections c
                 JOIN users u ON u.id = c.receiver_id
                 LEFT JOIN profiles p ON p.user_id = u.id
                 WHERE c.requester_id = $1 AND c.status = 'pending'
                 ORDER BY c.created_at DESC`,
                [userId]
            ),
        ])

        return reply.code(200).send({
            connections: accepted.rows,
            pending_requests: pending.rows,
            sent_requests: sent.rows,
        })
    })
}
