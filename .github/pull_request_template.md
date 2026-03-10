## What does this PR do?

Adds `POST /api/profile` — a protected endpoint that creates or updates a user's profile. It validates bio length, generates a Voyage AI embedding from the bio text, and upserts the result into the `profiles` table. Also corrects the embedding vector dimension in `db/init.sql` from 1536 to 1024 to match the `voyage-3` model output, and adds `VOYAGE_API_KEY` to the Docker Compose API environment.

## Related Issue

Closes #13

## Type of change

- [x] New feature
- [ ] Bug fix
- [ ] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- `db/init.sql` vector dimension corrected from `VECTOR(1536)` to `VECTOR(1024)` — `voyage-3` outputs 1024-dimensional embeddings, not 1536.
- `POST /api/profile` always responds with `201` even when it's an update (upsert). Consider returning `200` on update and `201` on first creation, or use `200` consistently since the SQL is `ON CONFLICT DO UPDATE`.
- `request.user` is cast with `as { userId: UUID }` — `request.user` is typed from `fastify.d.ts` so the cast is redundant and can be simplified to just `request.user!`.
- `BIO_MAX_LENGTH` and `BIO_MIN_LENGTH` are defined as route-level constants on every request. These are good candidates to hoist to module scope.
- The 400 error body is a plain string (`"Bio should be between 50 and 5000 characters"`) while all other routes return `{ error: '...' }` objects. Worth aligning for consistency.
- `VOYAGE_API_KEY` added to `docker-compose.yml` environment — requires the key to be set in `.env`.

## Summary (AI generated)

This branch introduces `src/routes/profile.ts`, which exposes `POST /api/profile`. The route is gated by `app.authenticate`, extracts `userId` from the verified JWT, validates the `bio` field (50–5000 chars), generates a 1024-dimensional embedding via the Voyage AI service, and upserts the result into `profiles` using `ON CONFLICT (user_id) DO UPDATE`. The existing HNSW index on `profiles.embedding` using cosine similarity will be used for matching queries. The `voyage-3` vector dimension mismatch in `init.sql` is also corrected in this PR.
