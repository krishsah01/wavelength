## What does this PR do?

Adds an embedding generation service using the Voyage AI SDK (`voyageai`). Exposes a single `generateEmbedding(text)` function that calls the `voyage-3` model and returns a vector of numbers. Adds `VOYAGE_API_KEY` to `.env.example` as a separate key from `ANTHROPIC_API_KEY`.

## Related Issue

Closes #12

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

- The original code incorrectly used `process.env.ANTHROPIC_API_KEY` for the VoyageAI client. Voyage AI has its own API key separate from Anthropic — fixed to use `process.env.VOYAGE_API_KEY`, and `.env.example` updated accordingly.
- `VOYAGE_API_KEY` is read at module initialisation time with no null-check. If the env var is missing, the Voyage client will silently have an undefined key and fail only at the first embed call. Consider asserting it at startup.
- The service does not yet persist the embedding to the database. When called during profile creation, the caller will need to store the result.
- `inputType: "document"` is correct for indexing content. Use `inputType: "query"` when generating embeddings for search queries at retrieval time.

## Summary (AI generated)

This branch introduces `src/services/embedding.ts`, a thin wrapper around the Voyage AI SDK. The exported `generateEmbedding` function validates that input is non-empty, calls the `voyage-3` model, and returns the embedding as a `number[]`. The `voyageai` package is added as a production dependency. `.env.example` is updated to document both `ANTHROPIC_API_KEY` and `VOYAGE_API_KEY` as separate required keys.
