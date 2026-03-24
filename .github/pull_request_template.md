## What does this PR do?

Fixes sidebar nav inconsistencies between the Dashboard and Connections pages, and adds a Sign out button to both sidebars.

- **Active nav state**: Connections page was using a solid amber fill (`bg-[#e0a548]`) for the active item; now matches Dashboard's subtle tint style (`bg-[#e0a548]/10` with amber border and text)
- **Nav items list**: Connections sidebar was showing only 3 items in a different order; expanded to the full 5-item list (Dashboard, Discover, Messages, Connections, Settings) matching Dashboard
- **Sign out button**: Added a consistent `↩ Sign out` button at the bottom of the nav list in both sidebars, styled as a muted nav item with a red hover state, calling `signOut({ callbackUrl: "/login" })`
- **Avatar component**: Both pages now use the shared `Avatar` component instead of inline initials divs, and `avatar_url` was added to the relevant TypeScript interfaces

## Related Issue

Closes #

## Type of change

- [ ] New feature
- [x] Bug fix
- [x] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- The `signOut` import was already used in `settings/page.tsx`, so this follows the established pattern
- The connections sidebar previously lacked the Wavelength logo header (it was in a top `<header>` instead); this structural difference is intentional and not changed here — the logo still appears in the top bar on the connections page
- `avatar_url` fields added to `PendingRequest` and `Connection` interfaces in connections page, and `Match` interface in dashboard page, to support the Avatar component properly

## Summary

Aligns the sidebar navigation UI across Dashboard and Connections pages — consistent active state style, identical nav item sets, and a Sign out button available everywhere — and replaces ad-hoc initials avatars with the shared Avatar component.
