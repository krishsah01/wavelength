## What does this PR do?

Patches all known production CVEs in `api/` and `web/` as identified in the March 2026 security audit.

- Upgrades `fastify` in `api/` to fix GHSA-573f-x89g-hqp9 (malformed Content-Type bypass)
- Upgrades `next` in `web/` from `16.1.6` to `16.2.0` to fix 5 moderate CVEs: GHSA-mq59-m269-xvcx (CSRF), GHSA-jcc7-9wpm-mj36 (HMR CSRF), GHSA-3x4c-7xq6-9pq8 (disk cache DoS), GHSA-h27x-g6w4-24gq (resume buffer DoS), GHSA-ggv3-7p47-pfv8 (HTTP request smuggling)
- Both `npm audit --omit=dev` commands now return `0 vulnerabilities`
- All TypeScript builds and Next.js production builds pass cleanly post-upgrade

## Related Issue

Closes #65

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

- `npm audit fix --force` was required for the Next.js upgrade since `16.2.0` is outside the `^16.1.6` range stated in `package.json`. The caret range in `package.json` has been updated accordingly via `package-lock.json`.
- No source code changes — only `package-lock.json` files and `web/package.json` version range were modified.
- The TypeScript API build and Next.js production build were both verified to pass before merging.

## Summary (AI generated)

Resolves all 6 moderate-severity CVEs flagged by `npm audit` across the API and web services. The Fastify patch fixes a content-type validation bypass; the Next.js upgrade to 16.2.0 closes five vulnerabilities including two CSRF bypasses, two DoS vectors, and an HTTP request smuggling issue in rewrites. No application behaviour changes.
