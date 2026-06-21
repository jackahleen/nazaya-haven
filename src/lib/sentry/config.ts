type SentryEnv = Partial<
  Pick<
    NodeJS.ProcessEnv,
    "NEXT_PUBLIC_SENTRY_DSN" | "NEXT_PUBLIC_SENTRY_RELEASE" | "NODE_ENV"
  >
>;

export type SentryRuntimeConfig = {
  dsn: string | undefined;
  enabled: boolean;
  environment: string;
  release: string | undefined;
  tracesSampleRate: number;
};

const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const phonePattern =
  /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g;

export function getSentryRuntimeConfig(
  env: SentryEnv = process.env,
): SentryRuntimeConfig {
  const dsn = env.NEXT_PUBLIC_SENTRY_DSN?.trim() || undefined;
  const environment = env.NODE_ENV || "test";

  return {
    dsn,
    enabled: Boolean(dsn),
    environment,
    release: env.NEXT_PUBLIC_SENTRY_RELEASE?.trim() || undefined,
    tracesSampleRate: dsn ? (environment === "production" ? 0.1 : 1.0) : 0,
  };
}

function redactString(value: string): string {
  return value.replace(emailPattern, "[EMAIL]").replace(phonePattern, "[PHONE]");
}

function redactUnknown(value: unknown): unknown {
  if (typeof value === "string") {
    return redactString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactUnknown(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, redactUnknown(entry)]),
  );
}

export function redactSentryEvent<T>(event: T): T {
  return redactUnknown(event) as T;
}
