import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import { ConversationStarter, Profile } from "../types/db";
import { generateStarters } from "../services/starters";

const UUID_PATTERN = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'

const startersParamsSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', pattern: UUID_PATTERN },
        },
    },
}

export async function matchesRoute(app: FastifyInstance) {
    app.get("/matches", { preHandler: app.authenticate }, async (request, reply) => {
        const { userId } = request.user as
            {
                userId: UUID
            }

        const embedding = await app.db.query<Profile>(
            'SELECT embedding FROM profiles WHERE user_id = $1', [userId]
        )

        if (embedding.rows.length <= 0) {
            return reply.code(404).send({ message: "Cannot match without completing onboarding" })
        }

        const similarityCheck = await app.db.query<Profile>(
            'SELECT u.username, LEFT(p.bio, 150) AS bio, ROUND((1 - (p.embedding <=> $1::vector))::numeric, 2) AS score FROM profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id != $2 ORDER BY p.embedding <=> $1::vector LIMIT 10', [embedding.rows[0].embedding, userId]
        )


        return reply.code(200).send({ matches: similarityCheck.rows })

    })

    app.get('/matches/:id/starters', { preHandler: app.authenticate, schema: startersParamsSchema }, async (request, reply) => {
        const { userId } = request.user as { userId: UUID }
        const { id: matchId } = request.params as { id: UUID }

        const normalizedPair = [userId, matchId].sort()
        const userIsA = normalizedPair[0] === userId
        const startersColumn = userIsA ? 'starters_a_to_b' : 'starters_b_to_a'

        const existingRow = await app.db.query<{ starters: string[] | null }>(
            `SELECT ${startersColumn} AS starters FROM conversation_starters WHERE user_a_id = $1 AND user_b_id = $2`,
            normalizedPair
        )
        if (existingRow.rows.length > 0 && existingRow.rows[0].starters !== null) {
            return reply.code(200).send({ starters: existingRow.rows[0].starters, message: "Successfully Found Starters" })
        }

        const fetchBios = await app.db.query<Profile>(
            'SELECT user_id, bio FROM profiles WHERE user_id IN ($1,$2)', [userId, matchId]
        )

        if (fetchBios.rows.length < 2) {
            return reply.code(404).send({ error: 'Match not found' })
        }

        const matchBio = fetchBios.rows.find(r => r.user_id === matchId)?.bio
        if (!matchBio) {
            return reply.code(404).send({ error: 'Match profile not found' })
        }

        const senderBio = fetchBios.rows.find(r => r.user_id === userId)?.bio
        if (!senderBio) {
            return reply.code(404).send({ error: 'Your profile not found' })
        }

        const starters: string[] = await generateStarters(senderBio, matchBio)
        const startersJson: string = JSON.stringify(starters)

        await app.db.query<ConversationStarter>(
            `INSERT INTO conversation_starters (user_a_id, user_b_id, ${startersColumn})
         VALUES ($1, $2, $3)
         ON CONFLICT (user_a_id, user_b_id)
         DO UPDATE SET ${startersColumn} = $3`,
            [normalizedPair[0], normalizedPair[1], startersJson]
        )

        return reply.code(200).send({ starters, message: "Starters fetched or created successfully" })
    })
}