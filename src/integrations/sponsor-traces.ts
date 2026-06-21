import type { AgentTrace } from "@/lib/agents/agent-traces";
import { writeAgentTrace } from "@/lib/agents/agent-traces";
import { getSponsorRuntimeProvider } from "./sponsor-adapters";

type EnvLike = Record<string, string | undefined>;

export type SponsorTraceWriteResult =
  | { status: "stored"; providerId: AgentTrace["provider"] }
  | {
      status: "skipped";
      providerId: AgentTrace["provider"];
      reason: "redis-not-configured";
      missingSecretNames: string[];
    };

export async function writeSponsorTraceIfConfigured(
  trace: AgentTrace,
  env: EnvLike = process.env,
): Promise<SponsorTraceWriteResult> {
  const redis = getSponsorRuntimeProvider("redis", env);
  if (redis?.runtimeStatus !== "configured") {
    return {
      status: "skipped",
      providerId: trace.provider,
      reason: "redis-not-configured",
      missingSecretNames: redis?.missingSecretNames ?? ["REDIS_URL"],
    };
  }

  await writeAgentTrace(trace);
  return { status: "stored", providerId: trace.provider };
}
