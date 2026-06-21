import { expect, test } from "@playwright/test";

test("resources lane supports insurance and booking signals", async ({ page }) => {
  await page.goto("/resources/");

  await expect(page.getByText("Insurance path")).toBeVisible();
  await expect(page.getByText("Free or sliding-scale path")).toBeVisible();
  await page.getByRole("button", { name: "Mental & Physical Health" }).click();
  await page.getByLabel("Zip code").fill("94102");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText(/booking/i).first()).toBeVisible();
});
