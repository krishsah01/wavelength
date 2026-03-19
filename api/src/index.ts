import Fastify from "fastify";
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import cookie from '@fastify/cookie'
import dbPlugin from "./plugins/db";
import authRoutes from "./routes/auth";
import authPlugin from './plugins/auth'
import profileRoute from "./routes/profile";
import { matchesRoute } from "./routes/matches";

const app = Fastify({ logger: true })

// 1. cors first — credentials: true required for HTTP-only cookie auth
app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
})

// 2. cookie parser (must be before auth plugin)
app.register(cookie)

// 2. global rate limit: 100 req/min per IP
app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (_request, context) => ({
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please retry after ${Math.ceil(context.ttl / 1000)} seconds.`,
    }),
    addHeadersOnExceeding: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
    },
    addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
    },
})

//register plugins
app.register(dbPlugin)
app.register(authPlugin)

//routes after plugin
app.register(authRoutes, { prefix: '/api' })
app.register(profileRoute, { prefix: "/api" })
app.register(matchesRoute, { prefix: '/api' })

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