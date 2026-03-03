## What does this PR do?

Adds minimal `package.json` files for the `api` and `web` services so that Docker can build the containers and `docker compose up` runs successfully.

## Related Issue

Closes #5

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

- Both `package.json` files are boilerplate from `npm init` — dependencies and scripts will be added as the api and web services are built out in later phases.
- `docker compose up` confirmed working locally.

## Summary (AI generated)

This branch adds the initial `package.json` files for both the `api` and `web` services, enabling Docker to build the containers referenced in `docker-compose.yml`. The full stack (`postgres`, `api`, `web`) now spins up successfully with `docker compose up`.
