## What does this PR do?

Adds the database schema initialization script (`db/init.sql`) for the Wavelength project. Creates all four tables (`users`, `profiles`, `connections`, `conversation_starters`) with pgvector support, unique constraints, and an HNSW index for cosine similarity search on profile embeddings. Updates `docker-compose.yml` to mount the init script so the schema auto-runs on first boot.

## Related Issue
<!-- e.g. Closes #3 -->

## Type of change

- [ ] New feature
- [ ] Bug fix
- [ ] Refactor
- [x] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- `profiles.user_id` has a `UNIQUE` constraint enforcing a one-to-one relationship with `users`
- `connections` has a `UNIQUE (requester_id, receiver_id)` to prevent duplicate requests
- `conversation_starters` has a `UNIQUE (user_a_id, user_b_id)` so starters are only generated once per pair
- An HNSW index is used on `profiles.embedding` with `vector_cosine_ops` for fast similarity search
- The init script is mounted via `docker-compose.yml` into `/docker-entrypoint-initdb.d/` — it only runs on the first `docker compose up` (fresh volume)

## Summary (AI generated)

This branch adds the database layer for Wavelength. The `db/init.sql` script enables the pgvector extension and creates four tables: `users` (auth), `profiles` (bios + 1536-dim embeddings), `connections` (friend requests), and `conversation_starters` (AI-generated icebreakers). All tables use UUID primary keys. Unique constraints prevent duplicate connections and conversation starter pairs. An HNSW index on `profiles.embedding` enables efficient cosine similarity matching. The `docker-compose.yml` is updated to mount the init script so Postgres auto-initializes on first boot.
