import Fastify from "fastify";
import cors from '@fastify/cors'
import dbPlugin from "./plugins/db";

const app = Fastify({ logger: true })

app.register(cors, {
    origin: 'http://localhost:3000'
})

app.register(dbPlugin)

app.get('/health', async (request, reply) => {
    try {
        const result = await app.db.query('SELECT NOW()')
        return { status: 'ok', time: result.rows[0].now }
    } catch (err) {
        app.log.error(err, 'Health check database query failed')
        reply.status(503)
        return { status: 'error', message: 'Database unavailable' }
    }
})

const start = async () => {
    try {
        await app.listen({ port: 4000, host: '0.0.0.0' })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()