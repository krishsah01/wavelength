## What does this PR do?

Post-QA bug fixes and polish found during Playwright E2E testing.

- **Auth cookie fix**: Login page now calls `POST /api/auth/login` browser-side before `signIn()` so the HTTP-only cookie is set in the browser (previously `signIn()` ran server-side only, leaving the browser without the cookie)
- **Sign-out fix**: Settings sign-out now calls `POST /api/auth/logout` to clear the API cookie before calling NextAuth `signOut()` (previously the API cookie persisted after logout)
- **Next.js middleware**: Added `web/middleware.ts` — protected routes (`/dashboard`, `/connections`, `/settings`, `/profile`, `/onboarding`) now 307-redirect unauthenticated users server-side; auth-only routes (`/login`, `/register`) redirect authenticated users to dashboard
- **Starter card word-boundary split**: Fixed mid-word text split in profile page — the 60-char fallback now finds the last space to avoid cutting words
- **Onboarding char limit**: Increased `MAX_CHARS` from 500 → 5000 to match the settings page limit
- **Removed dead UI**: Removed non-functional "Compatibility / Nearby / Nightly" filter tabs and "Premium Rune / Upgrade Now" CTA from dashboard
- **Connections bio placeholder**: Shows "No bio yet" instead of empty string when a connected user has no profile
- **Docker + CSP**: Added `NEXT_PUBLIC_API_URL` build arg, `INTERNAL_API_URL` runtime env, `'unsafe-inline'` to CSP for Next.js hydration, `sent_requests` to connections API response

## Related Issue

Closes #34, Closes #36, Closes #37

## Type of change

- [ ] New feature
- [x] Bug fix
- [ ] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- The auth cookie fix (login page calling API directly) means credentials are sent twice on login: once from the browser to the API (to set the cookie), and once through NextAuth server-side (to create the session). This is a known trade-off of the HTTP-only cookie + NextAuth dual-auth model.
- The middleware uses `getToken` from `next-auth/jwt` which reads the NextAuth session cookie — this is independent from the API JWT cookie. Both must be valid for the user to be truly "logged in".
- Removed filter tabs and premium CTA are pure dead UI — no backend or logic existed for them.

## Summary

Fixes critical auth bugs discovered during Playwright E2E testing: the browser never received the API JWT cookie on login (only NextAuth session was set), and sign-out didn't clear the API cookie. Adds Next.js middleware for proper server-side route protection. Also removes non-functional UI elements and aligns onboarding/settings char limits.
