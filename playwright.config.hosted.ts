import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.HOSTED_TEST_PORT ?? 3001);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/hosted",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build:hosted && npm run start:hosted",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
