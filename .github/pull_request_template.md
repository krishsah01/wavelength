## What does this PR do?

Adds declarative JSON Schema validation to all Fastify routes so malformed payloads are rejected at the framework boundary before any business logic or database queries run.

- `POST /api/auth/register`: enforces `email` (format: email, max 254 chars), `username` (3–30 chars, alphanumeric + underscore only), `password` (10–128 chars); `additionalProperties: false` strips unexpected fields
- `POST /api/auth/login`: enforces `email` (format: email) and `password` presence; `additionalProperties: false`
- `POST /api/profile`: enforces `bio` (50–5000 chars) via schema — removes the manual length check
- `GET /profile/:id` and `GET /matches/:id/starters`: enforce UUID v4 format on `:id` param — non-UUID values return 400 before the DB is touched
- AJV `formats.email` regex added to the Fastify instance options so `format: 'email'` is actually validated
- All error responses normalized to `{ statusCode, error, message }` shape
- Removed all manual `if (!email || !username)` guards now replaced by schema

## Related Issue

Closes #63

## Type of change

- [ ] New feature
- [ ] Bug fix
- [x] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- `additionalProperties: false` on request bodies is important — without it, a client could send extra fields that silently pass through and potentially confuse handler logic.
- The UUID pattern used is a standard v4 regex. Fastify validates it before the handler runs, so any non-UUID `:id` will get a 400 automatically.
- The AJV `customOptions.formats` approach is the correct way to add custom format validators in Fastify v5 without adding the full `ajv-formats` package.

## Summary (AI generated)

Replaces ad-hoc manual validation in route handlers with declarative JSON Schema definitions enforced by Fastify's built-in AJV integration. All request bodies and UUID path parameters are now validated before business logic executes, returning consistent 400 errors for invalid input. Error response shapes are normalized across all routes.
