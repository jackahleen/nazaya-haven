import { expect, test } from "@playwright/test";

test("agent dispatch route rejects missing required fields", async ({
  request,
}) => {
  const response = await request.post("/api/agent/dispatch", {
    data: { kind: "resource-routing" },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toContain("Missing required fields");
});

test("agent dispatch route returns queued stub without Agentverse token", async ({
  request,
}) => {
  const response = await request.post("/api/agent/dispatch", {
    data: {
      kind: "resource-routing",
      lane: "resources",
      inputSummary: "Route housing resource",
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe("queued");
  expect(body.provider).toBe("fetch-ai");
  expect(body.id).toContain("dispatch-");
});

test("agent dispatch route generates stable IDs", async ({ request }) => {
  const payload = {
    kind: "resource-routing" as const,
    lane: "resources" as const,
    inputSummary: "Route housing resource",
  };

  const response1 = await request.post("/api/agent/dispatch", {
    data: payload,
  });

  const response2 = await request.post("/api/agent/dispatch", {
    data: payload,
  });

  const body1 = await response1.json();
  const body2 = await response2.json();

  expect(body1.id).toBe(body2.id);
  expect(body1.id).toMatch(/^dispatch-[a-f0-9]{12}$/);
});

test("resources page shows handoff button on resource cards", async ({ page }) => {
  // Navigate to resources page
  await page.goto("/resources/");

  // Search for a resource (use static mode fallback)
  await page.getByLabel("Housing").click();
  await page.getByLabel("Zip code").fill("90210");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for demo results to appear
  await expect(page.getByText(/Housing/i)).toBeVisible();

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
  await page.getByLabel("Housing").click();
  await page.getByLabel("Zip code").fill("90210");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for demo results
  await expect(page.getByText(/Housing/i)).toBeVisible();

  // Click handoff button
  await page.getByRole("button", { name: /Hand this to a routing agent/i }).first().click();

  // Should show demo dispatch result even if API is unavailable
  await expect(page.getByText(/Demo dispatch/i)).toBeVisible();
  await expect(page.getByText(/dispatch-/)).toBeVisible();
  await expect(page.getByText(/Demo dispatch — live mode needs/)).toBeVisible();
});
