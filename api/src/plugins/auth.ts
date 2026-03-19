import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"
import jwt from "jsonwebtoken"

interface JWTPayload {
    userId: string
    email: string
}

async function authPlugin(app: FastifyInstance) {
    app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        // Prefer cookie (browser clients) then fall back to Bearer header (API clients / mobile)
        const cookieToken = (request as FastifyRequest & { cookies?: Record<string, string> }).cookies?.token
        const authHeader = request.headers.authorization

        let token: string | undefined

        if (cookieToken) {
            token = cookieToken
        } else if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]
        }

        if (!token) {
            return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Missing authentication token' })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload
            request.user = { userId: decoded.userId, email: decoded.email }
        } catch {
            return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid or expired token' })
        }
    })
}

export default fp(authPlugin)
