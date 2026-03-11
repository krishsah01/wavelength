## What does this PR do?

Adds `generateStarters(bio1, bio2)` — a service function that calls the Anthropic Claude API to generate exactly 3 personalised conversation starters for two matched users based on their bios. Validates both bios before calling the API, parses the JSON array response, and asserts the expected length before returning.

## Related Issue

Closes #17

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

- The model is hardcoded as `claude-sonnet-4-20250514`. Consider moving this to a constant or env var so it can be swapped without touching business logic.
- `JSON.parse` is called without a try/catch guard. If Claude returns malformed JSON (even rarely), it will throw an unhandled parse error. Wrapping just the parse call separately would give a clearer error message.
- The `!starters` check after `JSON.parse` is a dead branch — `JSON.parse` either returns a value or throws, it never returns `null`/`undefined`. The length check on the next line is sufficient.
- Error messages like `"something went wrong"` and `"Model error"` are vague — prefer more descriptive strings (e.g. `"Claude returned fewer than 3 starters"`) to make debugging easier.
- The `Anthropic` client is instantiated at module load time. `ANTHROPIC_API_KEY` must be present in the environment when the module is first imported or the SDK will throw. This matches the pattern in `embedding.ts` so it is consistent, but worth confirming the key is set in the Docker environment.

## Summary (AI generated)

This branch adds `api/src/services/starters.ts`. The `generateStarters` function validates two bio strings, constructs a prompt instructing Claude to return a JSON array of 3 conversation starters, calls `anthropic.messages.create` with `claude-sonnet-4-20250514`, extracts the text block, parses the JSON, validates the array length, and returns the starters. Errors are logged and re-thrown to the caller.
