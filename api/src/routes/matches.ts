import { FastifyInstance } from "fastify";
import { UUID } from "node:crypto";
import { Profile } from "../types/db";

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
}