# Local Deployment (Windows)

Verified on Windows 11 with Node v24.16.0, npm 11.13.0, git 2.54.0.
This is the recommended path for the Simular/Sai demo-video lane: drive a real
browser against `localhost` and capture the walkthrough — no Browserbase or
cloud secrets required.

## Prerequisites
- Node 20+ (tested on 24.16) and npm 11+
- `npm install` (clean: 427 packages, 0 vulnerabilities on Windows)

## Two local modes

| Mode | Command | What works | Use for |
|------|---------|-----------|---------|
| **Static preview** | `npm run build` then `npm run serve:static` | Full UI, all routes. **No API keys.** Mirrors GitHub Pages exactly. | Pure UI/UX walkthrough |
| **Dev (full runtime)** | `npm run dev` | UI **+ live /api/*** (Nazaya AI chat, resources, voice) | Demo where AI must actually respond |

Both serve on http://127.0.0.1:3000.

## ⚠️ Static mode caveat
`npm run build` emits the `/api/*` routes as `ƒ (Dynamic)`, but a static
`serve out` cannot execute them. So on the static / GitHub Pages preview the
**Nazaya AI chat and resource/legal search are non-functional** (requests fail
silently). For a demo that shows working AI, use `npm run dev` (or the Vercel
`NAZAYA_RUNTIME=hosted` runtime). See run-local-windows.ps1.

## Quick start (PowerShell)
```powershell
npm install
# Option A — static preview (matches Pages):
npm run build; npm run serve:static
# Option B — full dev runtime (live AI):
npm run dev
```
Then open http://127.0.0.1:3000.

## One-liner runner
```powershell
# Static preview (default):
./tools/demo/run-local-windows.ps1
# Full dev runtime:
./tools/demo/run-local-windows.ps1 -Mode dev
```



## Recording a walkthrough video (live runtime)

For the Simular/Sai demo-video lane. Records the live dev runtime (real /api/* —
the AI chat response is real, not the static fallback) into a .webm using the
Playwright browser already in devDependencies. GitHub PR/issue comments accept
.webm uploads directly.

```powershell
# 1. start the live runtime
npm run dev
# 2. (first time only) install the Playwright browser
npx playwright install chromium
# 3. record -> writes a .webm into the folder given by VIDEO_DIR
$env:VIDEO_DIR = "$PWD\_video"; node tools/demo/record-walkthrough.mjs
```

The script walks: landing -> Get Started -> demo login -> dashboard -> live
Nazaya AI chat -> resource search -> legal. Edit `tools/demo/record-walkthrough.mjs`
to adjust the route/interaction sequence. Output is `_video/*.webm` (gitignored).
