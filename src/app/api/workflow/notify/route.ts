import { NextResponse } from "next/server";
import { dispatchOrkesWorkflow } from "@/lib/workflows/orkes-adapter";
import type { LaneDispatchRequest } from "@/lib/agents/dispatch-contracts";

// POST /api/workflow/notify
//
// Demonstrates a durable caregiver-notification workflow dispatched through
// Orkes Conductor. Accepts a notification trigger (e.g., "agent-task-ready")
// and hands it off to a queued or live orchestration platform.
//
// Request body:
//   { trigger: "agent-task-ready" | string; message?: string }
//
// Response (hosted mode):
//   { queued: true; workflowId: "..." } or { failed: true; reason: "..." }
//
// Response (static preview):
//   { queued: true; stubMessage: "Orkes workflow dispatch is not configured..." }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trigger, message } = body as {
      trigger?: string;
      message?: string;
    };

    if (!trigger) {
      return NextResponse.json(
        { error: "Missing required field: trigger" },
        { status: 400 },
      );
    }

    // Build a dispatch request for the notification workflow.
    const dispatchRequest: LaneDispatchRequest = {
      id: `notify-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      kind: "caregiver-notification",
      lane: "documents",
      inputSummary: message || `Caregiver notification: ${trigger}`,
      consentToPersistTrace: false,
    };

    const result = await dispatchOrkesWorkflow(
      dispatchRequest,
      "nazaya_caregiver_notification",
      1,
    );

    return NextResponse.json(
      {
        queued: result.status !== "failed",
        workflowId: result.artifactRefs[0] || null,
        status: result.status,
        note: result.outputSummary,
      },
      { status: result.status === "failed" ? 502 : 202 },
    );
  } catch (error) {
    console.error("[notify route] Error:", error);
    return NextResponse.json(
      { error: "Failed to queue notification workflow" },
      { status: 500 },
    );
  }
}
