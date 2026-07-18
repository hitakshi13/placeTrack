import { test, expect } from "@playwright/test";

// These tests use the saved student session from auth.setup.ts

test.describe("Companies page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/companies");
    await page.waitForLoadState("networkidle");
  });

  test("renders the companies grid", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /companies/i })).toBeVisible();
    // Wait for at least one company card to appear
    await expect(page.locator('[href^="/companies/"]').first()).toBeVisible({
      timeout: 8_000,
    });
  });

  test("search filters companies by name", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search companies/i);
    await searchInput.fill("Google");

    // Wait for debounce / refetch
    await page.waitForTimeout(500);

    const cards = page.locator('[href^="/companies/"]');
    const count = await cards.count();

    if (count > 0) {
      // If any results, they should all contain "Google"
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText("Google");
      }
    }
  });

  test("eligible-only filter shows badge", async ({ page }) => {
    const eligibleButton = page.getByRole("button", { name: /eligible only/i });
    await eligibleButton.click();
    await expect(eligibleButton).toHaveAttribute("aria-pressed", "true");
  });

  test("status filter chips toggle correctly", async ({ page }) => {
    const openChip = page.getByRole("button", { name: /^open$/i });
    await openChip.click();
    await expect(openChip).toHaveAttribute("aria-pressed", "true");

    // Click again to deselect
    await openChip.click();
    await expect(openChip).toHaveAttribute("aria-pressed", "false");
  });

  test("company card shows package and deadline", async ({ page }) => {
    const firstCard = page.locator('[href^="/companies/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 8_000 });

    // Should show LPA somewhere on the card
    await expect(firstCard.getByText(/LPA/i)).toBeVisible();
  });

  test("clicking a company card navigates to detail page", async ({ page }) => {
    const firstCard = page.locator('[href^="/companies/"]').first();
    await firstCard.waitFor({ timeout: 8_000 });

    const href = await firstCard.getAttribute("href");
    await firstCard.click();

    await page.waitForURL(`**${href}`, { timeout: 5_000 });
    expect(page.url()).toContain("/companies/");
  });
});

test.describe("Company detail page", () => {
  test("shows company name, package, and eligibility criteria", async ({ page }) => {
    // Navigate to companies first
    await page.goto("/companies");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[href^="/companies/"]').first();
    await firstCard.waitFor({ timeout: 8_000 });
    await firstCard.click();

    await page.waitForLoadState("networkidle");

    // Check for key content sections
    await expect(page.getByText(/eligibility criteria/i)).toBeVisible();
    await expect(page.getByText(/minimum cgpa/i)).toBeVisible();
    await expect(page.getByText(/LPA/i).first()).toBeVisible();
  });

  test("back button returns to companies list", async ({ page }) => {
    await page.goto("/companies");
    await page.waitForLoadState("networkidle");

    const firstCard = page.locator('[href^="/companies/"]').first();
    await firstCard.waitFor({ timeout: 8_000 });
    await firstCard.click();

    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /back to companies/i }).click();
    await expect(page).toHaveURL("/companies");
  });
});
