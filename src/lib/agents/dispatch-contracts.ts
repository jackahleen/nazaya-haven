// Provider-neutral dispatch contracts shared by the Fetch.ai and Orkes adapters.
//
// Keeping the request/result shapes here lets lane code dispatch work without
// binding to a specific orchestration vendor. The same contract feeds the
// optional Redis agent-trace store (src/lib/agents/agent-traces.ts) — but only
// when the caregiver has consented to persistence.

export type LaneDispatchKind =
  | "resource-routing"
  | "form-recommendation"
  | "form-fill"
  | "caregiver-notification";

export type DispatchLane =
  | "resources"
  | "documents"
  | "digital-parenting"
  | "child-corner"
  | "chat"
  | "voice";

export type LaneDispatchProvider = "fetch-ai" | "orkes";

export type LaneDispatchRequest = {
  id: string;
  kind: LaneDispatchKind;
  lane: DispatchLane;
  inputSummary: string;
  // Caregiver disclosures are sensitive: only persist a trace when explicitly
  // consented. Adapters must honor this before calling writeAgentTrace.
  consentToPersistTrace: boolean;
};

export type LaneDispatchStatus = "queued" | "running" | "completed" | "failed";

export type LaneDispatchResult = {
  id: string;
  provider: LaneDispatchProvider;
  status: LaneDispatchStatus;
  outputSummary?: string;
  artifactRefs: string[];
};

/** A safe queued stub returned when an orchestration provider is unconfigured. */
export function mockDispatchResult(
  request: LaneDispatchRequest,
  provider: LaneDispatchProvider,
  note: string,
): LaneDispatchResult {
  return {
    id: request.id,
    provider,
    status: "queued",
    outputSummary: note,
    artifactRefs: [],
  };
}
