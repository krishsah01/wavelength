## What does this PR do?

Adds explicit authorization checks on the two endpoints that were vulnerable to Broken Object-Level Authorization (BOLA/IDOR — OWASP API Security Top 10 #1).

**`GET /api/matches/:id/starters` — BOLA mitigation:**
Before generating or returning conversation starters, the endpoint now verifies that `matchId` is actually in the requesting user's top-10 cosine similarity match results. If a user tries to request starters for an arbitrary UUID that is not their match, the server returns 403 and logs a warn-level security event. This prevents:
- Scraping bios for arbitrary user pairs
- Triggering Claude API calls for any user combination
- Enumerating user profiles via the starters endpoint

**`GET /api/profile/:id` — access policy documented (Option A):**
Profile data (username, bio, join date) remains visible to all authenticated users. This is an intentional policy choice for a social discovery platform. The decision is documented in a comment directly in the route handler so future engineers know it was a deliberate decision, not an oversight.

**Additional improvements in this PR:**
- `GET /matches` now returns `user_id` in each match row so the frontend can resolve starters requests by user ID without additional lookups
- UUID param schema added to `GET /matches/:id/starters` (in line with the schema-validation work from #63)
- Error response shapes normalized to `{ statusCode, error, message }` on match/profile routes

## Related Issue

Closes #64

## Type of change

- [ ] New feature
- [x] Bug fix
- [ ] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- The BOLA check runs a second cosine similarity query (the same one used by `GET /matches`). This adds one DB round-trip per uncached starters request. For a v1 app this is acceptable. If latency becomes a concern, the match list can be cached in Redis with a short TTL.
- The warn-level log on BOLA attempts includes `userId` and `matchId` — no PII beyond identifiers. This enables security monitoring without leaking bio content.

## Summary (AI generated)

Closes the BOLA vulnerability on the starters endpoint by verifying that the target user is in the requesting user's actual match list before serving or generating any starters. An unauthorized attempt returns 403 and is logged. The profile endpoint's open access policy is now explicitly documented as an intentional design decision rather than an unreviewed gap.
