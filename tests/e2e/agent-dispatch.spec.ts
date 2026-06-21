import { expect, test } from "@playwright/test";

test("resources page shows handoff button on resource cards", async ({ page }) => {
  // Navigate to resources page
  await page.goto("/resources/");

  // Search for a resource (use static mode fallback)
  await page.getByRole("button", { name: "Housing" }).click();
  await page.getByLabel("Zip code").fill("90210");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for demo results to appear
  await expect(page.getByRole("heading", { name: "Housing" })).toBeVisible();

  // Check that at least one resource card has the handoff button
  const handoffButtons = page.getByRole("button", {
    name: /Hand this to a routing agent/i,
  });
  await expect(handoffButtons.first()).toBeVisible();
});

test("resource handoff button handles API 404 gracefully", async ({ page }) => {
  // Navigate to resources page
  await page.goto("/resources/");

  // Search for a resource
  await page.getByRole("button", { name: "Housing" }).click();
  await page.getByLabel("Zip code").fill("90210");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for demo results
  await expect(page.getByRole("heading", { name: "Housing" })).toBeVisible();

  // Click handoff button
  await page.getByRole("button", { name: /Hand this to a routing agent/i }).first().click();

  // Should show demo dispatch result even if API is unavailable
  await expect(page.getByText("Demo Dispatch", { exact: true })).toBeVisible();
  await expect(page.getByText(/dispatch-/)).toBeVisible();
  await expect(page.getByText(/Demo dispatch — live mode needs/)).toBeVisible();
});
