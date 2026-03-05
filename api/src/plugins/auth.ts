import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"
import jwt from "jsonwebtoken"

interface JWTPayload {
    userId: string
    email: string
}

async function authPlugin(app: FastifyInstance) {
    app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        const authHeader = request.headers.authorization
        if (!authHeader) {
            return reply.code(401).send({ error: 'Missing authorization header' })
        }
        if (!authHeader.startsWith("Bearer ")) {
            return reply.code(401).send({ error: "Invalid authorization token" })
        }

        const headers = authHeader.split(" ")
        const token = headers[1]
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload
            request.user = { userId: decoded.userId, email: decoded.email }
        } catch (err) {
            return reply.code(401).send({ error: 'Invalid or expired token' })
        }
    })

}
export default fp(authPlugin)