## What does this PR do?

Implements the end-to-end direct messaging feature between connected users.
- Adds a `messages` table with strict connection constraints (IDOR prevention) and 1000-character payload limits.
- Creates REST endpoints (`GET /api/messages/:connectionId` and `POST /api/messages/:connectionId`) for paginated history and fallback sending.
- Implements secure, authenticated WebSocket channels (`/api/ws`) for real-time bidirectional communication tightly bound to specific connections.
- Adds the `MessagesClient.tsx` frontend React layout for chatting natively in the browser.

## Related Issue

Closes #<issue_number>

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

- Security: The backend still requires server-side HTML sanitization (e.g., `DOMPurify`) to aggressively sanitize payloads (React's default escaping protects the front-end, but Defense-in-Depth is necessary).
- Missing Rate Limiting: There is currently no strict throttling on WebSocket message broadcasts. 
- UI: Unmatching/Blocking UI needs to be added so users can cleanly trigger the database `ON DELETE CASCADE`.

## Summary

This PR ships the data models, real-time WebSocket infrastructure, and frontend architecture required for real-time messaging between accepted Wavelength connections.
