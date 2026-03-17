## What does this PR do?

Adds an Axios API client configuration with authentication and error handling interceptors. Updates the Next.js frontend color scheme to match standard background themes. Also adds `.dockerignore` to the `web` directory and introduces `next-env.d.ts` for Next.js environment types.

## Related Issue

Closes #20

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

- The Axios interceptor stores the JWT token in `localStorage` which is retrieved on every request. This implies client-side only usage since `localStorage` won't be available during Server-Side Rendering (SSR). Ensure that any SSR usage of this API instance manages tokens separately.
- In the error interceptor, unauthenticated 401 responses redirect directly to `/login` via `window.location.href = '/login'`. Note that doing a full page reload will bypass Next.js client-side routing.
- The color constants in `globals.css` were updated, and `layout.tsx` was adjusted to properly reflect the `bg-[#1a1208]` background and `text-[#ede8d8]` text colors.

## Summary (AI generated)

This branch introduces a configured Axios API client in `web/lib/api.ts` with a request interceptor to auto-attach authorization tokens from `localStorage`, and a response interceptor to redirect 401s to `/login`. It additionally modifies the Next.js `globals.css` and `layout.tsx` files to unify the dark mode color scheme context. Finally, it adds environment support files (`.dockerignore`, `next-env.d.ts`) typical for a Next.js setup.
