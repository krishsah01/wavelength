import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import { generateEmbedding } from "../services/embedding";
import { Profile } from "../types/db";

const UUID_PATTERN = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'

const upsertProfileSchema = {
    body: {
        type: 'object',
        required: ['bio'],
        additionalProperties: false,
        properties: {
            bio: { type: 'string', minLength: 50, maxLength: 5000 },
        },
    },
}

const getProfileSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', pattern: UUID_PATTERN },
        },
    },
}

export default async function profileRoute(app: FastifyInstance) {
    app.post('/profile', { preHandler: app.authenticate, schema: upsertProfileSchema }, async (request, reply) => {
        try {
            const { userId } = request.user as { userId: UUID }
            const { bio } = request.body as { bio: string }

            const embedding = await generateEmbedding(bio)

            const updateProfile = await app.db.query<Profile>(
                'INSERT INTO profiles (user_id, bio, embedding) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET bio = $2, embedding = $3, updated_at = now() RETURNING user_id, bio',
                [userId, bio, JSON.stringify(embedding)]
            )

            return reply.code(201).send({ profile: updateProfile.rows[0], message: 'Profile created or updated' })

        } catch (err) {
            app.log.error(err)
            return reply.code(500).send({ statusCode: 500, error: 'Internal Server Error', message: 'Internal server error' })
        }
    })

    app.get('/profile/:id', { preHandler: app.authenticate, schema: getProfileSchema }, async (request, reply) => {
        const { id } = request.params as { id: UUID }

        const profile = await app.db.query<Profile>(
            'SELECT username, bio, created_at FROM users INNER JOIN profiles ON profiles.user_id = users.id WHERE users.id = $1',
            [id]
        )

        if (profile.rows.length <= 0) {
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'User or profile does not exist' })
        }

        return reply.code(200).send({ profile: profile.rows[0], message: 'Profile found successfully' })
    })
}
