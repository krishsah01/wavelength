## What does this PR do?

Builds the landing page at `/` with hero section, stats, feature cards, how-it-works steps, and a CTA.

- Hero heading "Connect in the Twilight Hours" with value proposition copy and two CTAs (Find My People → /register, Sign in → /login)
- Stats bar (50k+ wavelengths, 1.2k connections, 210+ communities, 250k+ conversations)
- Three feature cards (Deep Focus, Curated, Global Pulse)
- Three-step explainer (Describe → AI matches → Conversation starters)
- Full-width CTA section with "The night is waiting for you" tagline
- Responsive two-column nav; responsive grid layouts at md breakpoint
- Uses existing Dusk Glow design tokens from globals.css (primary gold #e0a548, dark backgrounds, Newsreader italic for display type)

## Related Issue

Closes #23

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

- No external images used — purely CSS/Tailwind for visual treatment, keeping the build dependency-free.
- The decorative glow element uses `pointer-events-none` and very low opacity so it never interferes with interaction.
- All links point to `/register` and `/login` which will be built in Issues #24 and #25.

## Summary (AI generated)

Replaces the placeholder home page with a full marketing landing page matching the Dusk Glow aesthetic. The page is server-rendered (no client-side JS needed), responsive at mobile/tablet/desktop breakpoints, and links forward to the registration and login flows.
