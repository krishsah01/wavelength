## What does this PR do?

Sets up Docker infrastructure for the Wavelength project: Postgres with pgvector, plus scaffolded service definitions for the `api` (Fastify) and `web` (Next.js) containers. Adds `.env.example` for environment variable documentation, `.gitignore` entry for `.env`, and a PR template.

## Related Issue
<!-- e.g. Closes #3 -->

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

- `api` and `web` Dockerfiles (`./api`, `./web`) don't exist yet — expected, as those phases come next.
- `NEXT_PUBLIC_API_URL` is hardcoded to `http://api:4000` in the `web` service — works inside Docker networking but would need overriding for local dev outside Docker.
- The build guide markdown is committed to the repo root with a long filename — may want to move to `docs/build-guide.md` in a future cleanup.

## Summary (AI generated)

This branch introduces the foundational Docker and database infrastructure for Wavelength. The `docker-compose.yml` defines three services — `postgres` (pgvector/pg16), `api` (Fastify), and `web` (Next.js) — with environment variable substitution from `.env`. A `.env.example` template lists all required vars including `NEXTAUTH_SECRET`. The `.gitignore` is updated to exclude `.env`. A PR template and comprehensive build guide document are also included.
