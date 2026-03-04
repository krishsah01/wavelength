## What does this PR do?

Sets up the Fastify API with TypeScript, a PostgreSQL database plugin, CORS support, and a `/health` endpoint. Switches the module system from ESM to CommonJS to resolve `ts-node` compatibility issues in Docker.

## Related Issue
<!-- e.g. Closes #3 -->

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

- `tsconfig.json` uses `module: "commonjs"` and `moduleResolution: "node"` — this was necessary because `ts-node --esm` does not support `.ts` file extensions in Node's ESM loader. CommonJS avoids this entirely and is the standard choice for `ts-node` setups.
- `"type": "module"` was removed from `package.json` for the same reason — it conflicts with CommonJS `ts-node` execution.
- Imports in `index.ts` use bare specifiers (`./plugins/db` not `./plugins/db.js`) which is correct for CommonJS.
- `db.ts` uses `pg`'s default export with destructured `Pool` (`import pg from 'pg'; const { Pool } = pg`) — this is required because `pg` is a CommonJS module and `esModuleInterop: true` is enabled.
- `@types/pg` was added as a devDependency to resolve TypeScript's implicit `any` type error on the `pg` import.
- The `DATABASE_URL` env var is read from `process.env` — ensure it is set in the Docker environment (via `docker-compose.yml`).

## Summary (AI generated)

This branch bootstraps the Fastify API service. It introduces `src/index.ts` as the entry point, which wires up CORS (restricted to `http://localhost:3000`), a PostgreSQL database plugin, and a `/health` route returning `{ status: "ok" }`. The database plugin (`src/plugins/db.ts`) uses `fastify-plugin` to ensure the decorated `db` pool is available across the whole app. The module system was intentionally switched from ESM to CommonJS to be compatible with `ts-node` in the Docker dev environment.
