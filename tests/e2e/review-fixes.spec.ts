import { expect, test } from "@playwright/test";

test("static routes do not show user-facing alert text by default", async ({
  page,
}) => {
  for (const route of ["/", "/dashboard/", "/resources/", "/login/", "/legal/"]) {
    await page.goto(route);
    const alertTexts = await page.getByRole("alert").allTextContents();

    expect(alertTexts.map((text) => text.trim()).filter(Boolean)).toEqual([]);
  }
});

test("login is labeled as demo entry and has no signup loop", async ({ page }) => {
  await page.goto("/login/");

  await expect(page.getByRole("heading", { name: "Demo access" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter demo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create an account" })).toHaveCount(0);
});

test("dashboard account link targets the signed-in account summary", async ({
  page,
}) => {
  await page.goto("/dashboard/");

  await expect(page.getByRole("link", { name: "Account" })).toHaveAttribute(
    "href",
    "/dashboard/#account",
  );
});
