## What does this PR do?

Adds an avatar upload step to the onboarding flow, making it a skippable two-step experience: bio entry (existing, Step 3) → avatar upload (new, Step 4).

- After the bio is saved successfully, the page transitions to a new avatar step (Step 4 of 5, 80% progress) without a full page navigation
- The avatar step shows a large circular preview that doubles as the file picker trigger — displays the user's initials (fetched via `/api/profile/me`) before a photo is selected, then shows a live preview with a "Change" hover overlay once a file is picked
- "Upload & Continue" POSTs the file as `multipart/form-data` to the existing `/api/profile/avatar` endpoint, then redirects to `/dashboard`
- Users can skip the avatar step via "Skip for now" (inline button) or "Skip" (top-right nav), both routing directly to `/dashboard`
- The bio step is unchanged in behaviour; state is lifted and scoped (`bioLoading`/`bioError` vs `avatarLoading`/`avatarError`) so the two steps don't interfere

## Related Issue

Closes #

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

- The backend's `POST /profile/avatar` intentionally rejects requests where no profile row exists yet (`UPDATE ... RETURNING` returns 0 rows → 404). This is enforced by ordering: bio must be saved before the avatar step is shown, so this constraint is naturally satisfied.
- `URL.createObjectURL` is used for the local preview; this is not revoked on unmount. Since the component unmounts by navigating away, this is acceptable but could be cleaned up with a `useEffect` return if memory becomes a concern.
- Username is fetched via a secondary `/api/profile/me` call after bio save purely for the initials preview. This is best-effort (wrapped in its own try/catch) — the avatar step works fine without it.

## Summary

Converts the single-step onboarding page into a two-step flow by adding an optional, skippable avatar upload step after bio entry. Leverages the existing `/api/profile/avatar` backend endpoint and the shared `Avatar` component pattern.
