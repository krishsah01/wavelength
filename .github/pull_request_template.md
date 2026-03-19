## What does this PR do?

Moves the JWT out of `localStorage` (XSS-accessible) into an HTTP-only cookie managed by the API. This is the standard mitigation for session token theft via cross-site scripting.

**API changes:**
- Installs `@fastify/cookie` and registers it before the auth plugin
- `POST /api/auth/login` and `POST /api/auth/register` now call `reply.setCookie('token', token, { httpOnly: true, secure: true (prod), sameSite: 'strict', maxAge: 7d })` and no longer return the raw JWT in the response body
- `POST /api/auth/logout` calls `reply.clearCookie('token')` to expire the cookie server-side
- `plugins/auth.ts` now reads the token from `request.cookies.token` first, then falls back to `Authorization: Bearer` header for API clients and mobile apps
- CORS updated to `credentials: true` (already present in the rate-limiting PR) so cross-origin cookie exchange works

**Frontend changes:**
- `web/lib/api.ts`: removed `localStorage.getItem('token')` and the `Authorization` header injection; replaced with `withCredentials: true` on the Axios instance so the browser sends the cookie automatically
- `web/app/api/auth/[...nextauth]/route.ts`: authorize callback no longer stores the raw JWT in the session; returns a minimal `{ id }` object; session callbacks pass through without token propagation
- `web/types/next-auth.d.ts`: removed the `token` field augmentations from `User`, `Session`, and `JWT` — they are no longer needed

## Related Issue

Closes #62

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

- The `Bearer` header fallback in `auth.ts` is intentional: API clients (mobile apps, Postman) that cannot use cookies can still authenticate. Once a mobile client is built, this can be tightened to cookie-only in browser contexts.
- `secure: isProd` means the cookie is sent over plain HTTP in local development. This is expected behaviour — enforcing `Secure` on localhost would break the dev workflow.
- The NextAuth `authorize` call includes `withCredentials: true` so the `Set-Cookie` from the API login endpoint is forwarded to the browser during the NextAuth handshake.

## Summary (AI generated)

Removes all client-side JWT storage. The token is now a server-set `HttpOnly; SameSite=Strict` cookie that JavaScript cannot read, eliminating the primary XSS session hijacking vector. The API auth plugin accepts both cookie and Bearer header so existing API client workflows are unaffected. The NextAuth session is simplified to a presence/absence signal with no sensitive material stored.
