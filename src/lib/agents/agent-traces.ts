import { cacheKey } from "@/lib/cache/cache-keys";
import { readJsonCache, writeJsonCache } from "@/lib/cache/json-cache";
import type { SelectedSponsorProviderId } from "@/integrations/sponsor-adapters";

export type AgentTrace = {
  provider: SelectedSponsorProviderId;
  taskId: string;
  lane:
    | "resources"
    | "documents"
    | "digital-parenting"
    | "child-corner"
    | "chat"
    | "voice";
  inputSummary: string;
  outputSummary: string;
  artifactRefs: string[];
};

export function agentTraceKey(trace: Pick<AgentTrace, "provider" | "taskId">) {
  return cacheKey("agent-trace", trace);
}

export async function readAgentTrace(
  provider: AgentTrace["provider"],
  taskId: string,
) {
  return readJsonCache<AgentTrace>(agentTraceKey({ provider, taskId }));
}

export async function writeAgentTrace(trace: AgentTrace) {
  await writeJsonCache(agentTraceKey(trace), trace, 60 * 60 * 24 * 7);
}
