import { expect, test } from "@playwright/test";

/**
 * Orkes Workflow API tests: verify the /api/workflow/notify/ endpoint
 */

test("workflow notify route accepts valid payload", async ({ request }) => {
  const response = await request.post("/api/workflow/notify/", {
    data: {
      trigger: "agent-task-ready",
      message: "Test notification",
    },
  });

  expect(response.status()).toBe(202);
  const body = await response.json();
  expect(body.status).toBe("queued");
  expect(body.provider).toBe("orkes");
});

test("workflow notify route validates required fields", async ({ request }) => {
  const response = await request.post("/api/workflow/notify/", {
    data: {
      trigger: "agent-task-ready",
      // Missing message
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBeDefined();
});

test("workflow notify queues stub when Conductor credentials absent", async ({
  request,
}) => {
  const response = await request.post("/api/workflow/notify/", {
    data: {
      trigger: "document-ready",
      message: "Document processing complete",
      documentId: "doc-123",
    },
  });

  expect(response.status()).toBe(202);
  const body = await response.json();
  expect(body.status).toBe("queued");
  expect(body.id).toBeDefined();
});
