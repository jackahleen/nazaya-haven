import { createHash } from "crypto";

export function cacheKey(namespace: string, value: unknown) {
  const digest = createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex")
    .slice(0, 32);

  return `nazaya:${namespace}:${digest}`;
}
