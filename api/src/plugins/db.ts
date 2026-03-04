import pg from 'pg'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

const { Pool } = pg

declare module 'fastify' {
    interface FastifyInstance {
        db: pg.Pool
    }
}

async function dbPlugin(app: FastifyInstance) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })

    await pool.query('SELECT 1')
    app.log.info('Database connected')

    app.decorate('db', pool)

    app.addHook('onClose', async () => {
        await pool.end()
        app.log.info('Database pool closed')
    })
}

export default fp(dbPlugin)