export interface User {
    id: string
    email: string
    username: string
    password_hash: string
    created_at: Date
}

export interface Profile {
    id: string
    user_id: string
    bio: string
    avatar_url?: string | null
    embedding: number[]
    updated_at: Date
}

export interface Connection {
    id: string
    requester_id: string
    receiver_id: string
    status: string
    created_at: Date
}

export interface ConversationStarter {
    id: string
    user_a_id: string
    user_b_id: string
    starters_a_to_b: string[]
    starters_b_to_a: string[]
    created_at: Date
}

export interface Message {
    id: string
    connection_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: Date
}