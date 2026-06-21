import type {
  AgentTask,
  IntegrationProvider,
  NotificationEvent,
  ResourceHandoff,
} from "./contracts";

export const integrationProviders = [
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
      "Create a Browserbase project and wire a Playwright-backed cloud smoke job.",
    requiredSecretNames: ["BROWSERBASE_API_KEY", "BROWSERBASE_PROJECT_ID"],
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
  },
  {
    id: "deepgram",
    name: "Deepgram",
    category: "voice",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Prototype caregiver voice intake, voice assistant prompts, and transcript summaries.",
    ciUse:
      "Keep static preview mocked; real tokens need a hosted endpoint or worker.",
    nextStep:
      "Define the voice-session token endpoint once dynamic hosting is selected.",
    requiredSecretNames: ["DEEPGRAM_API_KEY"],
  },
  {
    id: "fetch-ai",
    name: "Fetch.ai uAgents",
    category: "agent-orchestration",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Coordinate resource-routing agents that can accept typed handoffs from Nazaya Haven.",
    ciUse:
      "Validate contract fixtures before running any external agent process.",
    nextStep:
      "Stand up a small uAgents worker for resource and form handoff experiments.",
    requiredSecretNames: ["FETCH_AGENT_SEED"],
  },
  {
    id: "orkes",
    name: "Orkes Conductor",
    category: "workflow-orchestration",
    readiness: "service-needed",
    directConsumer: true,
    plaiAdapterStatus: "PLAI adapter queued",
    appUse:
      "Model durable resource, notification, form-start, and follow-up workflows.",
    ciUse:
      "Validate workflow definitions before posting to Orkes when credentials exist.",
    nextStep:
      "Draft the caregiver notification workflow around agent task completion.",
    requiredSecretNames: ["ORKES_KEY_ID", "ORKES_KEY_SECRET"],
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
      "No CI role yet; evaluate once teammate workflows need a coding-agent lane.",
    nextStep:
      "Decide whether Cognition is a build assistant or an in-product agent surface.",
    requiredSecretNames: [],
  },
  {
    id: "redis",
    name: "Redis",
    category: "data-store",
    readiness: "bookmarked",
    directConsumer: false,
    plaiAdapterStatus: "PLAI adapter excluded",
    appUse:
      "Potential app cache or queue store only; do not queue for PLAI conversion because PLAI uses NATS/JetStream.",
    ciUse: "No CI role selected.",
    nextStep:
      "Only revisit if the hosted app needs non-PLAI cache or rate-limit state.",
    requiredSecretNames: [],
  },
] as const satisfies readonly IntegrationProvider[];

export const visibleIntegrationProviders = integrationProviders.filter(
  (provider) => provider.id !== "redis",
);

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
    label: "Voice intake for caregiver resource needs",
    targetRoute: "/dashboard/",
    status: "blocked",
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
