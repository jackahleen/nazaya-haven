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

test("agent status route returns deterministic progression", async ({
  request,
}) => {
  // Dispatch once to get ID
  const dispatchRes = await request.post("/api/agent/dispatch", {
    data: {
      kind: "resource-routing",
      lane: "resources",
      inputSummary: "Test routing",
    },
  });

  const dispatchBody = await dispatchRes.json();
  const dispatchId = dispatchBody.id;

  // Poll status with increasing pollCount; should see progression
  const poll0 = await request.get(
    `/api/agent/dispatch?id=${dispatchId}&pollCount=0&kind=resource-routing&lane=resources`
  );
  const body0 = await poll0.json();
  expect(body0.status).toBe("queued");
  expect(body0.handoffChain).toBeDefined();
  expect(body0.handoffChain.length).toBeGreaterThan(0);

  const poll2 = await request.get(
    `/api/agent/dispatch?id=${dispatchId}&pollCount=2&kind=resource-routing&lane=resources`
  );
  const body2 = await poll2.json();
  expect(body2.status).toBe("running");

  const poll5 = await request.get(
    `/api/agent/dispatch?id=${dispatchId}&pollCount=5&kind=resource-routing&lane=resources`
  );
  const body5 = await poll5.json();
  expect(body5.status).toBe("completed");
  expect(body5.artifactRefs.length).toBeGreaterThan(0);
});

test("agent status route generates lane-specific summaries", async ({
  request,
}) => {
  const testCases: Array<{
    kind: string;
    lane: string;
    expectedSummarySubstring: string;
  }> = [
    {
      kind: "resource-routing",
      lane: "resources",
      expectedSummarySubstring: "routing",
    },
    {
      kind: "form-recommendation",
      lane: "documents",
      expectedSummarySubstring: "Document",
    },
    {
      kind: "form-fill",
      lane: "chat",
      expectedSummarySubstring: "context",
    },
  ];

  for (const testCase of testCases) {
    const response = await request.get(
      `/api/agent/dispatch?` +
        new URLSearchParams({
          id: `test-id-${testCase.lane}`,
          pollCount: "5",
          kind: testCase.kind,
          lane: testCase.lane,
        })
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.outputSummary.toLowerCase()).toContain(
      testCase.expectedSummarySubstring.toLowerCase()
    );
  }
});

test("agent dispatch respects consentToPersistTrace flag", async ({
  request,
}) => {
  const payload = {
    kind: "resource-routing" as const,
    lane: "resources" as const,
    inputSummary: "Test with consent",
    consentToPersistTrace: true,
  };

  const response = await request.post("/api/agent/dispatch", {
    data: payload,
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  // Request was created with consent flag; response should include the ID
  expect(body.id).toBeDefined();
  expect(body.status).toBe("queued");
});

test("agent status route validates kind and lane parameters", async ({
  request,
}) => {
  const response = await request.get(
    `/api/agent/dispatch?id=test-id&kind=invalid-kind&lane=invalid-lane`
  );

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toContain("Invalid");
});

test("mock agent generates artifacts on completion", async ({ request }) => {
  const response = await request.get(
    `/api/agent/dispatch?` +
      new URLSearchParams({
        id: "test-artifacts",
        pollCount: "10",
        kind: "resource-routing",
        lane: "resources",
      })
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe("completed");
  expect(body.artifactRefs).toBeInstanceOf(Array);
  expect(body.artifactRefs.length).toBeGreaterThan(0);
  // Verify artifact structure (e.g., "program:housing-001")
  expect(body.artifactRefs[0]).toMatch(/^[a-z-]+:/);
});
