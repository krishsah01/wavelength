import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import { ConversationStarter, Profile } from "../types/db";
import { generateStarters } from "../services/starters";

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

    app.get('/matches/:id/starters', { preHandler: app.authenticate }, async (request, reply) => {
        const { userId } = request.user as
            {
                userId: UUID
            }
        const { id: matchId } = request.params as
            {
                id: UUID
            }

        const pair = [userId, matchId]
        const normalizedPair = pair.sort()

        const existingStarters = await app.db.query<ConversationStarter>(
            'SELECT starters FROM conversation_starters WHERE user_a_id = $1 AND user_b_id = $2', normalizedPair
        )

        if (existingStarters.rows.length > 0) {
            return reply.code(200).send({ starters: existingStarters.rows[0].starters, message: "Successfully Found Starters" })
        }

        const fetchBios = await app.db.query<Profile>(
            'SELECT bio FROM profiles WHERE user_id IN ($1,$2)', [userId, matchId]
        )

        if (fetchBios.rows.length < 2) {
            return reply.code(404).send({ error: 'Match not found' })
        }

        const bio1: string = fetchBios.rows[0].bio
        const bio2: string = fetchBios.rows[1].bio

        const starters: string[] = await generateStarters(bio1, bio2)

        const starterJson: string = JSON.stringify(starters)

        await app.db.query<ConversationStarter>(
            'INSERT INTO conversation_starters (user_a_id, user_b_id, starters) VALUES ($1,$2,$3)', [normalizedPair[0], normalizedPair[1], starterJson]
        )

        return reply.code(200).send({ starters, message: "Starters fetched or created successfully" })
    })
}