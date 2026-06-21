import { NextResponse } from "next/server";
import { createHash } from "crypto";
import type {
  LaneDispatchKind,
  DispatchLane,
  LaneDispatchRequest,
} from "@/lib/agents/dispatch-contracts";
import { dispatchFetchAgent } from "@/lib/agents/fetch-ai-adapter";

/**
 * POST /api/agent/dispatch
 *
 * Accepts a resource routing request and dispatches it to a Fetch.ai uAgent.
 * When AGENTVERSE_API_TOKEN is unset, returns a queued stub so demo works on
 * all runtimes. This route is omitted on static (GitHub Pages) builds.
 *
 * Request body:
 * {
 *   kind: LaneDispatchKind,
 *   lane: DispatchLane,
 *   inputSummary: string
 * }
 */
interface DispatchRequestBody {
  kind: LaneDispatchKind;
  lane: DispatchLane;
  inputSummary: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<DispatchRequestBody>;

    // Validate required fields
    if (!body.kind || !body.lane || !body.inputSummary) {
      return NextResponse.json(
        {
          error: "Missing required fields: kind, lane, inputSummary",
        },
        { status: 400 },
      );
    }

    // Generate stable ID from payload (deterministic hash, not random)
    const payloadHash = createHash("sha256")
      .update(JSON.stringify(body))
      .digest("hex")
      .slice(0, 12);
    const dispatchId = `dispatch-${payloadHash}`;

    // Build LaneDispatchRequest
    const dispatchRequest: LaneDispatchRequest = {
      id: dispatchId,
      kind: body.kind,
      lane: body.lane,
      inputSummary: body.inputSummary,
      consentToPersistTrace: false, // Client-side demo; no trace persistence
    };

    // Dispatch to Fetch.ai adapter
    const result = await dispatchFetchAgent(dispatchRequest);

    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Agent dispatch route error", error);
    return NextResponse.json(
      { error: "Dispatch failed; see server logs." },
      { status: 500 },
    );
  }
}
