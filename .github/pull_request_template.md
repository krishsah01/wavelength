## What does this PR do?

Implements the `GET /api/matches/:id/starters` endpoint which generates personalized conversation starters using the Anthropic Claude API based on the matching users' bios. Results are cached in the PostgreSQL `conversation_starters` table to save API calls on repeated requests. Prompt engineering was extensively refined to improve the casual tone, forcing the AI to only consider the match's bio (Person B) so it doesn't create weird comparisons, and uses an assistant message prefill (`[`) to strictly enforce JSON array output.

## Related Issue

Closes #18

## Type of change

- [x] New feature
- [ ] Bug fix
- [x] Refactor
- [ ] DevOps / config

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- Caching logic in `GET /api/matches/:id/starters` normalizes the pair of user IDs so that user A requesting user B returns the same cached result as user B requesting user A (using `pair.sort()`). However, the prompt is one-directional (written to query about Person B's bio). If the cache is reused in reverse, the starters will be referencing User A's interests but presented to User B. This is a logic flaw worth addressing before production.
- An assistant prefill `[` was added to the prompt messages to enforce the JSON response. Thus, `JSON.parse` is called with `'[' + block.text`. Check to ensure this does not result in malformed JSON if the model ever decides to actually output the `[` on its own.
- The `anthropic.messages.create` parameters were changed to include `temperature: 0.9`. Ensure that we are satisfied with the response variability.

## Summary (AI generated)

This PR introduces the conversation starter generation logic via GET `/api/matches/:id/starters` connecting with the Anthropic Claude API. It includes reading bios for matched users, issuing a well-crafted prompt, caching results in the `conversation_starters` table for subsequent hits on the same user pair, and returning a JSON array of 3 conversation starters. The Anthropic prompt was heavily refactored: removed Person A's bio from the user context to prevent unwanted comparison generation, employed few-shot examples for achieving a natural texting tone, and applied an assistant prefill to robustly enforce a JSON payload response.
