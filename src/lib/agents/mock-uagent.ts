/**
 * In-repo mock uAgent simulator for Fetch.ai orchestration.
 *
 * Simulates a Fetch.ai uAgent worker's staged responses without external
 * credentials. Used as fallback when AGENTVERSE_API_TOKEN is unavailable.
 *
 * The progression (queued -> running -> completed) is deterministic, derived
 * from a stable hash + a poll counter, not Date.now() or Math.random().
 */

import { createHash } from "crypto";
import type {
  LaneDispatchKind,
  DispatchLane,
  LaneDispatchStatus,
  LaneDispatchResult,
} from "@/lib/agents/dispatch-contracts";

export interface MockAgentState {
  pollCount: number;
  stageTransitions: Record<number, LaneDispatchStatus>;
  summary: string;
  artifacts: string[];
}

/**
 * Derive a pseudo-random but deterministic stage progression from a dispatch ID
 * and poll counter. The progression is:
 *   poll 0-1: queued
 *   poll 2-3: running
 *   poll 4+: completed
 */
function deriveStage(
  dispatchId: string,
  pollCount: number,
): LaneDispatchStatus {
  // Use hash to seed variance, but keep transitions stable across reruns
  const hashVal = createHash("sha256")
    .update(`${dispatchId}:${pollCount}`)
    .digest("hex")
    .charCodeAt(0);

  // Deterministic thresholds (using hash value to vary slightly, but predictably)
  const hashMod = hashVal % 3;
  if (pollCount < 2 + hashMod) return "queued";
  if (pollCount < 4 + hashMod) return "running";
  return "completed";
}

/**
 * Generate a mock response summary based on lane and kind.
 */
function generateSummary(
  kind: LaneDispatchKind,
  lane: DispatchLane,
  status: LaneDispatchStatus,
): string {
  const baseMsg = `Agent processed ${kind} for ${lane} lane`;

  if (status === "queued") {
    return `${baseMsg}; waiting to execute...`;
  }
  if (status === "running") {
    return `${baseMsg}; analyzing and routing...`;
  }

  // Completed: vary by lane/kind for verisimilitude
  switch (lane) {
    case "resources":
      return (
        kind === "resource-routing"
          ? "Routed to housing specialist; matched 3 local programs."
          : `Agent completed ${kind} for resources.`
      );
    case "documents":
      return "Document categorized and filed for review.";
    case "digital-parenting":
      return "Parenting tip generated; queued for delivery.";
    case "child-corner":
      return "Child-friendly content verified and ready.";
    case "chat":
      return "Chat context stored and escalation prepared.";
    case "voice":
      return "Voice note transcribed and filed.";
    default:
      return `Agent completed ${kind}.`;
  }
}

/**
 * Generate mock artifact references based on lane and completion status.
 */
function generateArtifacts(
  lane: DispatchLane,
  status: LaneDispatchStatus,
): string[] {
  if (status !== "completed") return [];

  switch (lane) {
    case "resources":
      return [
        "program:housing-001",
        "program:housing-002",
        "contact:social-worker-maria",
      ];
    case "documents":
      return ["file:docs-categorized", "label:urgent"];
    case "digital-parenting":
      return ["tip:001", "schedule:send-tomorrow"];
    case "child-corner":
      return ["asset:child-safe-video", "moderation:approved"];
    case "chat":
      return ["context:stored", "escalation:none-needed"];
    case "voice":
      return ["transcript:voice-note-001", "sentiment:positive"];
    default:
      return [];
  }
}

/**
 * Simulate a uAgent's staged response. Caller tracks pollCount and increments.
 */
export function simulateMockAgentResponse(
  dispatchId: string,
  kind: LaneDispatchKind,
  lane: DispatchLane,
  pollCount: number,
): Omit<LaneDispatchResult, "id" | "provider"> {
  const status = deriveStage(dispatchId, pollCount);
  const outputSummary = generateSummary(kind, lane, status);
  const artifactRefs = generateArtifacts(lane, status);

  return {
    status,
    outputSummary,
    artifactRefs,
  };
}

/**
 * Trace a handoff chain (reasoning steps) for a mock agent response.
 * This simulates the chain of decisions the agent made.
 */
export function traceMockAgentHandoff(
  kind: LaneDispatchKind,
  lane: DispatchLane,
  pollCount: number,
): string[] {
  const steps: string[] = [];

  // Always start with intake
  steps.push("Intake: received dispatch request");

  // Add queue/scheduling info (visible immediately)
  if (pollCount < 1) {
    steps.push("Scheduling: queuing for next worker batch");
    return steps;
  }

  // Running phase: add routing logic
  steps.push("Routing: analyzing " + kind);
  if (lane === "resources") {
    steps.push("Matching: searching provider database");
    steps.push("Validation: checking eligibility criteria");
  } else if (lane === "documents") {
    steps.push("Categorization: applying document classifier");
    steps.push("Filing: organizing by department");
  } else if (lane === "chat") {
    steps.push("Context: loading conversation history");
    steps.push("Escalation check: determining urgency");
  }

  // Completion phase
  if (pollCount >= 4) {
    steps.push("Completion: handoff prepared");
    steps.push("Notification: caregiver alert queued");
  }

  return steps;
}
