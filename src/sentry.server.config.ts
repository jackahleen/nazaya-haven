import * as Sentry from "@sentry/nextjs";
import { getSentryRuntimeConfig, redactSentryEvent } from "@/lib/sentry/config";

const config = getSentryRuntimeConfig();

if (config.enabled) {
  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    sendDefaultPii: false,
    tracesSampleRate: config.tracesSampleRate,
    beforeSend: redactSentryEvent,
  });
}
