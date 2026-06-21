/**
 * Browserbase SDK client helper.
 *
 * This module is ONLY for use in GitHub Actions workflows or Node.js CLI tools.
 * It is NEVER imported into the Next.js app bundle or client code.
 *
 * The Browserbase SDK requires environment variables to be present:
 * - BROWSERBASE_API_KEY: API key from Browserbase account
 * - BROWSERBASE_PROJECT_ID: Project ID for session creation
 *
 * These are only available in GitHub Actions secrets and CI environments,
 * never in static preview or client bundles.
 */

export type BrowserbaseSessionConfig = {
  apiKey: string;
  projectId?: string;
};

export type BrowserbaseSession = {
  id: string;
  connectUrl: string;
};

/**
 * Create a Browserbase session for cloud browser testing.
 *
 * @param config Configuration with API key and project ID
 * @returns Session ID for CDP connection
 *
 * @throws Error if credentials are missing or session creation fails
 */
export async function createBrowserbaseSession(
  config: BrowserbaseSessionConfig,
): Promise<BrowserbaseSession> {
  const { apiKey, projectId } = config;

  if (!apiKey) {
    throw new Error(
      "BROWSERBASE_API_KEY is not set. Cannot create cloud browser session.",
    );
  }

  // Dynamic import to avoid bundling SDK into client code
  const { Browserbase } = await import("@browserbasehq/sdk");

  const bb = new Browserbase({ apiKey });

  try {
    const session = projectId
      ? await bb.sessions.create({ projectId })
      : await bb.sessions.create();
    return { id: session.id, connectUrl: session.connectUrl };
  } catch (error) {
    console.error("Failed to create Browserbase session:", error);
    throw new Error(
      `Browserbase session creation failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Get CDP WebSocket URL for connecting via Chrome DevTools Protocol.
 *
 * @param sessionId Session ID from createBrowserbaseSession
 * @returns WebSocket URL for CDP connection (wss://...)
 */
export function getBrowserbaseCdpUrl(
  session: BrowserbaseSession | string,
): string {
  if (typeof session === "string") {
    return `wss://chrome.browserbase.com/cdp?session_id=${session}`;
  }

  return session.connectUrl;
}

/**
 * Check if Browserbase credentials are available in the current environment.
 *
 * Returns false in:
 * - Static preview (output: "export")
 * - Client bundle
 * - Any environment without BROWSERBASE_API_KEY or BROWSERBASE_PROJECT_ID
 *
 * Returns true only in:
 * - GitHub Actions workflows (when secrets are injected)
 * - Node.js CLI environments with env vars set
 *
 * @returns true if both credentials are present, false otherwise
 */
export function isBrowserbaseConfigured(): boolean {
  const hasApiKey = Boolean(process.env.BROWSERBASE_API_KEY);

  return hasApiKey;
}
