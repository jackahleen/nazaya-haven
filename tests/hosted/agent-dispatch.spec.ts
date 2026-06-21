import { expect, test } from "@playwright/test";

test("agent dispatch route rejects missing required fields", async ({
  request,
}) => {
  const response = await request.post("/api/agent/dispatch/", {
    data: { kind: "resource-routing" },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toContain("Missing required fields");
});

test("agent dispatch route returns queued stub without Agentverse token", async ({
  request,
}) => {
  const response = await request.post("/api/agent/dispatch/", {
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

  const response1 = await request.post("/api/agent/dispatch/", {
    data: payload,
  });

  const response2 = await request.post("/api/agent/dispatch/", {
    data: payload,
  });

  const body1 = await response1.json();
  const body2 = await response2.json();

  expect(body1.id).toBe(body2.id);
  expect(body1.id).toMatch(/^dispatch-[a-f0-9]{12}$/);
});

test("agent status route returns deterministic progression", async ({
  request,
}) => {
  // Dispatch once to get ID
  const dispatchRes = await request.post("/api/agent/dispatch/", {
    data: {
      kind: "resource-routing",
      lane: "resources",
      inputSummary: "Test routing",
    },
  });

  const dispatchBody = await dispatchRes.json();
  const dispatchId = dispatchBody.id;

  const statusUrl = (pollCount: number) =>
    `/api/agent/dispatch/?` +
    new URLSearchParams({
      id: dispatchId,
      pollCount: String(pollCount),
      kind: "resource-routing",
      lane: "resources",
    });

  // Poll status with increasing pollCount; hash-derived variance is stable.
  const poll0 = await request.get(statusUrl(0));
  const body0 = await poll0.json();
  expect(body0.status).toBe("queued");
  expect(body0.handoffChain).toBeDefined();
  expect(body0.handoffChain.length).toBeGreaterThan(0);

  const poll0Repeat = await request.get(statusUrl(0));
  const body0Repeat = await poll0Repeat.json();
  expect(body0Repeat).toEqual(body0);

  const poll2 = await request.get(statusUrl(2));
  const body2 = await poll2.json();
  expect(["queued", "running"]).toContain(body2.status);

  const poll6 = await request.get(statusUrl(6));
  const body6 = await poll6.json();
  expect(body6.status).toBe("completed");
  expect(body6.artifactRefs.length).toBeGreaterThan(0);
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
      expectedSummarySubstring: "rout",
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
      `/api/agent/dispatch/?` +
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

  const response = await request.post("/api/agent/dispatch/", {
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
    `/api/agent/dispatch/?id=test-id&kind=invalid-kind&lane=invalid-lane`
  );

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toContain("Invalid");
});

test("mock agent generates artifacts on completion", async ({ request }) => {
  const response = await request.get(
    `/api/agent/dispatch/?` +
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
