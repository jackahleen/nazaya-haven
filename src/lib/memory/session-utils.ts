import { NextRequest } from "next/server";
import { createHash } from "crypto";

/**
 * Utility: Derive or generate a stable session ID from request
 * Uses request headers/cookies if available, otherwise derives from user agent + timestamp hash
 */
export async function getSessionIdFromRequest(request: NextRequest): Promise<string> {
  // Try to get from X-Session-ID header (explicit)
  const headerSessionId = request.headers.get("X-Session-ID");
  if (headerSessionId) {
    return headerSessionId;
  }

  // Try to get from cookies
  const cookieSessionId = request.cookies.get("sessionId")?.value;
  if (cookieSessionId) {
    return cookieSessionId;
  }

  // Derive a stable session ID from request properties
  // Use user-agent + a short time window to generate consistent IDs for same user
  const userAgent = request.headers.get("user-agent") || "unknown";
  const xForwardedFor = request.headers.get("x-forwarded-for") || "";
  const referer = request.headers.get("referer") || "";

  // Use a 1-hour time window to generate consistent session IDs
  const hourBucket = Math.floor(Date.now() / (60 * 60 * 1000));

  const sessionSeed = `${userAgent}:${xForwardedFor}:${referer}:${hourBucket}`;
  const hash = createHash("sha256").update(sessionSeed).digest("hex");

  return `sess_${hash.slice(0, 12)}`;
}

/**
 * Get user ID from request if available
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const header = request.headers.get("X-User-ID");
  if (header) return header;

  const cookie = request.cookies.get("userId")?.value;
  if (cookie) return cookie;

  return null;
}
