import { expect, test } from "@playwright/test";

test("dashboard exposes Nazaya AI quick actions", async ({ page }) => {
  await page.goto("/dashboard/");

  await expect(
    page.getByRole("heading", { name: "Nazaya AI" }).first(),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Find resources" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Legal forms" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Grounding support" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Digital parenting" }),
  ).toBeVisible();
});
