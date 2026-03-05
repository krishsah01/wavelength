import { FastifyInstance } from "fastify";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from "../types/db";

export default async function authRoutes(app: FastifyInstance) {
    app.post('/auth/register', async (request, reply) => {
        const { email, username, password } = request.body as {
            email: string
            username: string
            password: string
        }

        if (!email || !username || !password) {
            return reply.code(400).send({ error: 'Email, username and password are required' })
        }

        const existingEmail = await app.db.query<User>(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if (existingEmail.rows.length > 0) {
            return reply.code(409).send({ error: 'Email already exists' })
        }

        const usernameExists = await app.db.query<User>(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )

        if (usernameExists.rows.length > 0) {
            return reply.code(409).send({ error: 'Username already exists' })
        }

        const password_hash = await bcrypt.hash(password, 10)

        const registerUser = await app.db.query<User>(
            'INSERT INTO users (username, password_hash, email) VALUES($1, $2, $3) RETURNING id, email, username', [username, password_hash, email]
        )

        const user = registerUser.rows[0]

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        return reply.code(201).send({ token, user, message: 'User successfully created' })
    })
    app.post('/auth/login', async (request, reply) => {
        const { email, password } = request.body as {
            email: string
            password: string
        }

        if (!email || !password) {
            return reply.code(400).send({ error: 'Email and password are required' })
        }

        const checkEmail = await app.db.query<User>(
            'SELECT * FROM users where email = $1', [email]
        )

        if (checkEmail.rows.length === 0) {
            return reply.code(401).send({ error: 'Invalid email or password' })
        }

        const user = checkEmail.rows[0]

        const verifyPassword = await bcrypt.compare(password, user.password_hash)

        if (!verifyPassword) {
            return reply.code(401).send({ error: 'Invalid email or password' })
        }

        const token = jwt.sign({ userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )
        return reply.code(200).send({ token, message: 'Login successful' })
    })
}