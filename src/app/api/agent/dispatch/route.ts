import { NextResponse } from "next/server";
import { createHash } from "crypto";
import type {
  LaneDispatchKind,
  DispatchLane,
  LaneDispatchRequest,
} from "@/lib/agents/dispatch-contracts";
import { dispatchFetchAgent } from "@/lib/agents/fetch-ai-adapter";
import { isStaticNazayaRuntime } from "@/lib/runtime/nazaya-runtime";
import {
  simulateMockAgentResponse,
  traceMockAgentHandoff,
} from "@/lib/agents/mock-uagent";

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
 *   inputSummary: string,
 *   consentToPersistTrace?: boolean
 * }
 *
 * GET /api/agent/dispatch?id=...&pollCount=...&kind=...&lane=...
 *
 * Returns deterministic mock state machine for a dispatch status without
 * hitting the network. Status transitions are derived from dispatch ID hash
 * (not Date.now or Math.random). Only available on hosted runtime (Vercel/dev);
 * static exports gracefully return 404 and clients fall back to client-side
 * progression.
 */
interface DispatchRequestBody {
  kind: LaneDispatchKind;
  lane: DispatchLane;
  inputSummary: string;
  consentToPersistTrace?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DispatchRequestBody>;

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
      consentToPersistTrace: body.consentToPersistTrace ?? false,
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

// GET endpoint: only available on hosted runtime (Vercel/dev).
// Not exported on static builds, so clients get 404 and degrade gracefully.
// NOTE: For build compatibility with static export, this is conditionally-defined.
const createGETHandler = () =>
  async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      const pollCountStr = url.searchParams.get("pollCount") || "0";
      const kindParam = url.searchParams.get("kind") || "resource-routing";
      const laneParam = url.searchParams.get("lane") || "resources";

      // Validate required parameters
      if (!id) {
        return NextResponse.json(
          { error: "Missing required parameter: id" },
          { status: 400 },
        );
      }

      // Parse pollCount; validate it's a non-negative integer
      let pollCount = parseInt(pollCountStr, 10);
      if (isNaN(pollCount) || pollCount < 0) {
        pollCount = 0;
      }

      // Validate kind and lane are known dispatch types
      const kind = kindParam as LaneDispatchKind;
      const lane = laneParam as DispatchLane;

      const validKinds: LaneDispatchKind[] = [
        "resource-routing",
        "form-recommendation",
        "form-fill",
        "caregiver-notification",
      ];
      const validLanes: DispatchLane[] = [
        "resources",
        "documents",
        "digital-parenting",
        "child-corner",
        "chat",
        "voice",
      ];

      if (!validKinds.includes(kind) || !validLanes.includes(lane)) {
        return NextResponse.json(
          { error: "Invalid kind or lane" },
          { status: 400 },
        );
      }

      // Simulate agent response based on deterministic progression
      const agentResponse = simulateMockAgentResponse(
        id,
        kind,
        lane,
        pollCount,
      );

      // Trace the handoff chain (reasoning steps)
      const handoffChain = traceMockAgentHandoff(kind, lane, pollCount);

      return NextResponse.json(
        {
          id,
          provider: "fetch-ai",
          ...agentResponse,
          handoffChain,
          pollCount,
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    } catch (error) {
      console.error("Agent status route error", error);
      return NextResponse.json(
        { error: "Status lookup failed; see server logs." },
        { status: 500 },
      );
    }
  };

// Only export GET on hosted runtimes to avoid static export conflicts
const GET = !isStaticNazayaRuntime() ? createGETHandler() : undefined;

// Re-export GET if it exists for Next.js route handling
export { GET };
