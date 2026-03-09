## What does this PR do?

Adds a `POST /api/auth/logout` route. The route is protected by the `authenticate` preHandler — the client must send a valid Bearer token. On success it returns `{ message: 'Logged out successfully' }`.

## Related Issue

Closes #11

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

- Logout is stateless — the server does not invalidate the token. The client is expected to discard it. If token revocation is needed in the future, a server-side blocklist (e.g. Redis) would be required.
- The route correctly gates on `app.authenticate` as a `preHandler`, so unauthenticated requests are rejected before the handler runs.

## Summary (AI generated)

This branch adds a single route — `POST /api/auth/logout` — to the existing auth router. It uses `app.authenticate` as a `preHandler` to ensure only requests with a valid JWT can hit the endpoint. Since JWTs are stateless, logout is handled client-side by discarding the token; the server simply responds with a 200 confirmation.
