import { FastifyRequest, FastifyReply } from 'fastify'
import { Pool } from 'pg'

declare module 'fastify' {
    interface FastifyInstance {
        db: Pool
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
    interface FastifyRequest {
        user?: {
            userId: string
            email: string
        }
    }
}
export { }