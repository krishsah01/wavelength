## What does this PR do?

Adds rate limiting across the API to protect against brute-force login attacks and AI-cost exhaustion abuse.

- Installs `@fastify/rate-limit` and registers a global limit of 100 requests/minute per IP on all routes
- Applies a strict per-route limit on `POST /api/auth/login`: 10 requests / 15 minutes per IP, with a generic 429 message that does not reveal account existence
- Applies per-user rate limits on AI-cost routes (keyed by `userId` to prevent IP-rotation bypass): `POST /api/profile` capped at 10/hour; `GET /api/matches/:id/starters` capped at 30/hour
- All 429 responses include a human-readable message and are served before business logic runs
- Rate limit headers (`x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`) are added to all responses
- CORS `origin` is now driven by `CORS_ORIGIN` env var with fallback to `http://localhost:3000`

## Related Issue

Closes #61

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

- The `keyGenerator` on authenticated routes falls back to `request.ip` for the case where `request.user` is not yet populated (e.g. pre-auth middleware failure). This ensures unauthenticated abuse is also caught.
- Login limit uses IP-based keying intentionally so a single attacker can't bypass it by registering many accounts.
- The `errorResponseBuilder` always returns the same body shape regardless of route to avoid leaking rate limit state.

## Summary (AI generated)

Implements three layers of rate limiting: a global 100 req/min IP limit across all routes, a strict 10-per-15-min IP limit on the login endpoint to block brute-force attacks, and per-user hourly limits on the two AI-backed routes to prevent cost exhaustion. Rate limit headers are exposed on every response for client-side backoff implementation.
