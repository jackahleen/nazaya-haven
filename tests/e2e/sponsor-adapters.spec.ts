import { expect, test } from "@playwright/test";
import {
  getSponsorRuntimeSnapshot,
  sponsorAdapters,
} from "../../src/integrations/sponsor-adapters";
import { writeSponsorTraceIfConfigured } from "../../src/integrations/sponsor-traces";

test("selected sponsors have typed adapter records", () => {
  expect(sponsorAdapters.map((adapter) => adapter.providerId)).toEqual([
    "simular-agent-s",
    "browserbase",
    "sentry",
    "deepgram",
    "fetch-ai",
    "orkes",
    "redis",
  ]);
});

test("runtime snapshot is env gated and hides secret values", () => {
  const snapshot = getSponsorRuntimeSnapshot({
    REDIS_URL: "redis://:secret@localhost:6379",
    BROWSERBASE_API_KEY: "browserbase-secret",
  });

  const redis = snapshot.providers.find(
    (provider) => provider.providerId === "redis",
  );
  expect(redis?.runtimeStatus).toBe("configured");
  expect(redis?.missingSecretNames).toEqual([]);

  const browserbase = snapshot.providers.find(
    (provider) => provider.providerId === "browserbase",
  );
  expect(browserbase?.runtimeStatus).toBe("configured");
  expect(browserbase?.missingSecretNames).toEqual([]);

  expect(JSON.stringify(snapshot)).not.toContain("browserbase-secret");
  expect(JSON.stringify(snapshot)).not.toContain("redis://:secret@localhost");
});

test("redis trace writes skip safely until REDIS_URL is configured", async () => {
  const result = await writeSponsorTraceIfConfigured(
    {
      provider: "simular-agent-s",
      taskId: "agent-s-demo-video",
      lane: "digital-parenting",
      inputSummary: "Open the authenticated dashboard preview.",
      outputSummary: "Prepared a guided walkthrough trace.",
      artifactRefs: ["artifacts/demo/demo-brief.md"],
    },
    {},
  );

  expect(result).toEqual({
    status: "skipped",
    providerId: "simular-agent-s",
    reason: "redis-not-configured",
    missingSecretNames: ["REDIS_URL"],
  });
});
