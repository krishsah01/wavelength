CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    bio TEXT NOT NULL,
    embedding VECTOR(1536),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (requester_id, receiver_id)
);

CREATE TABLE conversation_starters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id),
    user_b_id UUID REFERENCES users(id),
    starters JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_a_id, user_b_id)
);

CREATE INDEX ON profiles USING hnsw (embedding vector_cosine_ops);
