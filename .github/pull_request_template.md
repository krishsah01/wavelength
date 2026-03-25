## What does this PR do?

Hardens the messaging stack for production use by closing key security and reliability gaps in the REST + WebSocket flow.
It adds stricter validation and guardrails on the API/DB layer, introduces safer websocket lifecycle handling and abuse controls, and updates the messaging UI to recover from disconnects and avoid duplicate message rendering.

## Related Issue

Closes #114

## Type of change

- [ ] New feature
- [x] Bug fix
- [x] Refactor
- [x] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- Websocket message creation over WS frames was removed; sending is now REST-only to reduce attack surface and simplify controls.
- Added per-room connection cap and per-socket frame throttling to mitigate abuse/DoS patterns.
- Startup env validation now fails fast on required runtime vars (`JWT_SECRET`, `DATABASE_URL`) and warns for optional AI keys.
- Added `PATCH /api/messages/:connectionId/read` and best-effort read-mark call in the client.
- `AppShell` centralizes shared nav/layout for app pages (`dashboard`, `connections`, `messages`) and removes duplicated shell markup across pages.

## Summary

This PR secures the messaging feature for production by improving input validation, websocket safety, runtime configuration checks, and client resilience while preserving current UX and route behavior.
