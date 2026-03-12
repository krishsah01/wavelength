## What does this PR do?

- Resolves the bi-directional caching issue for conversation starters by splitting the `starters` column into `starters_a_to_b` and `starters_b_to_a` in the `conversation_starters` table (resolving the logic flaw where User B might hit the cache initialized by User A).
- Initializes a Next.js application in the `web/` directory to serve as the frontend.

## Related Issue

Closes #19

## Type of change

- [x] New feature
- [x] Bug fix
- [ ] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- The database schema change requires dropping and recreating the postgres database or running an explicit alter table if migrating old data. We altered `db/init.sql` directly to make the `starters_a_to_b` and `starters_b_to_a` columns nullable JSONB to support on-demand generation.
- Added `next`, `next-auth`, `react`, `react-dom`, and `axios` to `web` package dependencies. `Next.js` and `Tailwind CSS` configuration files were generated.
- Ensure `ON CONFLICT` logic in `matches.ts` handles the updates correctly when one user has generated starters but the other hasn't. It updates the corresponding column properly.

## Summary (AI generated)

This PR includes two distinct changes: 
1. Database and API updates to support bi-directional caching of conversation starters. The `conversation_starters` table was updated to use `starters_a_to_b` and `starters_b_to_a` columns instead of a single `starters` column. The `/matches/:id/starters` endpoint logic was adjusted to ensure starters are fetched or stored in the correct column based on whether the requester is the "User A" or "User B" in the sorted UUID pair.
2. Next.js initialization in the `web/` directory to prepare for frontend development, configuring Next.js, React, Tailwind CSS, and necessary dependencies.
