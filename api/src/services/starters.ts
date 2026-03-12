import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

export async function generateStarters(bio1: string, bio2: string): Promise<string[]> {
    try {
        if (!bio1 || !bio2 || bio1.trim().length <= 0 || bio2.trim().length <= 0) {
            throw new Error("Bio is invalid")
        }

        const systemPrompt = [
            "You write first messages for a matching app. You sound like a real person — curious, casual, a little playful.",
            "You will receive someone's bio. Write 3 short opening messages TO that person.",
            "",
            "Style guide:",
            "- Talk like you're texting a friend of a friend, not writing a cover letter.",
            "- Each message: react to ONE thing in their bio + ask ONE question. That's it.",
            "- Never start with 'I noticed', 'I see that', 'Since we both', 'It's cool that', or 'We both'.",
            "- Never mention your own interests or hobbies. You're asking about THEIRS.",
            "- Keep it under 25 words.",
            "",
            "Examples of the vibe:",
            '"Restoring old motorcycles is wild — what\'s the most satisfying part, tearing it apart or putting it back together?"',
            '"Ok pour over coffee is a whole lifestyle — do you have a go-to bean or are you still experimenting?"',
            '"Japanese literature rabbit hole, respect. Who got you into it?"',
        ].join("\n")

        const userMessage = `Here is your match's bio:\n"${bio2}"\n\nWrite 3 opening messages. Return ONLY a JSON array of 3 strings, nothing else.`

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 512,
            temperature: 0.9,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userMessage },
                { role: 'assistant', content: '[' }
            ]
        })

        const block = response.content[0]

        if (block.type !== 'text') {
            throw new Error('Unexpected response type from Claude')
        }

        const starters: string[] = JSON.parse('[' + block.text.trim())

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