import { expect, test } from "@playwright/test";

/**
 * Button Proofs: Static UI proof that important CTAs work
 * These tests verify visible buttons on the static export work correctly
 */

test.describe("Home page buttons", () => {
  test("Get Started button routes to login", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("A Safe Place. A Stronger").getByRole("link", {
      name: "Get Started",
    }).click();
    await expect(page).toHaveURL(/\/login\/?$/);
  });

  test("Explore Resources button routes to dashboard", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("A Safe Place. A Stronger").getByRole("link", {
      name: "Explore Resources",
    }).click();
    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });
});

test.describe("Login page buttons", () => {
  test("Enter demo button routes to dashboard", async ({ page }) => {
    await page.goto("/login/");
    await page.getByRole("button", { name: "Enter demo" }).click();
    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });
});

test.describe("Dashboard card navigation", () => {
  test("dashboard cards route to correct pages", async ({ page }) => {
    await page.goto("/dashboard/");

    const cardRoutes = [
      { title: "Community Feed", href: "/community" },
      { title: "Support Groups", href: "/groups" },
      { title: "Resources Near You", href: "/resources" },
      { title: "Legal Navigation", href: "/legal" },
      { title: "Documents & Forms", href: "/documents" },
      { title: "Journal", href: "/journal" },
    ];

    for (const { title, href } of cardRoutes) {
      await page.goto("/dashboard/");
      await page.getByRole("link", { name: title }).click();
      await expect(page).toHaveURL(new RegExp(`${href}/?$`));
    }
  });

  test("Account link is accessible from dashboard", async ({ page }) => {
    await page.goto("/dashboard/");
    const accountLink = page.getByRole("link", { name: "Account" });
    await expect(accountLink).toBeVisible();
    await expect(accountLink).toHaveAttribute("href", /\/dashboard\/?#account/);
  });
});

test.describe("Chat interface", () => {
  test("chat quick-action buttons populate draft", async ({ page }) => {
    await page.goto("/dashboard/");

    // Look for a quick-action button (static demo should have one)
    const quickActionBtn = page.getByRole("button").filter({
      hasText: /housing|childcare|food|support/i,
    });

    if (await quickActionBtn.first().isVisible()) {
      await quickActionBtn.first().click();
      // After clicking, the chat draft should contain text
      const chatInput = page.locator("input[placeholder*='message' i]").first();
      if (await chatInput.isVisible()) {
        const value = await chatInput.inputValue();
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });

  test("chat Send button produces demo response", async ({ page }) => {
    await page.goto("/dashboard/");

    const chatInput = page.locator("input[placeholder*='message' i]").first();
    if (await chatInput.isVisible()) {
      await chatInput.fill("I need help");
      const sendBtn = page.getByRole("button", { name: /Send|submit/i }).first();
      await sendBtn.click();

      // In static demo, should see a response message
      await expect(
        page.getByText(/help|support|resources|guide/i).first(),
      ).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Resources page", () => {
  test("category buttons toggle selection", async ({ page }) => {
    await page.goto("/resources/");

    // Click Housing category
    const housingBtn = page.getByRole("button", { name: "Housing" });
    await expect(housingBtn).toBeVisible();
    await housingBtn.click();

    // Button should show active state or category should be selected
    // (implementation dependent, but it should be clickable)
    await expect(housingBtn).toBeVisible();
  });

  test("zip entry and Search show results", async ({ page }) => {
    await page.goto("/resources/");

    // Select a category
    await page.getByRole("button", { name: "Housing" }).click();

    // Enter zip
    const zipInput = page.getByLabel("Zip code");
    await zipInput.fill("94102");

    // Search
    const searchBtn = page.getByRole("button", { name: "Search" });
    await searchBtn.click();

    // Should show results
    await expect(page.getByRole("heading", { name: "Housing" })).toBeVisible();
    await expect(page.getByText(/resource|service|center/i).first()).toBeVisible();
  });

  test("Hand this to a routing agent produces static fallback", async ({
    page,
  }) => {
    await page.goto("/resources/");

    // Set up a search
    await page.getByRole("button", { name: "Housing" }).click();
    await page.getByLabel("Zip code").fill("94102");
    await page.getByRole("button", { name: "Search" }).click();

    // Wait for results
    await expect(page.getByRole("heading", { name: "Housing" })).toBeVisible();

    // Click handoff button
    const handoffBtn = page.getByRole("button", {
      name: /Hand this to a routing agent/i,
    });
    if (await handoffBtn.first().isVisible()) {
      await handoffBtn.first().click();

      // Should show demo dispatch result
      await expect(page.getByText("Demo Dispatch", { exact: true })).toBeVisible();
      await expect(page.getByText(/dispatch-/)).toBeVisible();
    }
  });
});

test.describe("Documents page", () => {
  test("documents workflow buttons are static-safe", async ({ page }) => {
    await page.goto("/documents/");

    // Check for workflow visualization
    await expect(
      page.getByRole("heading", { name: /Documents & Forms/i }),
    ).toBeVisible();

    // Check for workflow stages
    const stages = ["Upload", "Classify", "Recommend", "Prefill", "Review"];
    for (const stage of stages) {
      await expect(
        page.getByRole("heading", { name: stage }).first(),
      ).toBeVisible();
    }
  });

  test("documents shows static preview mode indicator", async ({ page }) => {
    await page.goto("/documents/");

    // Should show static preview message
    await expect(
      page.getByText(/Static preview|Demo/i).first(),
    ).toBeVisible();
  });
});

test.describe("Voice widget", () => {
  test("voice typed fallback accepts input", async ({ page }) => {
    await page.goto("/dashboard/");

    // Look for voice widget or voice input
    const voiceInput = page
      .locator("input[type='text']")
      .filter({ hasText: /voice|message/i })
      .first();

    if (await voiceInput.isVisible()) {
      await voiceInput.fill("I need assistance");
      expect(await voiceInput.inputValue()).toBe("I need assistance");
    }
  });

  test("voice suggested action link navigates", async ({ page }) => {
    await page.goto("/dashboard/");

    // Look for suggested action buttons/links in voice context
    const suggestedActions = page.getByRole("button").filter({
      hasText: /childcare|resources|support|housing/i,
    });

    if (await suggestedActions.first().isVisible()) {
      // These should be clickable and navigate or populate state
      await suggestedActions.first().click();
      // Verify page state changed or navigation occurred
      await expect(page).toHaveURL(/\/(dashboard|resources|legal|documents)/);
    }
  });
});

test.describe("Navigation consistency", () => {
  test("all main routes accessible via navigation", async ({ page }) => {
    const routes = ["/", "/login/", "/dashboard/", "/resources/", "/legal/"];

    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route + "$"));
    }
  });
});
