import { expect, test } from "@playwright/test";

test("voice intake widget renders with heading and badge on resources page", async ({
  page,
}) => {
  await page.goto("/resources/");

  // The widget should be visible with its heading.
  await expect(
    page.getByRole("heading", { name: /Voice Intake/i })
  ).toBeVisible();

  // Badge should indicate demo or live mode.
  await expect(
    page.getByText(/Demo mic|Deepgram-ready|Microphone unavailable/i)
  ).toBeVisible();
});

test("voice intake widget textarea fallback works in demo mode", async ({
  page,
}) => {
  await page.goto("/resources/");

  // Find the textarea input.
  const textarea = page.locator("textarea");

  // Type some text into the transcript input.
  await textarea.fill("I need help with housing for my family");

  // Verify the text appears.
  await expect(textarea).toHaveValue("I need help with housing for my family");

  // Clear button should be visible.
  await expect(page.getByRole("button", { name: /Clear/i })).toBeVisible();

  // Click clear and verify it's empty.
  await page.getByRole("button", { name: /Clear/i }).click();
  await expect(textarea).toHaveValue("");
});

test("voice intake widget shows demo or privacy notice", async ({ page }) => {
  await page.goto("/resources/");

  // Verify that either the demo notice or privacy notice is present.
  // In static preview mode, we see "Demo mode: type your needs here"
  // In live mode with Speech API support, we see "Transcript is never persisted"
  const demoOrPrivacy = page.locator(
    "text=/Demo mode: type your needs|Transcript is never persisted/i"
  );
  await expect(demoOrPrivacy.first()).toBeVisible();
});
