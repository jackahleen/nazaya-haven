# Nazaya Haven

AI-powered advocacy and support platform for foster families, caregivers, and
children.

**Tagline:** _A Safe Place. A Stronger Future. Together._

## Hack Berkeley AI 2026

Nazaya Haven is being prepared for the **Ddoski's World** track as a
social-impact assistant for foster-family resources, social services, community
support, and voice-friendly guidance.

The current branch focuses on a static GitHub Pages preview and PWA foundation.
Richer live services such as agent orchestration, voice, browser automation, and
observability should run through hosted workers or sponsor-backed tooling instead
of the static Pages host.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Playwright route smoke tests
- GitHub Actions and GitHub Pages

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page with brand, support story, and resource entry points |
| `/login` | Demo sign-in form |
| `/dashboard` | Hub mock for community, support groups, resources, journal, and Nazaya AI |

## Local Development

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

Use npm scripts on every platform, including Windows. The Makefile mirrors these
commands for macOS/Linux and CI convenience.

Run typecheck:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Build the static export:

```bash
npm run build
```

Run route smoke tests:

```bash
npm run test:e2e
```

Run aggregate lanes:

```bash
npm run verify:pages      # typecheck + lint + static GitHub Pages build
npm run verify:static     # verify:pages + local static Playwright suite
npm run verify:hosted     # typecheck + lint + hosted/Vercel build
npm run verify:deploy     # static suite + hosted build + Browserbase lane
npm run test:runtime      # focused static fallback/demo-mode checks
npm run test:browserbase  # cloud smoke lane; skips locally without credentials
```

## GitHub Pages

The Pages workflow builds the static `out/` directory from `main` and deploys it
through GitHub Pages.

For repository Pages, the workflow sets `NEXT_PUBLIC_BASE_PATH` to the
repository name. For user or organization Pages repositories named
`<owner>.github.io`, the base path is empty.

## Demo Video Workflow

The manual `Demo Video` workflow prepares demo artifacts and can run a guarded
Simular or Agent-S capture path once sponsor credentials and grounding config
exist.

Default mode writes a demo brief and command template. Simular mode can use a
sponsor-provided `SIMULAR_DEMO_COMMAND` secret, or run the Agent-S CLI when
`AGENT_S_ENABLE_RUN` and grounding settings are configured.

Agent-S can control a GUI and may execute local commands when local environment
mode is enabled. Use it only in trusted, disposable environments.

## Deployment Architecture

Nazaya Haven uses a **dual-deploy model** to balance static hosting (GitHub Pages)
with hosted services (Vercel):

- **Static Preview (GitHub Pages)**: Fully static export (`next.config.ts` output: "export")
  built from `main` and served over Pages. No server secrets, no API routes.
- **Hosted Runtime (Vercel)**: Dynamic Next.js App Router with full API support, server
  secrets, and session management. Auto-enabled when `VERCEL=1` (set by Vercel) or
  `NAZAYA_RUNTIME=hosted` (for local testing).

**The Split:**

| Surface | Runs | Holds Secrets | Routes |
| --- | --- | --- | --- |
| Static Pages | Pages CDN | No | Pages, public client code only |
| GitHub Actions CI | Runners | Yes (secrets.X) | Validation, smoke tests, uploads |
| Vercel Hosted | Node.js | Yes (env vars) | /api/*, full App Router, middleware |

The `next.config.ts` automatically disables static export on Vercel by checking
`process.env.VERCEL`, `process.env.NODE_ENV`, and `process.env.NAZAYA_RUNTIME`.
This allows `/api/*` routes (chat, voice tokens, agent dispatch) and server-held
secrets (ANTHROPIC_API_KEY, DEEPGRAM_API_KEY, etc.) to run securely on Vercel
and under `npm run dev` while the static Pages export omits them entirely.

**Client sees only** `NEXT_PUBLIC_*` variables (e.g., `NEXT_PUBLIC_SENTRY_DSN`,
`NEXT_PUBLIC_BASE_PATH`). The config derives `NEXT_PUBLIC_NAZAYA_RUNTIME` as
`static` for GitHub Pages exports and `hosted` for local dev, Vercel, or
`NAZAYA_RUNTIME=hosted` builds.

**Demo mode:** When `NEXT_PUBLIC_NAZAYA_RUNTIME=static`, the UI does not call
`/api/chat` or `/api/resources`. Nazaya AI returns canned walkthrough responses,
resource search uses the built-in Bay Area sample directory, and both surfaces
show a subtle "Demo mode" badge. Hosted/dev runtime keeps the live API behavior
and reports live API errors instead of falling back silently.

## Reproducing & Redeploying

### Local Development

Install and start the dev server:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

### Local Static Preview (GitHub Pages Export)

Build the static export and serve it locally:

```bash
npm run build
npm run serve:static
```

This produces the exact artifact that GitHub Pages will host. Open
`http://localhost:3000` (no server routes). Chat and resource search run in
demo mode for this preview.

### Local Hosted Build (Vercel Runtime)

Test the full App Router and API routes locally:

```bash
npm run build:hosted
npm start
```

This disables `output: "export"` and enables `/api/*` routes. Server secrets
must be in `.env.local` (never committed).

### Deploy via Git Integration (GitHub Pages)

Push to `main`:

```bash
git add .
git commit -m "..."
git push origin main
```

The `pages.yml` workflow automatically builds and publishes to GitHub Pages.
For repository Pages, `NEXT_PUBLIC_BASE_PATH` is set to the repo name.

### Deploy via Vercel CLI

Link the project (one time):

```bash
vercel link
vercel pull
```

Deploy a preview:

```bash
vercel deploy
```

Deploy to production:

```bash
vercel --prod
```

Or use the Makefile:

```bash
make deploy-vercel          # Build and deploy to Vercel staging
make deploy-vercel-preview  # Deploy a preview environment
```

### Using the Makefile

All deployment workflows are available as Makefile targets:

```bash
make help              # Show all targets
make dev              # Start dev server with --turbopack
make build            # Build static export (GitHub Pages)
make build-static     # Build static export (GitHub Pages)
make build-hosted     # Build with NAZAYA_RUNTIME=hosted (Vercel)
make preview          # Serve the static export locally
make typecheck        # Run tsc --noEmit
make lint             # Run eslint .
make test             # Run static e2e tests (Playwright)
make test-runtime     # Run focused static fallback/demo-mode checks
make test-browserbase # Run Browserbase lane
make verify-pages     # Run typecheck + lint + static Pages build
make verify-static    # Run verify-pages + local static Playwright suite
make verify-hosted    # Run typecheck + lint + hosted/Vercel build
make verify-deploy    # Run static, hosted, and Browserbase lanes
make verify           # Alias for verify-deploy
make deploy-vercel    # Push to Vercel staging
make deploy-vercel-prod # Push to Vercel production
make clean            # Remove build artifacts
```

## Environment Variables

Every environment variable is grouped by its deployment surface. Static Pages
never receives secrets; Vercel and GitHub Actions do.

| Var | Surface | Purpose | Provider |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | Vercel, GA CI | Claude API key for chat, search, document guidance | Anthropic |
| `REDIS_URL` | Vercel, GA CI | Redis connection for cache and agent trace persistence | Redis |
| `UPSTASH_REDIS_REST_URL` | Vercel | Serverless Redis REST URL (alternative to REDIS_URL) | Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel | Serverless Redis auth token | Upstash |
| `DEEPGRAM_API_KEY` | Vercel | Voice intake and transcript tokens (token endpoint) | Deepgram |
| `SENTRY_AUTH_TOKEN` | GA CI | Upload source maps and annotate releases | Sentry |
| `AGENTVERSE_API_TOKEN` | Vercel | Fetch.ai Agentverse token for agent orchestration | Fetch.ai |
| `UAGENTS_WORKER_ENDPOINT` | Vercel | Fetch.ai worker endpoint URL | Fetch.ai |
| `CONDUCTOR_SERVER_URL` | Vercel | Orkes Conductor server URL | Orkes |
| `CONDUCTOR_AUTH_TOKEN` | Vercel | Orkes auth token | Orkes |
| `NEXT_PUBLIC_SENTRY_DSN` | All (public) | Sentry frontend DSN (safe to expose) | Sentry |
| `NEXT_PUBLIC_BASE_PATH` | Pages (public) | GitHub Pages base path (e.g., `/nazaya-haven`) | GitHub Pages |
| `NEXT_PUBLIC_NAZAYA_RUNTIME` | All (public, derived) | Client runtime hint: `static` enables demo mode, `hosted` uses live APIs | Local config |
| `BROWSERBASE_API_KEY` | GA CI | Cloud browser automation and testing | Browserbase |
| `BROWSERBASE_PROJECT_ID` | GA CI | Browserbase project ID (optional; SDK can infer) | Browserbase |
| `OPENAI_API_KEY` | GA CI | Demo video and Agent-S grounding (CI only) | OpenAI |
| `HF_TOKEN` | GA CI | Hugging Face token for demo agent grounding | Hugging Face |
| `AGENT_S_GROUND_URL` | GA CI | Agent-S grounding server URL for demos | Simular Agent-S |
| `SIMULAR_DEMO_COMMAND` | GA CI | Optional pre-built Simular/Agent-S command override | Simular |
| `GH_PAGES_DEPLOY_TOKEN` | GA CI | GitHub token for Pages publish (auto via GITHUB_TOKEN) | GitHub |
| `VERCEL` | Vercel (auto) | Auto-set by Vercel; triggers hosted-runtime mode | Vercel |
| `NAZAYA_RUNTIME` | Local | Set to `hosted` locally to test Vercel behavior | Local override |

See `.env.example` for all variables with placeholder values and grouping.

**Setting Secrets on Vercel:**

```bash
vercel env pull          # Pull secrets from Vercel to .env.local
vercel env add VAR_NAME  # Interactively add a secret
vercel env rm VAR_NAME   # Remove a secret
vercel env ls            # List all secrets
```

## Sponsor Tool Evaluation

The first tracked evaluation input is
`tools/evaluation/tool-candidates.json`.

Active candidates:

- Fetch.ai and Orkes for agentic resource/workflow orchestration.
- Deepgram for voice intake and voice assistant flows.
- Browserbase for live browser tests and automation.
- Sentry for frontend observability.
- Simular and Agent-S for demo production.
- Cognition for repo engineering workflow.
- Redis for possible app cache/retrieval, excluding PLAI conversion because
  PLAI substrate integration uses NATS/JetStream.

PLAI-compatible adapters should be queued only after the project directly
consumes the sponsor tool.
