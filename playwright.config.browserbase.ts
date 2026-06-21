import { defineConfig, devices } from "@playwright/test";

/**
 * Browserbase cloud browser configuration for Playwright.
 *
 * Usage: npx playwright test --config=playwright.config.browserbase.ts
 *
 * Requires environment variables:
 * - BROWSERBASE_API_KEY: Browserbase API key
 * - BROWSERBASE_PROJECT_ID: Browserbase project ID
 * - PREVIEW_URL: Preview deployment URL (e.g., https://user.github.io/repo)
 */

const previewUrl = process.env.PREVIEW_URL;
const localPreviewUrl = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "tests/browserbase",
  testMatch: "**/*.spec.ts",

  fullyParallel: false, // Browserbase free tier supports 3 concurrent browsers
  forbidOnly: process.env.CI ? true : false,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 1,

  reporter: [
    ["html", { outputFolder: "playwright-report/browserbase" }],
    ["json", { outputFile: "test-results/browserbase/results.json" }],
    ["list"],
  ],

  use: {
    baseURL: previewUrl || localPreviewUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium-cloud",
      use: {
        ...devices["Desktop Chrome"],
        // Note: Connection handled by Browserbase SDK in smoke.spec.ts
        // This config is kept for local development reference
      },
    },
  ],

  webServer: previewUrl
    ? undefined
    : {
        command: "npm run serve:static",
        url: localPreviewUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },

  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  globalTimeout: 600000,
});
