import { expect, test } from "@playwright/test";

test("dashboard includes digital parenting literacy and guided adult support", async ({
  page,
}) => {
  await page.goto("/dashboard/");

  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Digital Parenting Literacy",
    }),
  ).toBeVisible();
  await expect(page.getByText("Internet access routines")).toBeVisible();
  await expect(page.getByText("Platform literacy")).toBeVisible();
  await expect(page.getByText("Caregiver habit check-in")).toBeVisible();
  await expect(page.getByText("Guided navigation queue")).toBeVisible();
  await expect(page.getByText("Agent-S guided walkthrough")).toBeVisible();
  await expect(
    page.getByText("Notification handoffs for agent work"),
  ).toBeVisible();
});
