import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

export async function generateStarters(bio1: string, bio2: string): Promise<string[]> {
    try {
        if (!bio1 || !bio2 || bio1.trim().length <= 0 || bio2.trim().length <= 0) {
            throw new Error("Bio is invalid")
        }

        const PROMPT = `You are a matchmaker helping two people start a conversation based on their shared interests.

        Person A: ${bio1}
        Person B: ${bio2}

        Generate exactly 3 specific, genuine conversation starters based on their shared interests. Each starter should reference something concrete from both bios.

        Return ONLY a JSON array of 3 strings. No explanation, no preamble, no markdown backticks. Example format:
        ["starter 1", "starter 2", "starter 3"]`

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [
                { role: 'user', content: PROMPT }
            ]
        })

        const block = response.content[0]

        if (block.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        const starters: string[] = JSON.parse(block.text)

        if (!starters) {
            throw new Error("Model error")
        }

        if (starters.length !== 3) {
            throw new Error("something went wrong")
        }

        return starters
    } catch (err) {
        console.error(err)
        throw err
    }
}