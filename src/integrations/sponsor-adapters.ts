import type {
  IntegrationProvider,
  PlaiAdapterStatus,
} from "./contracts";
import { integrationProviders } from "./provider-registry";

export type SelectedSponsorProviderId =
  | "simular-agent-s"
  | "browserbase"
  | "sentry"
  | "deepgram"
  | "fetch-ai"
  | "orkes"
  | "redis";

export type SponsorCapability =
  | "demo-video"
  | "cloud-browser-testing"
  | "frontend-observability"
  | "voice-intake"
  | "agent-orchestration"
  | "workflow-orchestration"
  | "trace-store";

export type SponsorRuntimeStatus =
  | "configured"
  | "missing-secrets"
  | "not-required";

export type SponsorAdapter = {
  providerId: SelectedSponsorProviderId;
  capability: SponsorCapability;
  directConsumerSurface: string;
  plaiAdapterStatus: PlaiAdapterStatus;
  concreteDirectConsumer: boolean;
  requiredSecretNames: readonly string[];
};

export type SponsorRuntimeProvider = SponsorAdapter & {
  name: string;
  runtimeStatus: SponsorRuntimeStatus;
  missingSecretNames: string[];
};

export type SponsorRuntimeSnapshot = {
  generatedFor: "static-preview" | "server-runtime";
  providers: SponsorRuntimeProvider[];
};

type EnvLike = Record<string, string | undefined>;

function provider(providerId: SelectedSponsorProviderId): IntegrationProvider {
  const match = integrationProviders.find((item) => item.id === providerId);
  if (!match) {
    throw new Error(`Missing provider registry entry for ${providerId}`);
  }
  return match;
}

function adapter(
  providerId: SelectedSponsorProviderId,
  capability: SponsorCapability,
  directConsumerSurface: string,
  concreteDirectConsumer = false,
): SponsorAdapter {
  const match = provider(providerId);
  return {
    providerId,
    capability,
    directConsumerSurface,
    plaiAdapterStatus: match.plaiAdapterStatus,
    concreteDirectConsumer,
    requiredSecretNames: match.requiredSecretNames,
  };
}

export const sponsorAdapters = [
  adapter(
    "simular-agent-s",
    "demo-video",
    ".github/workflows/demo-video.yml",
  ),
  adapter(
    "browserbase",
    "cloud-browser-testing",
    ".github/workflows/browserbase-smoke.yml",
  ),
  adapter("sentry", "frontend-observability", "future Sentry SDK bootstrap"),
  adapter("deepgram", "voice-intake", "future voice token endpoint"),
  adapter("fetch-ai", "agent-orchestration", "future resource handoff worker"),
  adapter("orkes", "workflow-orchestration", "future notification workflow"),
  adapter("redis", "trace-store", "src/lib/agents/agent-traces.ts", true),
] as const satisfies readonly SponsorAdapter[];

function runtimeStatus(
  requiredSecretNames: readonly string[],
  missingSecretNames: readonly string[],
): SponsorRuntimeStatus {
  if (requiredSecretNames.length === 0) return "not-required";
  return missingSecretNames.length === 0 ? "configured" : "missing-secrets";
}

export function getSponsorRuntimeSnapshot(
  env: EnvLike = process.env,
): SponsorRuntimeSnapshot {
  return {
    generatedFor: process.env.NEXT_PUBLIC_BASE_PATH ? "static-preview" : "server-runtime",
    providers: sponsorAdapters.map((item) => {
      const missingSecretNames = item.requiredSecretNames.filter(
        (secretName) => !env[secretName],
      );
      return {
        ...item,
        name: provider(item.providerId).name,
        runtimeStatus: runtimeStatus(
          item.requiredSecretNames,
          missingSecretNames,
        ),
        missingSecretNames,
      };
    }),
  };
}

export function getSponsorRuntimeProvider(
  providerId: SelectedSponsorProviderId,
  env: EnvLike = process.env,
) {
  return getSponsorRuntimeSnapshot(env).providers.find(
    (item) => item.providerId === providerId,
  );
}
