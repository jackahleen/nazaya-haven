import { test, expect } from "@playwright/test";

test("legal page renders with heading and disclaimer", async ({ page }) => {
  await page.goto("/legal/");

  // Check for page heading
  await expect(page.getByRole("heading", { name: /Legal Navigation/i })).toBeVisible();

  // Check for legal disclaimer - use more specific text
  await expect(
    page.locator("section").filter({ hasText: /Important.*Nazaya Haven provides general information/ }).first()
  ).toBeVisible();
});

test("legal page filtering surfaces results from rich dataset", async ({ page }) => {
  await page.goto("/legal/");

  // Fill in a zip code from the rich dataset (San Francisco)
  await page.getByLabel(/Your ZIP Code/i).fill("94102");

  // Wait for county detection
  await expect(page.getByText(/San Francisco County/i)).toBeVisible();

  // Select all resources first
  await page.getByLabel(/Browse all resources/i).click();

  // Submit search
  await page.getByRole("button", { name: /Search Resources/i }).click();

  // Should show resources from the rich dataset
  // Bay Area Legal Aid is in the dataset and serves San Francisco
  await expect(
    page.getByText(/Bay Area Legal Aid/, { exact: false })
  ).toBeVisible();
});

test("legal page emergency hotlines section is visible", async ({ page }) => {
  await page.goto("/legal/");

  // Check for emergency support section
  await expect(page.getByRole("heading", { name: /Emergency Support/i })).toBeVisible();

  // Check for specific hotlines
  await expect(page.getByText(/National DV Hotline/i)).toBeVisible();
  await expect(page.getByText(/988 Crisis Line/i)).toBeVisible();
});
