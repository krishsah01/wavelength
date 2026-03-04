import pg from 'pg'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

const { Pool } = pg

async function dbPlugin(app: FastifyInstance) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })

    await pool.query('SELECT 1')
    app.log.info('Database connected')

    app.decorate('db', pool)
}

export default fp(dbPlugin)