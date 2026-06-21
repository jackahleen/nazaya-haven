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

  await expect(page.getByText("Signed in as")).toBeVisible();
  await expect(page.getByText("Demo Caregiver")).toBeVisible();
  await expect(page.getByText("Authenticated preview")).toBeVisible();
  await expect(page.getByText("Kinship caregiver preview")).toBeVisible();
  await expect(page.getByText("3 guided tasks queued")).toBeVisible();
  await expect(page.getByText("Redis trace store")).toBeVisible();
  await expect(page.getByText("Agent-S tutorial queued")).toBeVisible();
  await expect(page.getByText("Community Feed")).toBeVisible();
  await expect(page.getByText("Support Groups")).toBeVisible();
  await expect(page.getByText("Resources Near You")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nazaya AI" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Digital Parenting Guide" }),
  ).toBeVisible();
  await expect(page.getByText("Show me around Nazaya Haven")).toBeVisible();
  await expect(page.getByText("Agent-S guided walkthrough")).toBeVisible();
  await expect(page.getByText("Notify caregiver when ready")).toBeVisible();
  await expect(page.getByText("Integration Readiness")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Simular Agent-S" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Browserbase" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sentry" })).toBeVisible();
  await expect(page.getByText("PLAI adapter queued").first()).toBeVisible();
});

test("resources page returns static preview results without an API server", async ({
  page,
}) => {
  await page.goto("/resources/");

  await page.getByRole("button", { name: "Housing" }).click();
  await page.getByLabel("Zip code").fill("94102");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByRole("heading", { name: "Housing" })).toBeVisible();
  await expect(page.getByText("Compass Family Services")).toBeVisible();
  await expect(page.getByText("Static preview result: using")).toBeVisible();
});

test("core routes use the consolidated Nazaya shell", async ({ page }) => {
  for (const route of ["/dashboard/", "/resources/", "/legal/"]) {
    await page.goto(route);

    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator(".bg-white")).toHaveCount(0);
  }
});

test("integration readiness surfaces Redis as app infrastructure", async ({
  page,
}) => {
  await page.goto("/dashboard/");

  await expect(page.getByRole("heading", { name: "Redis" })).toBeVisible();
  await expect(page.getByText("Direct app consumer").last()).toBeVisible();
  await expect(page.getByText("PLAI adapter excluded")).toBeVisible();
});
