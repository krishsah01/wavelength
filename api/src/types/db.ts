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
    starters: string[]
    created_at: Date
}