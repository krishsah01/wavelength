# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wavelength is a matching/social discovery app. Users write bios that are embedded via Voyage AI for semantic similarity matching, and Claude generates personalized conversation starters for matched users.

**Stack:** Fastify API + PostgreSQL (pgvector) + Next.js frontend, all orchestrated with Docker Compose.

## Development Commands

### Running the full stack
```bash
docker compose up
```

### API (port 4000)
```bash
cd api
npm run dev       # dev server with nodemon + ts-node
npm run build     # compile TypeScript to dist/
npm run start     # run compiled output
```

### Web (port 3000)
```bash
cd web
npm run dev       # Next.js dev server
npm run build     # production build
npm run lint      # ESLint
```

## Architecture

### API (`api/src/`)

- **`index.ts`** — Fastify app setup, plugin/route registration, CORS (localhost:3000), health check
- **`plugins/db.ts`** — PostgreSQL connection pool, decorates `fastify.db`
- **`plugins/auth.ts`** — JWT Bearer token middleware, decorates `fastify.authenticate` and populates `request.user`
- **`routes/auth.ts`** — `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **`routes/profile.ts`** — `/api/profile` (create/update, triggers bio embedding), `/api/profile/:id`
- **`routes/matches.ts`** — `/api/matches` (cosine similarity query), `/api/matches/:id/starters`
- **`services/embedding.ts`** — Voyage AI v3 API for 1024-dim bio embeddings
- **`services/starters.ts`** — Claude API to generate conversation starters between matched users
- **`types/db.ts`** — TypeScript interfaces for DB schema (User, Profile, Connection, ConversationStarter)
- **`types/fastify.d.ts`** — Module augmentation for `fastify.db`, `fastify.authenticate`, `request.user`

### Web (`web/app/`)

- **`layout.tsx`** — Root layout (fonts, Tailwind, dark theme `#1a1208`)
- **`api/auth/[...nextauth]/route.ts`** — NextAuth CredentialsProvider; exchanges credentials for JWT from API, stores token in session
- **`lib/api.ts`** — Axios instance; request interceptor reads JWT from `localStorage`, response interceptor redirects to `/login` on 401
- **`types/next-auth.d.ts`** — Augments `User`, `Session`, and `JWT` to carry `.token`

### Database (`db/init.sql`)

- `users` — auth credentials (UUID PK, email, username, password_hash)
- `profiles` — bio + `VECTOR(1024)` embedding (one-to-one with users)
- `connections` — match requests (pending/accepted status)
- `conversation_starters` — JSONB pairs of starters cached per user pair
- HNSW index on `profiles.embedding` for fast cosine similarity

## Environment Variables

See `.env.example` at the root. Required:
- `ANTHROPIC_API_KEY` — Claude API
- `VOYAGE_API_KEY` — Voyage AI embeddings
- `JWT_SECRET` — token signing
- `DATABASE_URL` — Postgres connection string
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `NEXTAUTH_SECRET` — NextAuth session encryption
- `NEXT_PUBLIC_API_URL` — API base URL for the frontend (set to `http://api:4000` in Docker)

## Key Patterns

- **Auth flow:** client sends credentials → API returns JWT → stored in `localStorage` → sent as `Authorization: Bearer <token>` on every request
- **Embedding on profile save:** whenever a bio is created/updated, the API calls Voyage AI and stores the vector; matches use `<=>` (pgvector cosine distance) in SQL
- **Conversation starters caching:** starters are stored in the `conversation_starters` table keyed by `(user_a_id, user_b_id)` (ordered, smaller UUID first) to avoid redundant Claude calls — the same pair in either direction always hits the cache
- **Fastify plugins** use `fastify-plugin` to expose decorations across the app; always use `fastify.authenticate` as a `preHandler` for protected routes
- **Note on embedding dimensions:** the design doc specifies `vector(1536)` (Claude embedding size) but the actual implementation uses Voyage AI `voyage-3` which produces `1024`-dim vectors. The DB schema uses `VECTOR(1024)`.

## Design System (Stitch UI mockups in `context/Stitch UI/`)

The target UI uses a **"Dusk Glow" dark theme**: deep navy/near-black backgrounds (`#0d0d1a` range) with gold/amber accents (`#f5a623` range) and serif italic type for expressive headings.

Key UI patterns from the mockups:
- **Match cards** — avatar, name, age, city, bio quote, interest tags (pill badges), compatibility % badge, "View Soul Signature" CTA
- **Profile page** — circular avatar, username handle, Connect button, full bio in a card, interest tags, then an "AI Conversation Starters" section with 3 distinct starter cards (each with an icon, title, and short description)
- **Connections page** — two sections: "Pending Requests" (Accept/Decline buttons) and "Existing Connections" grid
- **Onboarding** — multi-step flow (5 steps total); bio entry is step 3, labeled "Tell your story / The Narrative" with a 0/500 character counter
- **Dashboard sidebar** — Dashboard, Discover, Messages, Connections, Settings; mobile uses a bottom nav (Home, Explore, Chat, Profile)
- **Login/Register** — split layout; register shows left-side copy + right-side form panel

## What's Built vs Planned

**Backend — complete:**
- Auth (register, login, logout)
- Profile (create/update with embedding, get by ID)
- Matches (cosine similarity, conversation starters with caching)

**Backend — not yet built:**
- `/api/connections` routes (POST request, POST accept, GET list) — schema is in place

**Frontend — complete:**
- NextAuth setup (`/api/auth/[...nextauth]`)
- Axios API client (`lib/api.ts`)

**Frontend — not yet built (all pages):**
- `/` landing, `/login`, `/register`, `/onboarding`, `/dashboard`, `/profile/:id`, `/connections`, `/settings`

## Per-Issue Workflow

After completing each issue from the GitHub Issues board:
1. Run the `/commit-pr` skill (`.claude/commit-pr.md`) to review changes, fill in the PR template, commit, push, and open a PR
2. Reference the issue number so the PR closes it (e.g. `Closes #22`)
3. The user will merge the PR; after merge, start the next issue on a fresh branch

Branch naming: use the issue slug, e.g. `build-landing-page` for Issue #23.

The remaining issues to implement in order (starting from #23):
- #23 Landing page (`/`)
- #24 Registration page (`/register`)
- #25 Login page (`/login`)
- #26 Onboarding page (`/onboarding`)
- #27 Dashboard (`/dashboard`)
- #28 Profile view (`/profile/:id`)
- #29 Conversation starters display (part of profile page)
- #30 Connect button with state management (part of profile page)
- #31 Connection backend routes (`api/src/routes/connections.ts`)
- #32 Connections page (`/connections`)
- #33 Settings page (`/settings`)
- #34–36 Validation, error handling, rate limiting
- #37–39 Responsive design, visual polish, QA
- #40–43 Railway deployment
- #44–45 README, v1.0 tag

## Deployment Target

Railway (Docker-native). All three services (postgres, api, web) deploy as separate Railway services connected via internal networking.
