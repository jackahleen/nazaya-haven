import type {
  AgentTask,
  IntegrationProvider,
  NotificationEvent,
  ResourceHandoff,
} from "./contracts";

export const integrationProviders = [
  {
    id: "anthropic",
    name: "Anthropic Claude",
    category: "language-model",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Power Nazaya AI chat, resource search, and legal/document guidance via claude-sonnet-4-6 with the server-side web_search tool.",
    ciUse:
      "Read ANTHROPIC_API_KEY from GitHub Secrets only in Node/build smoke jobs (dynamic-smoke.yml); never expose it to static Pages.",
    nextStep:
      "Refactor /api/chat to the shared nazaya-system-prompt and confirm the secret via dynamic-smoke.yml.",
    requiredSecretNames: ["ANTHROPIC_API_KEY"],
    runtimeSurfaces: ["github-actions", "hosted-next-runtime"],
  },
  {
    id: "simular-agent-s",
    name: "Simular Agent-S",
    category: "agent-demo",
    readiness: "direct-preview",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Drive demo-video production and caregiver tutorial walkthroughs from the deployed UI.",
    ciUse:
      "Use tools/demo/run-agent-s-demo.sh to write a demo task, then execute when Agent-S credentials are present.",
    nextStep:
      "Point Agent-S at the authenticated dashboard and digital parenting guide.",
    requiredSecretNames: ["OPENAI_API_KEY", "AGENT_S_GROUND_URL"],
    runtimeSurfaces: ["github-actions"],
  },
  {
    id: "browserbase",
    name: "Browserbase",
    category: "cloud-browser",
    readiness: "account-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Run deployed mobile and desktop browser sessions for testing, screenshots, and recordings.",
    ciUse:
      "Add CI smoke checks once BROWSERBASE_API_KEY and project configuration exist.",
    nextStep:
      "Create a Browserbase project and wire a Playwright-backed cloud smoke job. BROWSERBASE_PROJECT_ID can be provided explicitly, but the SDK can infer it from the API key.",
    requiredSecretNames: ["BROWSERBASE_API_KEY"],
    runtimeSurfaces: ["github-actions"],
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "observability",
    readiness: "account-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Capture frontend errors, release evidence, and session replay for caregiver flows.",
    ciUse:
      "Upload source maps and annotate releases after a Sentry project DSN is available.",
    nextStep:
      "Create the Sentry project and add DSN/auth-token secrets before enabling upload.",
    requiredSecretNames: ["NEXT_PUBLIC_SENTRY_DSN", "SENTRY_AUTH_TOKEN"],
    runtimeSurfaces: ["static-preview", "github-actions", "hosted-next-runtime"],
  },
  {
    id: "deepgram",
    name: "Deepgram",
    category: "voice",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Real-time voice intake with three-tier fallback: (1) Deepgram live WebSocket streaming on hosted runtime via /api/voice/deepgram/token short-lived tokens (2) Web Speech API browser fallback with interim + final transcripts (3) typed textarea for static preview. Intent routing maps voice to resource paths (Find resources / Legal forms / Grounding / Digital parenting). Bilingual support (English/Español). Spoken replies via SpeechSynthesis. Live recording levels and privacy-first design.",
    ciUse:
      "Static tests verify tier badges (\"Deepgram live\" / \"Browser speech\" / \"Type\"), intent chips, language toggle, and privacy notices. Hosted tests require Deepgram token endpoint availability.",
    nextStep:
      "Set DEEPGRAM_API_KEY on Vercel to mint tokens; token route at /api/voice/deepgram/token already streams audio via native WebSocket (nova-2 model). Wire voice widget deeper into dashboard and resources lane for prominent caregiver entry point.",
    requiredSecretNames: ["DEEPGRAM_API_KEY"],
    runtimeSurfaces: ["hosted-next-runtime"],
  },
  {
    id: "fetch-ai",
    name: "Fetch.ai uAgents",
    category: "agent-orchestration",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Coordinate resource-routing agents that can accept typed handoffs from Nazaya Haven via the dispatch contracts.",
    ciUse:
      "Validate contract fixtures before running any external agent process.",
    nextStep:
      "Stand up a uAgents worker on Agentverse and point UAGENTS_WORKER_ENDPOINT at it.",
    requiredSecretNames: ["AGENTVERSE_API_TOKEN"],
    runtimeSurfaces: ["hosted-next-runtime"],
  },
  {
    id: "orkes",
    name: "Orkes Conductor",
    category: "workflow-orchestration",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Model durable resource, notification, form-start, and follow-up workflows through the dispatch contracts.",
    ciUse:
      "Validate workflow definitions before posting to Orkes when credentials exist.",
    nextStep:
      "Draft the caregiver notification workflow around agent task completion, then provide CONDUCTOR_SERVER_URL and a short-lived CONDUCTOR_AUTH_TOKEN.",
    requiredSecretNames: ["CONDUCTOR_SERVER_URL", "CONDUCTOR_AUTH_TOKEN"],
    runtimeSurfaces: ["hosted-next-runtime"],
  },
  {
    id: "cognition",
    name: "Cognition",
    category: "engineering-agent",
    readiness: "bookmarked",
    directConsumer: false,
    plaiAdapterStatus: "PLAI adapter deferred",
    appUse:
      "Keep as an engineering or delegated-build candidate until an app-facing use is selected.",
    ciUse:
      "Optional Devin PR-review job; human code review still required.",
    nextStep:
      "Decide whether Cognition is a build assistant or an in-product agent surface.",
    requiredSecretNames: [],
    runtimeSurfaces: ["github-actions"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "data-store",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter excluded",
    appUse:
      "Cache expensive Claude search outputs, normalized agent traces, and non-PLAI app state. PLAI substrate integration still uses NATS/JetStream.",
    ciUse:
      "Run a REDIS_URL smoke check when the secret is present; skip gracefully for static preview builds.",
    nextStep:
      "Provision REDIS_URL and verify cached resource-search responses before wiring agent trace persistence.",
    requiredSecretNames: ["REDIS_URL"],
    runtimeSurfaces: ["github-actions", "hosted-next-runtime"],
  },
] as const satisfies readonly IntegrationProvider[];

export const visibleIntegrationProviders = integrationProviders;

export const demoAgentTasks = [
  {
    id: "agent-s-demo-video",
    kind: "demo-video",
    providerId: "simular-agent-s",
    label: "Record authenticated demo walkthrough",
    targetRoute: "/dashboard/",
    status: "queued",
  },
  {
    id: "digital-parenting-tour",
    kind: "guided-navigation",
    providerId: "simular-agent-s",
    label: "Guide caregiver through digital parenting literacy",
    targetRoute: "/dashboard/",
    status: "draft",
  },
  {
    id: "deepgram-voice-intake",
    kind: "voice-session",
    providerId: "deepgram",
    label: "Live voice intake with intent routing and bilingual support",
    targetRoute: "/resources/",
    status: "running",
  },
] as const satisfies readonly AgentTask[];

export const demoNotificationEvents = [
  {
    id: "agent-task-ready",
    providerId: "orkes",
    label: "Agent task ready",
    audience: "caregiver",
    trigger: "Agent-S completes a walkthrough or resource preparation task.",
  },
  {
    id: "browserbase-regression",
    providerId: "browserbase",
    label: "Preview smoke check recorded",
    audience: "teammate",
    trigger: "Browserbase captures a deployed preview regression run.",
  },
] as const satisfies readonly NotificationEvent[];

export const demoResourceHandoffs = [
  {
    id: "resource-routing-agent",
    providerId: "fetch-ai",
    lane: "resources",
    summary:
      "Resource lane can hand a caregiver need to an external routing agent.",
  },
  {
    id: "forms-workflow",
    providerId: "orkes",
    lane: "documents",
    summary:
      "Documents lane can send form-start status into a durable workflow.",
  },
] as const satisfies readonly ResourceHandoff[];
