export type IntegrationProviderId =
  | "simular-agent-s"
  | "browserbase"
  | "sentry"
  | "deepgram"
  | "fetch-ai"
  | "orkes"
  | "cognition"
  | "redis";

export type IntegrationCategory =
  | "agent-demo"
  | "cloud-browser"
  | "observability"
  | "voice"
  | "agent-orchestration"
  | "workflow-orchestration"
  | "engineering-agent"
  | "data-store";

export type IntegrationReadiness =
  | "direct-preview"
  | "account-needed"
  | "service-needed"
  | "bookmarked";

export type PlaiAdapterStatus =
  | "PLAI adapter queued"
  | "PLAI adapter deferred"
  | "PLAI adapter excluded";

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
