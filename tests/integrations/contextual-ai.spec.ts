import { expect, test } from "@playwright/test";
import { rerankResources } from "../../src/integrations/contextual-ai/client";

/**
 * Unit tests for Contextual AI reranking integration.
 * Verifies graceful degradation when CONTEXTUAL_API_KEY is absent.
 */

test("rerankResources returns identity pass-through when API key is missing", async () => {
  // Clear the environment variable if it exists
  const originalKey = process.env.CONTEXTUAL_API_KEY;
  delete process.env.CONTEXTUAL_API_KEY;

  const mockResources = [
    {
      name: "Resource A",
      description: "First resource",
      phone: "555-0001",
      website: "https://example.com/a",
      address: "123 Main St",
    },
    {
      name: "Resource B",
      description: "Second resource",
      phone: "555-0002",
      website: "https://example.com/b",
      address: "456 Oak Ave",
    },
    {
      name: "Resource C",
      description: "Third resource",
      phone: "555-0003",
      website: "https://example.com/c",
      address: "789 Pine Rd",
    },
  ];

  const result = await rerankResources(
    mockResources,
    "housing assistance",
  );

  // Should return the same order (identity pass-through)
  expect(result).toEqual(mockResources);
  expect(result[0].name).toBe("Resource A");
  expect(result[1].name).toBe("Resource B");
  expect(result[2].name).toBe("Resource C");

  // Restore original value
  if (originalKey) {
    process.env.CONTEXTUAL_API_KEY = originalKey;
  }
});

test("rerankResources handles empty resource list", async () => {
  // Clear the environment variable
  const originalKey = process.env.CONTEXTUAL_API_KEY;
  delete process.env.CONTEXTUAL_API_KEY;

  const result = await rerankResources([], "any query");

  // Should return empty array
  expect(result).toEqual([]);

  // Restore original value
  if (originalKey) {
    process.env.CONTEXTUAL_API_KEY = originalKey;
  }
});

test("rerankResources gracefully handles API errors when key is set", async () => {
  // This test verifies error handling when API key exists but API fails
  // Since we can't easily mock fetch in the integration, we'll test the
  // behavior by checking that the function doesn't throw

  const mockResources = [
    {
      name: "Resource A",
      description: "First resource",
      phone: "555-0001",
      website: "https://example.com/a",
      address: "123 Main St",
    },
  ];

  // Even with a key, if the API fails, we should gracefully fall back
  // to returning the original resources
  process.env.CONTEXTUAL_API_KEY = "invalid-key-for-testing";

  const result = await rerankResources(
    mockResources,
    "housing assistance",
  );

  // Should still return resources (either reranked or original on error)
  expect(result).toHaveLength(1);
  expect(result[0]).toHaveProperty("name");
  expect(result[0]).toHaveProperty("description");

  // Clean up
  delete process.env.CONTEXTUAL_API_KEY;
});
