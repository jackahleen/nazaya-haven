import {
  type LaneDispatchRequest,
  type LaneDispatchResult,
  mockDispatchResult,
} from "@/lib/agents/dispatch-contracts";
import { writeAgentTrace } from "@/lib/agents/agent-traces";

// Dispatches a lane request to a Fetch.ai uAgent. uAgents itself is a Python
// framework hosted on Agentverse (or a self-managed worker); the Next app only
// speaks to its REST surface. This must run on a hosted runtime (Vercel) — it
// is never reachable from the static GitHub Pages export. When unconfigured it
// degrades to a queued stub so callers never throw.
//
// When consentToPersistTrace is true and the result is completed, optionally
// writes the trace to Redis (via writeAgentTrace) — but only if REDIS_URL is
// configured. Otherwise it safely no-ops.
//
// NOTE: confirm the exact Agentverse submit endpoint/shape against current docs
// when wiring the live worker; UAGENTS_WORKER_ENDPOINT overrides the default.

const DEFAULT_ENDPOINT = "https://agentverse.ai/v1/submit";

export async function dispatchFetchAgent(
  request: LaneDispatchRequest,
): Promise<LaneDispatchResult> {
  const endpoint = process.env.UAGENTS_WORKER_ENDPOINT ?? DEFAULT_ENDPOINT;
  const token = process.env.AGENTVERSE_API_TOKEN;

  if (!token) {
    return mockDispatchResult(
      request,
      "fetch-ai",
      "Fetch.ai dispatch is not configured (no AGENTVERSE_API_TOKEN); returning a queued stub.",
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kind: request.kind,
        lane: request.lane,
        inputSummary: request.inputSummary,
      }),
    });

    if (!response.ok) {
      throw new Error(`Agentverse error: ${response.status}`);
    }

    const data = (await response.json()) as Partial<LaneDispatchResult>;
    const result: LaneDispatchResult = {
      id: request.id,
      provider: "fetch-ai",
      status: data.status ?? "running",
      outputSummary: data.outputSummary,
      artifactRefs: data.artifactRefs ?? [],
    };

    // Optionally persist trace if caregiver consented and result is complete
    if (request.consentToPersistTrace && result.status === "completed") {
      await writeAgentTrace({
        provider: "fetch-ai",
        taskId: request.id,
        lane: request.lane,
        inputSummary: request.inputSummary,
        outputSummary: result.outputSummary ?? "",
        artifactRefs: result.artifactRefs,
      });
    }

    return result;
  } catch (error) {
    console.error("Fetch.ai dispatch failed", error);
    return {
      id: request.id,
      provider: "fetch-ai",
      status: "failed",
      outputSummary: "Fetch.ai dispatch failed; see server logs.",
      artifactRefs: [],
    };
  }
}
