
---

## Phase 1: Repository & Project Management Setup

- Create a new GitHub repository named `wavelength`
  - Set visibility to public (portfolio project) or private based on preference
  - Add a README with a brief project description, tech stack overview, and "Getting Started" section placeholder
  - Select a Node `.gitignore` template during creation
- Set up a GitHub Projects board linked to the repository
  - Create columns: **Backlog**, **In Progress**, **Review**, **Done**
  - Add labels for each system layer: `frontend`, `backend`, `database`, `devops`, `ai-integration`
  - Add priority labels: `P0-critical`, `P1-high`, `P2-medium`, `P3-low`
  - Create milestone markers for each phase of the build
- Clone the repository locally
- Create the top-level folder structure:
  - `web/` — Next.js frontend
  - `api/` — Fastify backend
  - `db/` — Database initialization scripts
- Append Docker-specific entries to `.gitignore`:
  - `node_modules/`, `.env`, `postgres_data/`, `.next/`, `dist/`
- Create a `.env.example` at the root listing every required variable without values:
  - `DATABASE_URL`, `ANTHROPIC_API_KEY`, `JWT_SECRET`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_API_URL`
- Create a local `.env` file by copying `.env.example` and filling in development values
- Make an initial commit and push to confirm the remote connection

---

## Phase 2: Docker & Database Infrastructure

### Docker Compose Configuration

- Create `docker-compose.yml` at the project root defining three services:
  - **postgres** — uses the `pgvector/pgvector:pg16` image
    - Map port `5432:5432`
    - Set environment variables: `POSTGRES_DB=wavelength`, `POSTGRES_USER=wavelength`, `POSTGRES_PASSWORD=secret`
    - Mount a named volume `postgres_data` to `/var/lib/postgresql/data` for persistence
    - Mount `./db/init.sql` to `/docker-entrypoint-initdb.d/init.sql` so the schema auto-runs on first boot
  - **api** — builds from `./api`
    - Map port `4000:4000`
    - Set `depends_on: [postgres]`
    - Pass `DATABASE_URL` and `ANTHROPIC_API_KEY` from the `.env` file
  - **web** — builds from `./web`
    - Map port `3000:3000`
    - Set `depends_on: [api]`
    - Pass `NEXT_PUBLIC_API_URL=http://api:4000`
- Define a shared Docker network so containers can reach each other by service name
- Define the `postgres_data` named volume at the bottom of the file

### Database Schema

- Create `db/init.sql` with the following:
  - Enable the pgvector extension: `CREATE EXTENSION IF NOT EXISTS vector;`
  - Create the `users` table:
    - `id` — UUID, primary key, default `gen_random_uuid()`
    - `email` — TEXT, UNIQUE, NOT NULL
    - `username` — TEXT, UNIQUE, NOT NULL
    - `password_hash` — TEXT, NOT NULL
    - `created_at` — TIMESTAMPTZ, default `now()`
  - Create the `profiles` table:
    - `id` — UUID, primary key
    - `user_id` — UUID, foreign key referencing `users.id`, unique (one-to-one)
    - `bio` — TEXT, NOT NULL
    - `embedding` — `vector(1536)`, NOT NULL
    - `updated_at` — TIMESTAMPTZ, default `now()`
  - Create the `connections` table:
    - `id` — UUID, primary key
    - `requester_id` — UUID, foreign key referencing `users.id`
    - `receiver_id` — UUID, foreign key referencing `users.id`
    - `status` — TEXT, NOT NULL (values: `pending`, `accepted`)
    - `created_at` — TIMESTAMPTZ, default `now()`
    - Add a unique constraint on the pair `(requester_id, receiver_id)` to prevent duplicate requests
  - Create the `conversation_starters` table:
    - `id` — UUID, primary key
    - `user_a_id` — UUID, foreign key referencing `users.id`
    - `user_b_id` — UUID, foreign key referencing `users.id`
    - `starters` — JSONB, NOT NULL (array of 3 strings)
    - `created_at` — TIMESTAMPTZ, default `now()`
    - Add a unique constraint on the pair `(user_a_id, user_b_id)` so starters are only generated once per pair
  - Add an index on `profiles.embedding` using the `ivfflat` or `hnsw` method for faster cosine similarity searches

### Dockerfiles

- Create `api/Dockerfile`:
  - Use `node:20-alpine` as the base image
  - Copy `package.json` and `package-lock.json`, run `npm install`
  - Copy all source files
  - Expose port `4000`
  - Set the start command to run the compiled server
- Create `web/Dockerfile`:
  - Use `node:20-alpine` as the base image
  - Copy `package.json` and `package-lock.json`, run `npm install`
  - Copy all source files
  - Expose port `3000`
  - Set the start command to `npm run dev` (switch to `npm run build && npm start` for production)

### Verification

- Run `docker compose up --build` from the project root
- Verify Postgres is running by connecting with `psql` or a GUI client (e.g., TablePlus, pgAdmin)
- Confirm the pgvector extension is active: `SELECT * FROM pg_extension WHERE extname = 'vector';`
- Confirm all four tables exist: `\dt` in psql
- Confirm the `vector(1536)` column type on `profiles.embedding`
- Tear down with `docker compose down` and bring back up to verify volume persistence

---

## Phase 3: Backend Foundation (Fastify)

### Project Initialization

- Inside `api/`, run `npm init -y`
- Install core dependencies:
  - `fastify` — web framework
  - `@fastify/cors` — cross-origin requests from the Next.js frontend
  - `pg` — PostgreSQL client
  - `dotenv` — environment variable loading
- Install dev dependencies:
  - `typescript`, `ts-node`, `@types/node`, `@types/pg`, `nodemon`
- Create `tsconfig.json` with strict mode, ES module output, and path aliases
- Create the entry point at `api/src/index.ts`:
  - Initialize Fastify with logging enabled
  - Register CORS to accept requests from `http://localhost:3000`
  - Add a `GET /health` route that returns `{ status: 'ok' }`
  - Start the server on port `4000`

### Database Connection Plugin

- Create `api/src/plugins/db.ts` as a Fastify plugin:
  - Initialize a `pg.Pool` using the `DATABASE_URL` environment variable
  - Decorate the Fastify instance with the pool so routes can access `fastify.db`
  - Add a hook to close the pool on server shutdown
- Register the plugin in `index.ts`
- Test: rebuild the API container, hit `GET /health`, and confirm no connection errors in the logs
- Test: run a simple query like `SELECT NOW()` from the health route to verify the DB link

---

## Phase 4: Authentication System

### Dependencies

- Install `bcrypt` and `@types/bcrypt` for password hashing
- Install `jsonwebtoken` and `@types/jsonwebtoken` for JWT creation and verification

### Auth Routes

- Create `api/src/routes/auth.ts` with three routes:
  - **POST `/auth/register`**
    - Accept `email`, `username`, `password` in the request body
    - Validate all fields are present and non-empty
    - Check that `email` and `username` are not already taken (query the `users` table)
    - Hash the password with bcrypt (salt rounds: 10)
    - Insert the new user into `users`
    - Sign a JWT containing `{ userId, email }` with the `JWT_SECRET` env var, 7-day expiry
    - Return the JWT and user info
  - **POST `/auth/login`**
    - Accept `email` and `password`
    - Look up the user by email
    - Compare the provided password against the stored hash with `bcrypt.compare`
    - If valid, sign and return a JWT; if invalid, return 401
  - **POST `/auth/logout`**
    - This is mainly a client-side operation (discard the token)
    - Optionally, maintain a server-side token blacklist in memory or Redis for true invalidation

### JWT Middleware

- Create `api/src/plugins/auth.ts`:
  - Register a Fastify `onRequest` hook for all routes under `/api/*`
  - Exclude `/auth/register` and `/auth/login` from the check
  - Extract the `Authorization: Bearer <token>` header
  - Verify the token using `jsonwebtoken.verify` with `JWT_SECRET`
  - Attach the decoded payload (userId, email) to `request.user`
  - Return 401 if the token is missing, expired, or invalid

### Testing

- Use Postman, Insomnia, or `curl` to test:
  - Register a new user → confirm 201 response with a JWT
  - Register with a duplicate email → confirm 409 conflict
  - Login with correct credentials → confirm JWT returned
  - Login with wrong password → confirm 401
  - Hit a protected route without a token → confirm 401
  - Hit a protected route with a valid token → confirm 200

---

## Phase 5: Profile & Embedding Integration

### Claude/Voyage Embedding Service

- Install the Anthropic SDK: `npm install @anthropic-ai/sdk`
- Create `api/src/services/embedding.ts`:
  - Initialize the Anthropic client with `ANTHROPIC_API_KEY`
  - Export a function `generateEmbedding(text: string): Promise<number[]>`
    - Call the Voyage embeddings endpoint (`voyage-3` model)
    - Extract the embedding vector (1536 dimensions) from the response
    - Return the raw array of numbers
  - Add error handling for API failures, rate limits, and empty inputs

### Profile Routes

- Create `api/src/routes/profile.ts` with two routes:
  - **POST `/profile`** (authenticated)
    - Accept `bio` in the request body
    - Validate that `bio` is non-empty and within a reasonable length (e.g., 50–5000 characters)
    - Call `generateEmbedding(bio)` to get the vector
    - Upsert into the `profiles` table:
      - If a profile exists for the current `userId`, update `bio`, `embedding`, and `updated_at`
      - If no profile exists, insert a new row
    - Store the embedding as a JSON-stringified array cast to `::vector`
    - Return the created/updated profile
  - **GET `/profile/:id`** (authenticated)
    - Query the `profiles` table joined with `users` for the given `id`
    - Return `username`, `bio`, `created_at`
    - Do not return the raw embedding vector to the client

### Testing

- Create a test user via the register endpoint
- Submit a bio via `POST /profile` → confirm 200/201 response
- Connect to Postgres and verify the `profiles` row has a populated `embedding` column
- Hit `GET /profile/:id` → confirm the bio and username are returned
- Update the bio by calling `POST /profile` again → confirm the embedding changes
- Test with an empty bio → confirm validation error

---

## Phase 6: Matching Engine

### Match Route

- Create `api/src/routes/matches.ts`:
  - **GET `/matches`** (authenticated)
    - Fetch the current user's embedding from the `profiles` table
    - If the user has no profile yet, return a helpful error asking them to complete onboarding
    - Run the cosine similarity query:
      - Select `username`, `bio`, and similarity score (`1 - (embedding <=> $1::vector)`)
      - Exclude the current user from results
      - Order by cosine distance ascending (most similar first)
      - Limit to 10 results
    - Return the ranked list with scores rounded to 2 decimal places

### Seed Data for Testing

- Create at least 5–10 test users with diverse, realistic bios:
  - A music producer into lo-fi beats and vintage gear
  - A sourdough baker who also does competitive baking
  - A speedrunner into retro N64 games
  - A mechanical watch enthusiast who restores vintage bicycles
  - A sci-fi reader obsessed with Ursula K. Le Guin and Octavia Butler
  - A coffee nerd with strong opinions on grind sizes and brew methods
  - A birdwatcher who also does landscape photography
  - A tabletop RPG designer who writes homebrew campaigns
- For each test user: register, then submit a bio to generate and store their embedding
- Use a script or Postman collection to automate this seeding process

### Validation

- Log in as one test user, hit `GET /matches`, and verify:
  - Results are returned in descending similarity order
  - Scores make intuitive sense (e.g., the coffee nerd and sourdough baker score higher together than the speedrunner and birdwatcher)
  - The current user does not appear in their own results
  - Exactly 10 or fewer results are returned

---

## Phase 7: Conversation Starters

### Starters Service

- Create `api/src/services/starters.ts`:
  - Export a function `generateStarters(bioA: string, bioB: string): Promise<string[]>`
    - Build a prompt providing both users' bios
    - Instruct Claude to generate 3 specific, genuine conversation starters
    - Request the response as a JSON array of strings
    - Parse the response and validate it contains exactly 3 strings
    - Add error handling and a fallback if Claude returns malformed output

### Starters Route

- Add to `api/src/routes/matches.ts`:
  - **GET `/matches/:id/starters`** (authenticated)
    - Check the `conversation_starters` table for an existing entry for this user pair
      - Normalize the pair order (always store the smaller UUID as `user_a_id`) to avoid duplicates
    - If cached starters exist, return them immediately
    - If not, fetch both users' bios from the `profiles` table
    - Call `generateStarters(bioA, bioB)`
    - Insert the result into `conversation_starters` for caching
    - Return the 3 starters

### Testing

- Hit `GET /matches/:id/starters` for a match pair → confirm 3 starters returned
- Hit the same endpoint again → confirm the response comes from cache (no new Claude API call)
  - Verify this by checking the `conversation_starters` table or adding a log when the API is called
- Check that starters feel personalized, not generic (they should reference specific interests from both bios)

---

## Phase 8: Frontend — Auth & Onboarding

### Next.js Setup

- Inside `web/`, run `npx create-next-app@latest . --typescript --app --tailwind`
  - Select the App Router
  - Enable Tailwind CSS
  - Enable ESLint
- Install additional dependencies:
  - `next-auth` for session management
  - `axios` or use the native `fetch` API for backend calls

### Shared API Client

- Create `web/lib/api.ts`:
  - Configure a base URL pointing to the Fastify backend (`NEXT_PUBLIC_API_URL`)
  - Create a wrapper function that attaches the JWT from the session to every request's `Authorization` header
  - Add a response interceptor that redirects to `/login` on 401 responses

### NextAuth.js Configuration

- Create the NextAuth route handler at `web/app/api/auth/[...nextauth]/route.ts`:
  - Use a Credentials provider that calls your Fastify `/auth/login` endpoint
  - Store the JWT in the session so it's accessible on both client and server
  - Configure session strategy as `jwt`
  - Set `NEXTAUTH_SECRET` in the environment

### Landing Page (`/`)

- Build the hero section:
  - Project name "Wavelength" prominently displayed
  - Tagline conveying the core value proposition (find your people through niche interests)
  - A primary CTA button linking to `/register`
  - A secondary link to `/login` for returning users
- Keep the design clean and inviting — this is a portfolio piece

### Registration Page (`/register`)

- Build a form with fields: `email`, `username`, `password`, `confirm password`
- Client-side validation:
  - Email format check
  - Username minimum length (3 characters)
  - Password minimum length (8 characters)
  - Passwords match
- On submit, call `POST /auth/register` on the Fastify backend
- On success, store the JWT via NextAuth and redirect to `/onboarding`
- On error, display the error message inline (e.g., "Email already taken")

### Login Page (`/login`)

- Build a form with fields: `email`, `password`
- On submit, call NextAuth's `signIn("credentials", ...)` which hits your Fastify login endpoint
- On success, redirect to `/dashboard`
- On error, display "Invalid email or password"
- Include a link to `/register` for new users

### Onboarding Page (`/onboarding`)

- Build a single-purpose page with a large freeform text area
- Prompt the user: "Describe your interests in your own words. Don't make a list — just write naturally about what you're into."
- Include example placeholder text to inspire them (but don't pre-fill the field)
- Set a character minimum (50) and maximum (5000) with a live character counter
- On submit, call `POST /profile` which triggers embedding generation
- Show a loading state while the embedding is being created ("Finding your wavelength...")
- On success, redirect to `/dashboard`

### Testing

- Walk through the full flow in the browser:
  - Landing → Register → Onboarding → Dashboard redirect
  - Logout → Login → Dashboard redirect
  - Confirm the JWT is properly stored and sent with API requests
  - Confirm protected pages redirect to `/login` when unauthenticated

---

## Phase 9: Dashboard & Match Cards

### Dashboard Page (`/dashboard`)

- On page load, call `GET /matches` from the Fastify backend
- Handle the case where the user hasn't completed onboarding (redirect to `/onboarding`)
- Display a page header: "Your Matches" or "People on Your Wavelength"
- Render match results as a vertical list of cards, sorted by similarity score (highest first)

### Match Card Component

- Each card displays:
  - **Username** — clickable, links to `/profile/:id`
  - **Bio snippet** — first 150 characters of their bio, with an ellipsis if truncated
  - **Compatibility score** — displayed as a percentage (e.g., `0.87` → `87%`)
  - A visual indicator for the score (e.g., a colored bar, gradient, or badge)
- Style the cards distinctly for high matches (90%+), good matches (70–89%), and moderate matches (below 70%)

### Empty & Loading States

- If no matches are found, show a friendly message: "No matches yet — try updating your bio to be more detailed"
- Show skeleton loaders or a spinner while matches are loading
- Handle API errors gracefully with a retry option

---

## Phase 10: Profile View & Starters UI

### Profile Page (`/profile/:id`)

- On page load, call `GET /profile/:id` for the user's data
- Display the full bio text, username, and when they joined
- If this is NOT the current user's own profile:
  - Show the AI-generated conversation starters section
  - Show a "Connect" button (if not already connected)
- If this IS the current user's own profile:
  - Show an "Edit Profile" link to `/settings`

### Conversation Starters Section

- On profile load (for other users), call `GET /matches/:id/starters`
- Display each of the 3 starters in a visually distinct card or block
- Add a subtle label like "AI-suggested conversation starters based on your shared interests"
- Show a loading state while starters generate (first time may take a few seconds due to Claude API call)
- If the starter generation fails, show a fallback message and a retry button

### Connect Button

- Display a "Connect" button if no connection exists between the two users
- If a pending request already exists from the current user, show "Request Sent" (disabled)
- If a pending request exists from the other user, show "Accept Connection"
- If already connected, show "Connected" with a checkmark

---

## Phase 11: Connections System

### Backend Routes

- Create `api/src/routes/connections.ts`:
  - **POST `/connections/:id/request`** (authenticated)
    - Verify the target user exists
    - Check that no connection already exists between the two users (in either direction)
    - Insert a new row with `status: 'pending'`
    - Return the connection object
  - **POST `/connections/:id/accept`** (authenticated)
    - Find the pending connection where the current user is the `receiver_id`
    - Update `status` to `'accepted'`
    - Return the updated connection
  - **GET `/connections`** (authenticated)
    - Return all connections for the current user where `status = 'accepted'`
    - Include the other user's `username` and `bio` in each result
    - Also return pending incoming requests separately so the UI can display them

### Frontend Connections Page (`/connections`)

- Split the page into two sections:
  - **Pending Requests** — incoming connection requests with Accept/Decline buttons
  - **Your Connections** — accepted connections displayed as cards
- Each connection card shows the other user's username and bio snippet, with a link to their profile
- If no connections exist yet, show a friendly message encouraging the user to explore matches
- If no pending requests exist, hide that section entirely

### Testing the Full Flow

- Log in as User A, go to User B's profile, and click "Connect"
- Log in as User B, go to `/connections`, and verify the pending request appears
- Accept the request → confirm both users now see each other in their connections list
- Verify duplicate connection requests are rejected
- Verify users can't accept connections they didn't receive

---

## Phase 12: Settings & Bio Management

### Settings Page (`/settings`)

- Display the user's current bio in an editable text area
- On save, call `POST /profile` with the updated bio
  - This triggers a re-embedding on the backend
  - Show a loading state: "Re-analyzing your interests..."
- After save, redirect to `/dashboard` so the user can see their updated matches
- Optionally allow the user to update their email or username (with uniqueness checks)
- Optionally allow password changes (require current password confirmation)

---

## Phase 13: Error Handling & Input Validation

### Backend Validation

- Add request schema validation to every Fastify route using Fastify's built-in JSON schema validation or a library like `zod`
- Validate:
  - Email format on register/login
  - Bio length constraints (50–5000 characters)
  - UUID format on all `:id` path parameters
  - JWT presence and validity on all protected routes
- Return consistent error response shapes: `{ error: string, statusCode: number }`

### Frontend Error Handling

- Wrap all API calls in try/catch blocks
- Display user-friendly error messages (not raw API errors)
- Add error boundaries in React to catch rendering failures
- Handle network errors (offline, timeout) with a retry prompt
- Validate all form inputs before submitting to the backend

### API Rate Limiting

- Install `@fastify/rate-limit`
- Apply global rate limiting (e.g., 100 requests per minute per IP)
- Apply stricter limits to Claude API routes (`POST /profile` and `GET /matches/:id/starters`) since these incur external API costs
  - e.g., 10 profile updates per hour, 30 starters requests per hour

---

## Phase 14: Responsive Design & UI Polish

### Mobile Responsiveness

- Test every page at mobile (375px), tablet (768px), and desktop (1280px) breakpoints
- Ensure the navigation is usable on mobile (hamburger menu or bottom nav)
- Make match cards stack vertically on mobile and use a grid on desktop
- Ensure the bio text area on onboarding/settings is comfortable to type in on mobile
- Test touch interactions (buttons, links) are large enough (minimum 44x44px tap targets)

### Visual Polish

- Establish a consistent color palette and apply it across all pages
- Add subtle transitions and animations (e.g., match cards fading in, score bars filling)
- Ensure sufficient color contrast for accessibility (WCAG AA minimum)
- Add a favicon and meta tags (title, description, Open Graph) for sharing
- Style the loading and empty states so they feel intentional, not broken

### Final QA Checklist

- Walk through every user flow end-to-end:
  - New user: Landing → Register → Onboarding → Dashboard → Profile → Connect
  - Returning user: Login → Dashboard → Settings → Updated matches
  - Connection flow: Send request → Accept → View connections
- Test with multiple browser tabs (simulating different users)
- Check for console errors on every page
- Verify no sensitive data (API keys, JWTs) appears in frontend source or network requests
- Test what happens when the Claude API is unreachable (graceful degradation)

---

## Phase 15: Deployment to Railway

### Railway Account Setup

- Create a Railway account at railway.app
- Link your GitHub repository to Railway

### Database Deployment

- Provision a PostgreSQL service through Railway's managed database offering
- Note the connection string Railway provides
- Run the `init.sql` schema against the production database:
  - Connect via Railway's CLI or a direct psql connection using the provided credentials
  - Execute the SQL to create the pgvector extension and all tables
- Verify the schema is correctly applied

### Backend Deployment

- Create a new Railway service for the Fastify API
  - Point it to the `api/` directory in your repo
  - Set build command and start command as needed
- Configure environment variables in Railway:
  - `DATABASE_URL` — the Railway-provided Postgres connection string
  - `ANTHROPIC_API_KEY` — your production API key
  - `JWT_SECRET` — a strong, unique secret for production
- Deploy and verify the health check endpoint is reachable

### Frontend Deployment

- Create a new Railway service for the Next.js frontend
  - Point it to the `web/` directory in your repo
- Configure environment variables:
  - `NEXT_PUBLIC_API_URL` — the public URL of your deployed Fastify API
  - `NEXTAUTH_SECRET` — a strong, unique secret for production
- Deploy and verify the landing page loads

### Post-Deployment Verification

- Test the full flow on the production URL:
  - Register a new account
  - Complete onboarding with a bio
  - View matches and conversation starters
  - Send and accept a connection
- Check that CORS is correctly configured (frontend domain can reach the API)
- Check that the Claude API calls work from the production server
- Monitor Railway logs for any errors
- Add the production URL to your GitHub repository description and README

---

## Phase 16: Final Touches & Portfolio Readiness

- Write a thorough `README.md` covering:
  - What the project is and why it exists
  - Screenshots or a GIF of the app in action
  - Tech stack and architecture overview
  - How to run locally with Docker Compose
  - Environment variable reference
  - Link to the live deployment
- Add a `CONTRIBUTING.md` if you want to invite collaborators
- Tag a `v1.0` release on GitHub
- Pin the repository on your GitHub profile
- Celebrate — you built something real
