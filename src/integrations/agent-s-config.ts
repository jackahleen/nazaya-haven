// Agent-S / Simular demo configuration loader.
//
// Server-only: returns null in the browser and whenever demo execution is
// disabled, so the static GitHub Pages preview never depends on Agent-S
// credentials. Mirrors the env contract already used by
// .github/workflows/demo-video.yml and tools/demo/run-agent-s-demo.sh.

export type AgentSMode = "cli" | "sai-cloud" | "sponsor-demo";

export type AgentSConfig = {
  mode: AgentSMode;
  enableRun: boolean;
  provider: "openai" | "anthropic";
  model: string;
  groundProvider: "huggingface" | "custom";
  groundUrl?: string;
  groundModel: string;
  groundingWidth: number;
  groundingHeight: number;
  timeoutSeconds: number;
  task: string;
  targetUrl: string;
  sponsorDemoCommand?: string;
  sponsorDemoVideoPath?: string;
};

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Loads the Agent-S demo configuration from the environment.
 * Returns null on the client and whenever AGENT_S_ENABLE_RUN !== "true",
 * so callers degrade to a "demo runs in CI only" affordance.
 */
export function loadAgentSConfig(): AgentSConfig | null {
  if (typeof window !== "undefined") return null;
  if (process.env.AGENT_S_ENABLE_RUN !== "true") return null;

  return {
    mode: process.env.SIMULAR_DEMO_COMMAND ? "sponsor-demo" : "cli",
    enableRun: true,
    provider:
      process.env.AGENT_S_PROVIDER === "anthropic" ? "anthropic" : "openai",
    model: process.env.AGENT_S_MODEL ?? "gpt-5-2025-08-07",
    groundProvider:
      process.env.AGENT_S_GROUND_PROVIDER === "custom" ? "custom" : "huggingface",
    groundUrl: process.env.AGENT_S_GROUND_URL,
    groundModel: process.env.AGENT_S_GROUND_MODEL ?? "ui-tars-1.5-7b",
    groundingWidth: intFromEnv("AGENT_S_GROUNDING_WIDTH", 1920),
    groundingHeight: intFromEnv("AGENT_S_GROUNDING_HEIGHT", 1080),
    timeoutSeconds: intFromEnv("AGENT_S_TIMEOUT_SECONDS", 900),
    task: process.env.AGENT_S_TASK ?? "",
    targetUrl: process.env.DEMO_TARGET_URL ?? "",
    sponsorDemoCommand: process.env.SIMULAR_DEMO_COMMAND,
    sponsorDemoVideoPath: process.env.SIMULAR_DEMO_VIDEO_PATH,
  };
}
