export type IntegrationProviderId =
  | "anthropic"
  | "simular-agent-s"
  | "browserbase"
  | "sentry"
  | "deepgram"
  | "fetch-ai"
  | "orkes"
  | "cognition"
  | "redis"
  | "contextual-ai";

export type IntegrationCategory =
  | "language-model"
  | "agent-demo"
  | "cloud-browser"
  | "observability"
  | "voice"
  | "agent-orchestration"
  | "workflow-orchestration"
  | "engineering-agent"
  | "data-store"
  | "retrieval-ranking";

export type IntegrationReadiness =
  | "direct-preview"
  | "account-needed"
  | "service-needed"
  | "bookmarked";

export type PlaiAdapterStatus =
  | "PLAI adapter queued"
  | "PLAI adapter deferred"
  | "PLAI adapter excluded";

// Where a provider can actually run. The static GitHub Pages preview cannot
// execute API routes or hold secrets, so secret-backed providers list only
// "github-actions" and/or "hosted-next-runtime" (Vercel).
export type RuntimeSurface =
  | "static-preview"
  | "github-actions"
  | "hosted-next-runtime";

export type IntegrationProvider = {
  id: IntegrationProviderId;
  name: string;
  category: IntegrationCategory;
  readiness: IntegrationReadiness;
  directConsumer: boolean;
  plaiAdapterStatus: PlaiAdapterStatus;
  appUse: string;
  ciUse: string;
  nextStep: string;
  requiredSecretNames: readonly string[];
  runtimeSurfaces: readonly RuntimeSurface[];
};

export type AgentTaskKind =
  | "demo-video"
  | "guided-navigation"
  | "form-handoff"
  | "resource-handoff"
  | "voice-session";

export type AgentTask = {
  id: string;
  kind: AgentTaskKind;
  providerId: IntegrationProviderId;
  label: string;
  targetRoute: string;
  status: "draft" | "queued" | "running" | "complete" | "blocked";
};

export type NotificationEvent = {
  id: string;
  providerId: IntegrationProviderId;
  label: string;
  audience: "caregiver" | "teammate" | "system";
  trigger: string;
};

export type ResourceHandoff = {
  id: string;
  providerId: IntegrationProviderId;
  lane: "resources" | "documents" | "digital-parenting" | "voice";
  summary: string;
};
