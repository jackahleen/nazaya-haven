import { expect, test } from "@playwright/test";

/**
 * Free-source cache tests: verify that resources can be fetched without API keys
 * and that caching works correctly.
 */

test("curated free source returns results for housing without any API", async ({
  request,
}) => {
  const response = await request.post("/api/resources", {
    data: {
      zip: "94103",
      categories: ["housing"],
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  // Should have housing results from curated source
  expect(body.housing).toBeDefined();
  expect(Array.isArray(body.housing)).toBe(true);
  expect(body.housing.length).toBeGreaterThan(0);

  // First result should have expected shape
  const first = body.housing[0];
  expect(first.name).toBeDefined();
  expect(first.name).not.toBe("");

  // Response should indicate cache/free source (not Claude)
  const source = response.headers()["x-nazaya-source"];
  expect(["cache", "free"]).toContain(source);
});

test("multiple categories work together from free sources", async ({ request }) => {
  const response = await request.post("/api/resources", {
    data: {
      zip: "94107",
      categories: ["housing", "food", "health"],
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  // All requested categories should be present
  expect(body.housing).toBeDefined();
  expect(body.food).toBeDefined();
  expect(body.health).toBeDefined();

  // Should have results for at least some categories
  const totalResults =
    (body.housing?.length || 0) +
    (body.food?.length || 0) +
    (body.health?.length || 0);
  expect(totalResults).toBeGreaterThan(0);
});

test("invalid zip code is rejected", async ({ request }) => {
  const response = await request.post("/api/resources", {
    data: {
      zip: "12",
      categories: ["housing"],
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBeDefined();
});

test("empty categories array is rejected", async ({ request }) => {
  const response = await request.post("/api/resources", {
    data: {
      zip: "94103",
      categories: [],
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBeDefined();
});

test("response includes national resources", async ({ request }) => {
  const response = await request.post("/api/resources", {
    data: {
      zip: "94103",
      categories: ["community"],
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  // National resources should be populated (e.g., 211)
  expect(body.national).toBeDefined();
});

test("all categories are valid", async ({ request }) => {
  const allCategories = ["housing", "food", "family", "health", "community"];

  for (const category of allCategories) {
    const response = await request.post("/api/resources", {
      data: {
        zip: "94103",
        categories: [category],
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body[category as keyof typeof body]).toBeDefined();
  }
});
