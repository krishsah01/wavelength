import Fastify from "fastify";
import cors from '@fastify/cors'
import dbPlugin from "./plugins/db";

const app = Fastify({ logger: true })

app.register(cors, {
    origin: 'http://localhost:3000'
})

app.register(dbPlugin)

app.get('/health', async () => {
    return { status: 'ok' }
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