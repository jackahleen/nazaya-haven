import {
  type LaneDispatchRequest,
  type LaneDispatchResult,
  mockDispatchResult,
} from "@/lib/agents/dispatch-contracts";

// Starts an Orkes Conductor workflow for a lane request via the Conductor REST
// API. Prefer the durable-state path (Orkes) over open-ended agent reasoning
// (Fetch.ai) when the flow has explicit stages, retries, and human-in-the-loop
// approvals (e.g. upload -> classify -> recommend -> fill -> review). Hosted
// runtime only; degrades to a queued stub when unconfigured.
//
// NOTE: production Orkes Cloud auth exchanges CONDUCTOR_AUTH_KEY/SECRET for a
// short-lived token at POST /api/token. This scaffold accepts a pre-obtained
// CONDUCTOR_AUTH_TOKEN to stay dependency-free; swap in the token exchange (or
// the @io-orkes/conductor-javascript client) when wiring the live workflow.

export async function dispatchOrkesWorkflow(
  request: LaneDispatchRequest,
  workflowName = "nazaya_lane_dispatch",
  version = 1,
): Promise<LaneDispatchResult> {
  const serverUrl = process.env.CONDUCTOR_SERVER_URL;
  const token = process.env.CONDUCTOR_AUTH_TOKEN;

  if (!serverUrl || !token) {
    return mockDispatchResult(
      request,
      "orkes",
      "Orkes workflow dispatch is not configured (no CONDUCTOR_SERVER_URL/token); returning a queued stub.",
    );
  }

  try {
    const response = await fetch(
      `${serverUrl.replace(/\/$/, "")}/api/workflow/${workflowName}?version=${version}`,
      {
        method: "POST",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: request.kind,
          lane: request.lane,
          inputSummary: request.inputSummary,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Conductor error: ${response.status}`);
    }

    const workflowId = (await response.text()).trim();
    return {
      id: request.id,
      provider: "orkes",
      status: "running",
      outputSummary: `Started Orkes workflow ${workflowName} (${workflowId}).`,
      artifactRefs: [workflowId],
    };
  } catch (error) {
    console.error("Orkes dispatch failed", error);
    return {
      id: request.id,
      provider: "orkes",
      status: "failed",
      outputSummary: "Orkes workflow dispatch failed; see server logs.",
      artifactRefs: [],
    };
  }
}
