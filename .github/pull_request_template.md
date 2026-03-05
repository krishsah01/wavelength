## What does this PR do?

Implements JWT-based authentication for the API. Adds a register and login route under `/api/auth`, a reusable `authenticate` middleware plugin, and TypeScript type declarations for the extended `FastifyInstance` and `FastifyRequest`. Also adds `bcrypt` and `jsonwebtoken` as dependencies.

## Related Issue

Closes #8
Closes #9
Closes #10

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

- `JWT_SECRET` is read directly from `process.env.JWT_SECRET as string` without a null-check. If the env var is missing, `jwt.sign` / `jwt.verify` will throw at runtime. Consider asserting it exists at startup.
- `POST /auth/register` returns the full `user` row in the response body, including `password_hash`. Strip sensitive fields (at minimum `password_hash`) before sending.
- The login route uses `SELECT *` — prefer selecting only the columns you need (e.g. `SELECT id, email, username, password_hash`) to avoid accidentally leaking future columns.
- `request.body` is cast with `as { ... }` in both routes. Consider using Fastify's JSON schema validation (`schema: { body: ... }`) to get automatic validation and type inference at the framework level.
- `tsconfig.json` had a trailing comma after `skipLibCheck` (invalid JSON) — fixed in this PR.
- `files: ["src/types/fastify.d.ts"]` in `tsconfig.json` is redundant since `include: ["src/**/*"]` already covers it. Harmless but worth tidying.

## Summary (AI generated)

This branch adds JWT authentication to the Fastify API. `src/plugins/auth.ts` registers an `authenticate` decorator that extracts and verifies a Bearer token from the `Authorization` header, attaching the decoded payload to `request.user`. `src/routes/auth.ts` exposes two routes — `POST /api/auth/register` (hashes password with bcrypt, inserts user, returns JWT) and `POST /api/auth/login` (verifies credentials, returns JWT). `src/types/fastify.d.ts` augments the Fastify module to type `app.db`, `app.authenticate`, and `request.user`. `src/types/db.ts` defines TypeScript interfaces mirroring the database schema (`User`, `Profile`, `Connection`, `ConversationStarter`).
