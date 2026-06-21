import { chromium, expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import {
  createBrowserbaseSession,
  getBrowserbaseCdpUrl,
  isBrowserbaseConfigured,
} from "../../src/lib/browserbase-client";

const previewUrl = process.env.PREVIEW_URL || "http://localhost:3000";

/**
 * Browserbase cloud smoke tests for Nazaya Haven static preview.
 *
 * Runs ONLY in GitHub Actions with BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID present.
 * Tests verify core routes render correctly in headless Chrome via CDP, capturing screenshots.
 * Screenshots are uploaded as CI artifacts for visual regression detection.
 */

test.skip(
  !isBrowserbaseConfigured(),
  "BROWSERBASE_API_KEY is required.",
);

test("home page renders without errors via cloud browser", async () => {
  await withBrowserbasePage(async (page) => {
    await page.goto(`${previewUrl}/`);

    // Core assertions match local Playwright tests
    await expect(page).toHaveTitle(/Nazaya Haven/);
    const heading = page.getByRole("heading", { name: /A Safe Place/i });
    await expect(heading).toBeVisible();

    // Capture screenshot for visual regression
    await captureScreenshot(page, "home-page");
  });
});

test("dashboard page renders with integration readiness info", async () => {
  await withBrowserbasePage(async (page) => {
    await page.goto(`${previewUrl}/dashboard/`);

    // Verify integration readiness cards render
    const browserbaseHeading = page.getByRole("heading", { name: "Browserbase" });
    await expect(browserbaseHeading).toBeVisible();

    const redisHeading = page.getByRole("heading", { name: "Redis" });
    await expect(redisHeading).toBeVisible();

    // Capture screenshot for visual regression
    await captureScreenshot(page, "dashboard-integrations");
  });
});

test("resources page search works in cloud browser", async () => {
  await withBrowserbasePage(async (page) => {
    await page.goto(`${previewUrl}/resources/`);

    // Interact with resource search
    await page.getByRole("button", { name: "Housing" }).click();
    await page.getByLabel("Zip code").fill("94102");
    await page.getByRole("button", { name: "Search" }).click();

    // Verify results render
    const heading = page.getByRole("heading", { name: "Housing" });
    await expect(heading).toBeVisible();

    // Capture screenshot for visual regression
    await captureScreenshot(page, "resources-search-results");
  });
});

async function withBrowserbasePage(
  run: (page: Page) => Promise<void>,
): Promise<void> {
  const sessionId = await createBrowserbaseSession({
    apiKey: process.env.BROWSERBASE_API_KEY ?? "",
    projectId: process.env.BROWSERBASE_PROJECT_ID ?? "",
  });
  const browser = await chromium.connectOverCDP(getBrowserbaseCdpUrl(sessionId));
  const context = await browser.newContext();

  try {
    const page = await context.newPage();
    await run(page);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function captureScreenshot(page: Page, name: string): Promise<void> {
  const screenshotDir = path.join(process.cwd(), "tests/browserbase/screenshots");

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(screenshotDir, `${name}-${timestamp}.png`);

  try {
    await page.screenshot({ path: filename });
    console.log(`Screenshot saved: ${filename}`);
  } catch (error) {
    console.warn(`Failed to capture screenshot ${name}:`, error);
  }
}
