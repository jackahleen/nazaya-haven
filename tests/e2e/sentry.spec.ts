import { expect, test } from "@playwright/test";
import { integrationProviders } from "../../src/integrations/provider-registry";
import {
  getSentryRuntimeConfig,
  redactSentryEvent,
} from "../../src/lib/sentry/config";

test("sentry runtime config is DSN gated and release aware", () => {
  expect(getSentryRuntimeConfig({})).toEqual({
    dsn: undefined,
    enabled: false,
    environment: "test",
    release: undefined,
    tracesSampleRate: 0,
  });

  expect(
    getSentryRuntimeConfig({
      NEXT_PUBLIC_SENTRY_DSN: "https://public@example.ingest.sentry.io/123",
      NEXT_PUBLIC_SENTRY_RELEASE: "abc123",
      NODE_ENV: "production",
    }),
  ).toEqual({
    dsn: "https://public@example.ingest.sentry.io/123",
    enabled: true,
    environment: "production",
    release: "abc123",
    tracesSampleRate: 0.1,
  });
});

test("sentry event redaction removes caregiver contact details", () => {
  const redacted = redactSentryEvent({
    message:
      "Caregiver parent@example.com asked for a call at (415) 864-8848.",
    request: {
      url: "https://nazaya.test/resources?email=parent@example.com&phone=415-864-8848",
    },
    extra: {
      note: "Follow up with helper@example.org or +1 415 555 1212.",
    },
  });

  const serialized = JSON.stringify(redacted);

  expect(serialized).not.toContain("parent@example.com");
  expect(serialized).not.toContain("helper@example.org");
  expect(serialized).not.toContain("(415) 864-8848");
  expect(serialized).not.toContain("415-864-8848");
  expect(serialized).not.toContain("+1 415 555 1212");
  expect(serialized).toContain("[EMAIL]");
  expect(serialized).toContain("[PHONE]");
});

test("sentry provider registry reflects wired observability integration", () => {
  const sentry = integrationProviders.find((provider) => provider.id === "sentry");

  expect(sentry?.readiness).toBe("service-needed");
  expect(sentry?.requiredSecretNames).toEqual([
    "NEXT_PUBLIC_SENTRY_DSN",
    "SENTRY_AUTH_TOKEN",
    "SENTRY_ORG",
    "SENTRY_PROJECT",
  ]);
  expect(sentry?.appUse).toContain("strip PII");
});
