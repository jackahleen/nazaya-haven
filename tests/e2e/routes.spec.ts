import { expect, test } from "@playwright/test";

test("home page presents the Ddoski's World support story", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Nazaya Haven/);
  await expect(page.getByRole("heading", { name: /A Safe Place/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get Started/i }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Explore Resources/i }).first(),
  ).toBeVisible();
});

test("login page can route into the dashboard mock", async ({ page }) => {
  await page.goto("/login/");

  await page.getByLabel("Email").fill("caregiver@example.org");
  await page.getByLabel("Password").fill("demo-password");
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard\/?$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("dashboard exposes the core support areas", async ({ page }) => {
  await page.goto("/dashboard/");

  await expect(page.getByText("Community Feed")).toBeVisible();
  await expect(page.getByText("Support Groups")).toBeVisible();
  await expect(page.getByText("Resources Near You")).toBeVisible();
  await expect(page.getByText("Nazaya AI")).toBeVisible();
  await expect(page.getByText("Digital Parenting Guide")).toBeVisible();
  await expect(page.getByText("Show me around Nazaya Haven")).toBeVisible();
  await expect(page.getByText("Agent-S guided walkthrough")).toBeVisible();
  await expect(page.getByText("Notify caregiver when ready")).toBeVisible();
});
