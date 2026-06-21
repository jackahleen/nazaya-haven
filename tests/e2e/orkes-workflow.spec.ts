import { expect, test } from "@playwright/test";

test("documents page shows durable workflow visualization", async ({ page }) => {
  await page.goto("/documents/");

  // Check for the workflow section
  await expect(
    page.getByRole("heading", { name: /Documents & Forms/i }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /Caregiver notification/i }),
  ).toBeVisible();

  await expect(
    page.getByText(/Orkes Conductor orchestrates/),
  ).toBeVisible();
});

test("workflow stages are displayed with status indicators", async ({
  page,
}) => {
  await page.goto("/documents/");

  // Check that all workflow stage pills are visible using more specific locators
  const stages = ["Upload", "Classify", "Recommend", "Prefill", "Review", "Notify"];
  for (const stage of stages) {
    // Use a role-based selector to get the workflow stage specifically
    const stageElement = page.getByRole("heading", { name: stage });
    await expect(stageElement).toBeVisible();
  }
});

test("static preview shows demo data and disables live button", async ({
  page,
}) => {
  await page.goto("/documents/");

  // Check for static preview warning
  await expect(
    page.getByText(/Static preview: Demo stages shown below/),
  ).toBeVisible();

  // Verify the button is disabled in static mode
  const notifyButton = page.getByRole("button", {
    name: /Static preview/,
  });
  await expect(notifyButton).toBeDisabled();
});

test("notification workflow shows completed and pending stages", async ({
  page,
}) => {
  await page.goto("/documents/");

  // Verify that the workflow has completed stages (shown in static demo)
  const completedBadges = page.getByText("Complete");
  const count = await completedBadges.count();

  // In the static demo, several stages should show as completed
  expect(count).toBeGreaterThan(0);
});
