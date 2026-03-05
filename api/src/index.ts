import Fastify from "fastify";
import cors from '@fastify/cors'
import dbPlugin from "./plugins/db";
import authRoutes from "./routes/auth";
import authPlugin from './plugins/auth'

const app = Fastify({ logger: true })

// 1. cors first
app.register(cors, {
    origin: 'http://localhost:3000'
})

//register plugins
app.register(dbPlugin)
app.register(authPlugin)

//routes after plugin
app.register(authRoutes, { prefix: '/api' })

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