import { expect, test } from "@playwright/test";

test("documents page displays form guidance and disclaimer", async ({ page }) => {
  await page.goto("/documents/");

  await expect(page.getByRole("heading", { name: /Documents & Forms/i })).toBeVisible();
  await expect(page.getByText("DV-100")).toBeVisible();
  await expect(page.getByText("DV-109")).toBeVisible();
  await expect(page.getByText("DV-110")).toBeVisible();
  await expect(page.getByText("Nazaya Haven provides legal information, not legal advice")).toBeVisible();
});

test("documents page shows all three legal form cards", async ({ page }) => {
  await page.goto("/documents/");

  // Check DV-100
  await expect(page.getByText("Request for Domestic Violence Restraining Order")).toBeVisible();
  await expect(page.getByText("Start a request for protection from domestic violence.")).toBeVisible();

  // Check DV-109
  await expect(page.getByText("Notice of Court Hearing")).toBeVisible();
  await expect(page.getByText("Tell parties when the court hearing is scheduled.")).toBeVisible();

  // Check DV-110
  await expect(page.getByText("Temporary Restraining Order")).toBeVisible();
  await expect(page.getByText("Temporary orders a judge may sign before the hearing.")).toBeVisible();
});

test("documents page provides links to court resources", async ({ page }) => {
  await page.goto("/documents/");

  const links = page.getByRole("link", { name: /View court source/i });
  await expect(links).toHaveCount(3);
});

test("dashboard card links to documents page", async ({ page }) => {
  await page.goto("/dashboard/");

  await page.getByText("Documents & Forms").first().click();
  await expect(page).toHaveURL(/\/documents\/?$/);
  await expect(page.getByRole("heading", { name: /Documents & Forms/i })).toBeVisible();
});
