## What does this PR do?

Adds Dockerfiles for the `api` (Fastify) and `web` (Next.js) services, completing the Docker infrastructure for local development.

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

- Both Dockerfiles use `npm run dev` — suitable for development. Switch to `npm run build && npm start` for production.
- No `.dockerignore` files yet — consider adding them to exclude `node_modules/`, `.env`, etc. from the build context for faster builds.

## Summary (AI generated)

This branch adds two Dockerfiles that complete the container setup referenced by `docker-compose.yml`. Both use `node:20-alpine` as the base image, follow Docker layer caching best practices (`COPY package*.json` + `npm install` before `COPY . .`), and expose the correct ports (`4000` for api, `3000` for web). Both are configured for development with `npm run dev`.
