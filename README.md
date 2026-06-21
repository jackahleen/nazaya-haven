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
