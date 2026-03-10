import { VoyageAIClient } from "voyageai"

const voyage = new VoyageAIClient({
    apiKey: process.env.VOYAGE_API_KEY
})

export async function generateEmbedding(text: string): Promise<number[]> {
    if (text.trim().length === 0) {
        throw new Error('Input text cannot be empty')
    }

    const response = await voyage.embed({
        model: 'voyage-3',
        input: text,
        inputType: "document"
    })

    if (!response.data || !response.data[0].embedding) {
        throw new Error('Invalid response from Voyage API')
    }

    return response.data[0].embedding
}
