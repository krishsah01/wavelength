import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import sharp from "sharp";
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
    app.post('/profile', {
        preHandler: app.authenticate,
        schema: upsertProfileSchema,
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 hour',
                keyGenerator: (request) => (request.user as { userId: string } | undefined)?.userId ?? request.ip,
                errorResponseBuilder: () => ({
                    statusCode: 429,
                    error: 'Too Many Requests',
                    message: 'Profile update limit reached. You can update your profile up to 10 times per hour.',
                }),
            },
        },
    }, async (request, reply) => {
        try {
            const { userId } = request.user as { userId: UUID }
            const { bio } = request.body as { bio: string }

            app.log.info({ userId, bioLength: bio.length }, 'Generating profile embedding')

            const embedding = await generateEmbedding(bio)

            const updateProfile = await app.db.query<Profile>(
                'INSERT INTO profiles (user_id, bio, embedding) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET bio = $2, embedding = $3, updated_at = now() RETURNING user_id, bio',
                [userId, bio, JSON.stringify(embedding)]
            )

            return reply.code(201).send({ profile: updateProfile.rows[0], message: 'Profile created or updated' })

        } catch (err) {
            app.log.error({ err }, 'Profile upsert failed')
            return reply.code(500).send({ statusCode: 500, error: 'Internal Server Error', message: 'Internal server error' })
        }
    })

    // POST /profile/avatar — upload and store a resized avatar
    app.post('/profile/avatar', { preHandler: app.authenticate }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }

        const data = await request.file()
        if (!data) return reply.code(400).send({ message: 'No file uploaded' })

        const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!ALLOWED.includes(data.mimetype)) {
            return reply.code(400).send({ message: 'Only JPEG, PNG, WebP, or GIF allowed' })
        }

        const buffer = await data.toBuffer()

        const processed = await sharp(buffer)
            .resize(256, 256, { fit: 'cover', position: 'centre' })
            .webp({ quality: 80 })
            .toBuffer()

        if (processed.length > 100 * 1024) {
            return reply.code(400).send({ message: 'Image too large after processing (max 100 KB)' })
        }

        const dataUrl = `data:image/webp;base64,${processed.toString('base64')}`

        // UPDATE only — profile must already exist (bio required by onboarding first).
        // Avoids the bio NOT NULL constraint violation if someone hits this before onboarding.
        const result = await app.db.query(
            `UPDATE profiles SET avatar_url = $2 WHERE user_id = $1 RETURNING user_id`,
            [userId, dataUrl]
        )

        if (result.rows.length === 0) {
            return reply.code(404).send({ message: 'Complete onboarding before uploading an avatar' })
        }

        return reply.code(200).send({ avatar_url: dataUrl, message: 'Avatar updated' })
    })

    // GET /profile/me — returns the authenticated user's own profile
    app.get('/profile/me', { preHandler: app.authenticate }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }

        const profile = await app.db.query<Profile>(
            'SELECT u.username, p.bio, p.avatar_url, u.created_at FROM users u INNER JOIN profiles p ON p.user_id = u.id WHERE u.id = $1',
            [userId]
        )

        if (profile.rows.length === 0) {
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'Profile not found' })
        }

        return reply.code(200).send({ profile: profile.rows[0] })
    })

    // Access policy (Option A — intentional): profile data (username, bio, join date) is
    // visible to any authenticated user. This is appropriate for a social discovery platform
    // where the goal is for users to find and read each other's interests.
    // If privacy requirements change, restrict to accepted-connection pairs here.
    app.get('/profile/:id', { preHandler: app.authenticate, schema: getProfileSchema }, async (request, reply) => {
        const { id } = request.params as { id: UUID }

        const profile = await app.db.query<Profile>(
            'SELECT u.username, p.bio, p.avatar_url, u.created_at FROM users u INNER JOIN profiles p ON p.user_id = u.id WHERE u.id = $1',
            [id]
        )

        if (profile.rows.length <= 0) {
            return reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'User or profile does not exist' })
        }

        return reply.code(200).send({ profile: profile.rows[0], message: 'Profile found successfully' })
    })
}
