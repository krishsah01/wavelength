## What does this PR do?

Implements a full SEO strategy for Wavelength across three pillars:

1. **Technical foundation** — Expands `layout.tsx` with rich metadata (title template, OG, Twitter cards, keywords), adds JSON-LD `WebApplication` structured data, creates `sitemap.ts` (dynamic, covering all static + programmatic + blog routes), `robots.ts` (blocks auth pages, allows public pages), and a static `opengraph-image.tsx`. Updates the CSP in `next.config.ts` to allow `'unsafe-inline'` on `script-src` so JSON-LD renders correctly.

2. **Programmatic interest pages** — Adds `web/lib/interests.ts` with 107 niche interests across 10 categories (Music, Food & Drink, Making & Crafting, Literature & Writing, Gaming, Science & Nature, Philosophy & Ideas, Outdoor & Adventure, Art & Visual, Collecting & Curation). Each interest has a slug, name, category, description, and related slugs. Creates `/discover` hub page and `/discover/[interest]` dynamic pages with `generateStaticParams`, per-interest `generateMetadata`, structured data (`CollectionPage`), and dynamic OG images. All 107 pages are statically generated at build time.

3. **Blog** — Creates `/blog` index and `/blog/[slug]` dynamic route with 10 full-length posts targeting high-intent search queries: loneliness + niche interests, introvert friendship strategies, AI friend-finding, pgvector tutorial, and review/comparison content. Adds prose CSS in `globals.css` for blog post styling.

## Related Issue

Closes #SEO-1

## Type of change

- [x] New feature

## Checklist

- [x] Code works locally
- [x] No console errors
- [x] Follows existing patterns in the codebase

## Code Review Notes

- The CSP change (`script-src 'self' 'unsafe-inline'`) is intentional and required for JSON-LD structured data. The inline scripts are all controlled by the app (JSON-LD only) and the Next.js build is fully deterministic, so the security tradeoff is acceptable.
- `NEXT_PUBLIC_APP_URL` is a new env var used as `metadataBase` and in sitemap/robots. It should be added to `.env.example` and set in Railway to the production domain.
- Blog content is stored as TSX component files under `web/content/posts/`. Adding new posts requires: (1) a new TSX file, (2) a metadata entry in `web/lib/posts.ts`, (3) an import + entry in the `contentMap` in `web/app/blog/[slug]/page.tsx`.
- All 107 interest pages and 10 blog posts are statically generated (`●` in build output) — no runtime cost.

## Summary (AI generated)

This PR implements a three-pillar SEO strategy designed to intercept search queries from the exact audience Wavelength is built for — people with niche, specific interests who feel lonely or disconnected. The programmatic interest pages (107 pages across 10 categories) capture long-tail queries like "find lo-fi music production friends" and "vintage synthesizer community". The blog targets high-intent emotional queries like "how to make friends as an introvert" and "feeling lonely with unusual hobbies". The technical foundation ensures all public pages are crawlable, well-described in search results, and share correctly on social platforms with custom OG images.
