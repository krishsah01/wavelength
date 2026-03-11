## What does this PR do?

Adds `GET /api/matches` — a protected endpoint that computes semantic similarity between the authenticated user's profile embedding and all other users' embeddings using pgvector's cosine distance operator (`<=>`). Returns up to 10 matches ranked by similarity score, each with a truncated bio and a rounded score. Returns 404 if the requesting user has no profile/embedding yet.

## Related Issue

Closes #15

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

- The similarity score is computed as `1 - (p.embedding <=> $1::vector)` (cosine distance), rounded to 2 decimal places. A score of 1.0 = identical, 0.0 = orthogonal — the `ROUND(...::numeric, 2)` cast is required because pgvector returns a `float4` and Postgres's `ROUND` only accepts `numeric`.
- The route fetches the user's own embedding in a first query, then runs the similarity query. This is two round-trips; it could be folded into a single CTE if performance becomes a concern.
- The result type for both queries is typed as `Profile`, but the similarity query returns `{ username, bio, score }` — not a `Profile`. A dedicated result type (e.g. `MatchResult`) would be more accurate and avoid potential type confusion.
- `LEFT(p.bio, 150)` truncates bios in the response, which is sensible for list views. The full bio is never exposed here, which is appropriate.
- There is no guard against a user who has a `profiles` row but a `null` or zero-length embedding vector — the cosine distance query would still run but results would be meaningless. Worth adding a check or ensuring the embedding service always writes a non-null vector.

## Summary (AI generated)

This branch adds a new `GET /api/matches` route in `api/src/routes/matches.ts` and registers it in `api/src/index.ts`. The route is protected by `app.authenticate`, extracts the caller's `userId` from the JWT, fetches their stored embedding from `profiles`, then runs a pgvector cosine similarity query against all other users' profiles. Results are ordered by descending similarity, limited to 10, and include each user's `username`, a 150-character bio preview, and a numeric similarity `score`.
