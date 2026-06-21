import { expect, test } from "@playwright/test";

test("static resources search uses demo data without calling the API route", async ({
  page,
}) => {
  let apiCalls = 0;
  await page.route("**/api/resources", async (route) => {
    apiCalls += 1;
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "API should not be called in static mode" }),
    });
  });

  await page.goto("/resources/");
  await page.getByRole("button", { name: "Housing" }).click();
  await page.getByLabel("Zip code").fill("94102");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Demo mode").first()).toBeVisible();
  await expect(page.getByText("Compass Family Services")).toBeVisible();
  expect(apiCalls).toBe(0);
});

test("static Nazaya chat returns a demo response without calling the API route", async ({
  page,
}) => {
  let apiCalls = 0;
  await page.route("**/api/chat", async (route) => {
    apiCalls += 1;
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "API should not be called in static mode" }),
    });
  });

  await page.goto("/dashboard/");
  await page
    .getByLabel("Ask Nazaya AI")
    .fill("Help me find family support resources near 94102.");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Demo mode").first()).toBeVisible();
  await expect(page.getByText(/family support/i).last()).toBeVisible();
  await expect(page.getByText(/hosted Nazaya runtime/i).first()).toBeVisible();
  expect(apiCalls).toBe(0);
});
