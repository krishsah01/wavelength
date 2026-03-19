import { FastifyInstance } from "fastify";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from "../types/db";

const isProd = process.env.NODE_ENV === 'production'

const JWT_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
}

const registerSchema = {
    body: {
        type: 'object',
        required: ['email', 'username', 'password'],
        additionalProperties: false,
        properties: {
            email: { type: 'string', format: 'email', maxLength: 254 },
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 30,
                pattern: '^[a-zA-Z0-9_]+$',
            },
            password: { type: 'string', minLength: 10, maxLength: 128 },
        },
    },
}

const loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        additionalProperties: false,
        properties: {
            email: { type: 'string', format: 'email', maxLength: 254 },
            password: { type: 'string', minLength: 1, maxLength: 128 },
        },
    },
}

export default async function authRoutes(app: FastifyInstance) {
    app.post('/auth/register', { schema: registerSchema }, async (request, reply) => {
        const { email, username, password } = request.body as {
            email: string
            username: string
            password: string
        }

        const existingEmail = await app.db.query<User>(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if (existingEmail.rows.length > 0) {
            return reply.code(409).send({ statusCode: 409, error: 'Conflict', message: 'Email already in use' })
        }

        const usernameExists = await app.db.query<User>(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )

        if (usernameExists.rows.length > 0) {
            return reply.code(409).send({ statusCode: 409, error: 'Conflict', message: 'Username already in use' })
        }

        const password_hash = await bcrypt.hash(password, 10)

        const registerUser = await app.db.query<User>(
            'INSERT INTO users (username, password_hash, email) VALUES($1, $2, $3) RETURNING id, email, username',
            [username, password_hash, email]
        )

        const user = registerUser.rows[0]

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        reply.setCookie('token', token, JWT_COOKIE_OPTIONS)
        return reply.code(201).send({ user, message: 'User successfully created' })
    })

    app.post('/auth/login', {
        schema: loginSchema,
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '15 minutes',
                errorResponseBuilder: () => ({
                    statusCode: 429,
                    error: 'Too Many Requests',
                    message: 'Too many login attempts. Please try again later.',
                }),
            },
        },
    }, async (request, reply) => {
        const { email, password } = request.body as {
            email: string
            password: string
        }

        const checkEmail = await app.db.query<User>(
            'SELECT * FROM users where email = $1', [email]
        )

        if (checkEmail.rows.length === 0) {
            app.log.warn({ email }, 'Login attempt for unknown email')
            return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid email or password' })
        }

        const user = checkEmail.rows[0]

        const verifyPassword = await bcrypt.compare(password, user.password_hash)

        if (!verifyPassword) {
            app.log.warn({ userId: user.id }, 'Login attempt with wrong password')
            return reply.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        reply.setCookie('token', token, JWT_COOKIE_OPTIONS)
        return reply.code(200).send({ message: 'Login successful' })
    })

    app.post('/auth/logout', { preHandler: app.authenticate }, async (request, reply) => {
        reply.clearCookie('token', { path: '/' })
        return reply.code(200).send({ message: 'Logged out successfully' })
    })
}
