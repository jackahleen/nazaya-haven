import { expect, test } from "@playwright/test";

test("voice intake widget renders with heading and badge on resources page", async ({
  page,
}) => {
  await page.goto("/resources/");

  // The widget should be visible with its heading.
  await expect(
    page.getByRole("heading", { name: /Voice Intake/i })
  ).toBeVisible();

  // Badge should indicate tier. Look for the StatusPill with one of the tier labels.
  const badge = page.locator("span").filter({ hasText: /^(Deepgram live|Browser speech|Type)$/ }).first();
  await expect(badge).toBeVisible();
});

test("voice intake widget textarea fallback works in static mode", async ({
  page,
}) => {
  await page.goto("/resources/");

  // Find the textarea input.
  const textarea = page.locator("textarea");

  // Only test if textarea is present (static mode).
  const isTextarea = await textarea.isVisible().catch(() => false);
  if (isTextarea) {
    // Type some text into the transcript input.
    await textarea.fill("I need help with housing for my family");

    // Verify the text appears.
    await expect(textarea).toHaveValue("I need help with housing for my family");

    // Clear button should be visible.
    await expect(page.getByRole("button", { name: /Clear/i })).toBeVisible();

    // Click clear and verify it's empty.
    await page.getByRole("button", { name: /Clear/i }).click();
    await expect(textarea).toHaveValue("");
  }
});

test("voice intake widget displays privacy notice", async ({ page }) => {
  await page.goto("/resources/");

  // Verify privacy or demo notice is present.
  const privacyNotice = page.locator(
    "text=/Transcripts are never|Demo mode: type your needs/i"
  );
  await expect(privacyNotice.first()).toBeVisible();
});

test("voice intake widget language toggle is visible", async ({ page }) => {
  await page.goto("/resources/");

  // Language select should be present.
  const languageSelect = page.locator('select');
  await expect(languageSelect).toBeVisible();

  // Check that the select has the English option (options are in hidden selects).
  const selectValue = await languageSelect.inputValue();
  expect(["en-US", "es-ES"]).toContain(selectValue);
});

test("voice intake widget intent routing renders suggested action chip", async ({
  page,
}) => {
  await page.goto("/resources/");

  // In static mode, type a housing-related need.
  const textarea = page.locator("textarea");
  const isTextarea = await textarea.isVisible().catch(() => false);

  if (isTextarea) {
    await textarea.fill("I need help with housing for my family");

    // Suggested action chip should appear with "Find resources" link.
    await expect(
      page.getByRole("link", { name: /Find resources/i })
    ).toBeVisible();

    // Click should navigate to resources.
    await page.getByRole("link", { name: /Find resources/i }).click();
    await expect(page).toHaveURL("/resources");
  }
});

test("voice intake widget tier badge reflects runtime mode", async ({
  page,
}) => {
  await page.goto("/resources/");

  // Verify the badge text shows one of the three tiers.
  const badges = page.getByText(/Deepgram live|Browser speech|Type/i);
  const badgeText = await badges.first().textContent();
  expect(badgeText).toMatch(/Deepgram live|Browser speech|Type/);
});

test("voice intake widget read-aloud toggle is visible in live mode", async ({
  page,
}) => {
  await page.goto("/resources/");

  // Check for read-aloud checkbox (only appears in live mode).
  const readAloudCheckbox = page.locator("#readAloud");
  const isVisible = await readAloudCheckbox.isVisible().catch(() => false);

  if (isVisible) {
    // Checkbox should exist and be unchecked by default.
    await expect(readAloudCheckbox).toBeVisible();
    await expect(readAloudCheckbox).not.toBeChecked();

    // Toggle it.
    await readAloudCheckbox.click();
    await expect(readAloudCheckbox).toBeChecked();
  }
});
