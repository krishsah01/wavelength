## What does this PR do?

Builds the registration page at `/register` with client-side validation and inline error handling.

- Split layout: left branding panel (desktop), right form panel — matches Stitch UI mockup
- Fields: Full Name, Email, Username, Password, Confirm Password
- Client-side validation: email format, username min 3 chars + alphanumeric-only, password min 10 chars, passwords match
- POST `/api/auth/register` via `api.ts` (HTTP-only cookie set by server)
- After success: calls `signIn('credentials')` to establish NextAuth session, then redirects to `/onboarding`
- Inline per-field errors; 409 conflicts surfaced as email or username field errors
- Link to `/login` for existing users

## Related Issue

Closes #24

## Type of change

- [x] New feature
- [ ] Bug fix
- [ ] Refactor
- [x] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- Password minimum is 10 chars (matches the API schema validation). Issue #24 spec says 8 — API rejects 8-char passwords so 10 wins.
- Full Name field is UX-only and is not sent to the backend (API accepts email, username, password).
- Registration makes two API calls: register + signIn (login) to ensure NextAuth session is created.

## Summary (AI generated)

Adds `/register` with a two-column Dusk Glow layout. Validates all fields client-side, registers via the Fastify API, establishes a NextAuth session, and routes new users to onboarding.
