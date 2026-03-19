## What does this PR do?

Adds a full automated CI security gate that runs on every push and pull request to `main`, plus Dependabot auto-update config and a `SECURITY.md` responsible disclosure policy.

**`.github/workflows/security.yml`** — three jobs:
- **SCA**: runs `npm audit --omit=dev --audit-level=moderate` in both `api/` and `web/`; fails the build if any moderate+ CVE is present in production dependencies
- **Secret scan**: uses `trufflesecurity/trufflehog` to scan the git history on every PR for verified leaked credentials
- **SAST (CodeQL)**: runs GitHub's CodeQL analysis for `javascript-typescript` with the `security-extended` query suite; results appear in the Security tab

**`.github/dependabot.yml`** — weekly Dependabot PRs for:
- `npm` packages in `api/`
- `npm` packages in `web/`
- GitHub Actions in `.github/workflows/`

**`SECURITY.md`** — responsible disclosure policy linking to GitHub private advisory reporting, with response SLA commitments.

## Related Issue

Closes #69

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

- TruffleHog is set to `--only-verified` to reduce false positives on test tokens and example strings.
- CodeQL `security-extended` is more thorough than the default `security-and-quality` suite and is appropriate for an app handling user credentials and PII.
- The `sca` job uses two separate `setup-node` steps because each `working-directory` has its own `package-lock.json`; this ensures the correct lockfile is used for caching.

## Summary (AI generated)

Establishes continuous security validation in CI across three dimensions: software composition analysis (SCA) for known CVEs, secret scanning for leaked credentials in commits, and static analysis (SAST) via CodeQL for code-level vulnerabilities. Dependabot is configured to automatically propose patches for all three dependency scopes on a weekly cadence. A SECURITY.md provides a clear responsible disclosure channel.
