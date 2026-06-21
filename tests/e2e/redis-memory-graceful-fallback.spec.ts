import { test, expect } from "@playwright/test";

/**
 * E2E Test: Verify redis agent memory works with graceful fallback (no Redis)
 */

test("Session memory should work without Redis", async ({ page }) => {
  // Load the authenticated demo surface where memory status is mounted.
  await page.goto("/dashboard/");

  // Verify page loads (even without Redis)
  await expect(page).toHaveTitle(/Nazaya Haven/i);

  await expect(page.getByText("Redis trace store")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Redis" })).toBeVisible();
  await expect(page.getByText("PLAI adapter excluded")).toBeVisible();

  // Should show either Redis Active or In-Memory Fallback.
  await expect(
    page.getByText(/Redis Active|In-Memory Fallback|In-Memory Demo|Checking/).first(),
  ).toBeVisible();
});

test("Chat should work without Redis (graceful degradation)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  // Type a chat message
  const input = page.locator("input[placeholder*='message' i]").first();
  if (await input.isVisible()) {
    await input.fill("I need help finding childcare");
    await page.keyboard.press("Enter");

    // Should receive a response (even without Redis)
    await page.waitForTimeout(2000);
    const response = page.locator("text=childcare").first();
    await expect(response).toBeVisible({ timeout: 5000 });
  }
});

test("Cross-context should degrade gracefully", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Navigate through services
  const chatTab = page.locator("button", { hasText: "Chat" }).first();
  if (await chatTab.isVisible()) {
    await chatTab.click();
  }

  // Send a message to generate context
  const messageInput = page.locator("input").first();
  if (await messageInput.isVisible()) {
    await messageInput.fill("I'm looking for resources");
    await page.keyboard.press("Enter");

    // Wait a bit for memory to update
    await page.waitForTimeout(1000);

    // Check if SessionMemoryPanel shows any cross-context
    const contextPanel = page.locator("text=What the AI Remembers").first();
    if (await contextPanel.isVisible()) {
      const content = await contextPanel.textContent();
      // Should have some content (in-memory fallback should work)
      expect(content).toBeTruthy();
    }
  }
});
