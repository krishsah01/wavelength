import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import { generateEmbedding } from "../services/embedding";
import { Profile } from "../types/db";

export default async function profileRoute(app: FastifyInstance) {
    app.post('/profile', { preHandler: app.authenticate }, async (request, reply) => {
        try {
            const { userId } = request.user as
                {
                    userId: UUID
                }

            const { bio } = request.body as
                {
                    bio: string
                }

            const BIO_MAX_LENGTH: number = 5000
            const BIO_MIN_LENGTH: number = 50

            if (bio.length > BIO_MAX_LENGTH || bio.length < BIO_MIN_LENGTH) {
                return reply.code(400).send("Bio should be between 50 and 5000 characters")
            }

            const embedding = await generateEmbedding(bio)

            const updateProfile = await app.db.query<Profile>(
                'INSERT INTO profiles (user_id, bio, embedding) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET bio = $2, embedding = $3, updated_at = now() RETURNING user_id, bio', [userId, bio, JSON.stringify(embedding)]
            )

            const profile = updateProfile.rows[0]

            return reply.code(201).send({ profile: profile, message: 'Profile created or updated' })

        } catch (err) {
            app.log.error(err)
            return reply.code(500).send({ error: 'Internal server error' })
        }
    })
}