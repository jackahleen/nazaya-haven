# Nazaya Haven Demo Video Brief

## Goal

Produce a short demo video for the Hack Berkeley Ddoski's World story: a
foster-family support hub that helps caregivers find resources, community
support, and guided next steps.

## Target Flow

1. Open the deployed Nazaya Haven UI.
2. Show the landing page tagline: "A Safe Place. A Stronger Future. Together."
3. Use "Explore Resources" or "Get Started" to enter the app.
4. Sign in with demo credentials.
5. Show the authenticated caregiver preview:
   - Signed in as Demo Caregiver
   - Kinship caregiver preview
   - Guided tasks queued for agent and teammate lanes
6. Show the dashboard cards:
   - Community Feed
   - Support Groups
   - Resources Near You
   - Journal
   - Nazaya AI
   - Digital Parenting Guide
7. Show the digital parenting literacy flow:
   - Adult-facing internet access routines
   - Platform literacy and privacy support
   - Guided navigation queue for Agent-S tutorial help
   - Notification handoffs when agent work is ready
8. Show the Integration Readiness section:
   - Simular Agent-S as the demo video and guided walkthrough consumer.
   - Browserbase as the deployed UI testing and recording consumer.
   - Sentry as the frontend observability consumer.
   - Deepgram, Fetch.ai, and Orkes as dynamic-service integrations.
   - PLAI adapter queued for selected tools, with Redis excluded from PLAI conversion.
9. Narrate the next iteration:
   - Fetch.ai or Orkes can orchestrate resource-routing workflows.
   - Deepgram can power voice intake and voice assistant flows.
   - Browserbase can run deployed UI smoke checks.
   - Sentry can capture frontend errors and release evidence.
   - Simular/Agent-S can automate demo walkthrough capture.

## Suggested Agent-S Task

Open the Nazaya Haven demo URL, navigate through the landing page, login page,
authenticated dashboard preview, Digital Parenting Literacy guide, and
Integration Readiness section. Capture a concise walkthrough video that
demonstrates how the app prepares for a foster-family resource assistant, how
Agent-S can guide adults through the app, and how sponsor tools will plug into
testing, observability, voice, orchestration, and notifications. Do not enter
real personal information. Use demo credentials only.

## Safety Notes

Agent-S can control a GUI and may execute local commands when local environment
mode is enabled. Run only in trusted, disposable environments. Keep sponsor and
model credentials in GitHub Actions secrets or local environment variables, never
in committed files.
