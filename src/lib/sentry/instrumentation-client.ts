import * as Sentry from "@sentry/nextjs";
import { getSentryRuntimeConfig, redactSentryEvent } from "./config";

export function initClientSentry() {
  const config = getSentryRuntimeConfig();

  if (!config.enabled) {
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    sendDefaultPii: false,
    tracesSampleRate: config.tracesSampleRate,
    beforeSend: redactSentryEvent,
  });
}
