## What does this PR do?

Adds `GET /api/profile/:id` — a protected endpoint that fetches a user's public profile by their user ID. Joins `users` and `profiles` to return `username`, `bio`, and `created_at` in a single query. Returns 404 if no user or profile is found.

## Related Issue

Closes #14

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

- The `LEFT JOIN` means the query will return a row even if the user exists but has no profile yet (`bio` and `created_at` from `profiles` will be `null`). If a `profiles` row is required, use `INNER JOIN` instead — or handle the `null bio` case explicitly before responding.
- The route does not validate that `:id` is a valid UUID before hitting the database. An invalid UUID string will cause a Postgres error that bubbles up as an unhandled exception. Consider wrapping in a try/catch or validating the format first.
- The 404 message has a typo: `"doesnot"` should be `"does not"`.
- Any authenticated user can fetch any other user's profile by ID — this is likely intentional for a social/matching app but worth confirming.

## Summary (AI generated)

This branch adds a `GET /api/profile/:id` route to `src/routes/profile.ts`. The route is gated by `app.authenticate`, accepts a user UUID as a path parameter, and runs a `LEFT JOIN` between `users` and `profiles` to return `username`, `bio`, and `created_at`. Returns 404 if no matching user is found.
