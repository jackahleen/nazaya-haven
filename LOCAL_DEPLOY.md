# Local Deployment

Verified by Sai on Windows 11 with Node v24.16.0, npm 11.13.0, and
git 2.54.0. This is the recommended path for the Simular/Sai demo-video lane:
drive a real browser against localhost and capture the walkthrough without
Browserbase or cloud browser secrets.

## Prerequisites

- Node 20+ and npm 11+
- Project dependencies installed with `npm install` or `npm ci`
- Chromium installed for Playwright recording:

```powershell
npx playwright install chromium
```

## Local Modes

| Mode | Command | What works | Use for |
| --- | --- | --- | --- |
| Static preview | `npm run build` then `npm run serve:static` | Full UI, all routes, demo-mode chat/resources, no API keys | GitHub Pages parity and UI/UX walkthroughs |
| Dev runtime | `npm run dev` | UI plus live `/api/*` routes when secrets are configured | Demo where AI must actually respond |
| Hosted build | `npm run build:hosted` then `npm start` | Production-style hosted runtime | Vercel parity checks |

All local modes serve on `http://127.0.0.1:3000`.

## Static Preview Note

The static export still lists `/api/*` routes as dynamic in the Next.js build
table, but `serve out` cannot execute those routes. The UI handles that: chat
and resource search switch to demo-mode responses and show a subtle badge.

Use `npm run dev` or a hosted deployment when the walkthrough needs live Claude
responses from `ANTHROPIC_API_KEY`.

## Quick Start

```powershell
npm install

# Static preview matching GitHub Pages:
npm run build; npm run serve:static

# Full dev runtime with live API routes:
npm run dev
```

Then open `http://127.0.0.1:3000`.

## PowerShell Runner

```powershell
# Static preview, default:
./tools/demo/run-local-windows.ps1

# Full dev runtime:
./tools/demo/run-local-windows.ps1 -Mode dev
```

## Recording A Walkthrough Video

The recorder is for the Simular/Sai demo-video lane. It uses the Playwright
browser already in dev dependencies and writes `.webm` files into `_video/`.
GitHub PR and issue comments accept `.webm` uploads directly.

```powershell
# Terminal 1: start the runtime you want to record
npm run dev

# Terminal 2: record
$env:VIDEO_DIR = "$PWD\_video"
npm run demo:record
```

Useful environment overrides:

```powershell
$env:BASE_URL = "http://127.0.0.1:3000"
$env:VIDEO_DIR = "$PWD\_video"
npm run demo:record
```

The script walks: landing, demo login, dashboard, Nazaya AI chat, resource
search, and legal navigation. It works against static demo mode or a live dev
runtime; live mode needs `ANTHROPIC_API_KEY` in `.env.local`.
