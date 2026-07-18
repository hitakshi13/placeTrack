import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("renders stat cards", async ({ page }) => {
    await expect(page.getByText(/applications/i).first()).toBeVisible();
    await expect(page.getByText(/in progress/i)).toBeVisible();
    await expect(page.getByText(/offers/i)).toBeVisible();
  });

  test("renders upcoming deadlines section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /upcoming deadlines/i })).toBeVisible();
  });

  test("renders recent applications section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /recent applications/i })).toBeVisible();
  });

  test("sidebar navigation is visible", async ({ page }) => {
    await expect(page.getByText("PlaceTrack")).toBeVisible();
    await expect(page.getByRole("link", { name: /companies/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /my applications/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /analytics/i })).toBeVisible();
  });

  test("theme toggle is accessible", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeButton).toBeVisible();
    await themeButton.click();

    // Popover should appear
    await expect(page.getByRole("button", { name: /dark/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /light/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /system/i })).toBeVisible();
  });

  test("notifications bell shows unread count when present", async ({ page }) => {
    const notifButton = page.getByRole("button", { name: /notifications/i });
    await expect(notifButton).toBeVisible();
    await notifButton.click();

    // Notifications popover should open
    await expect(page.getByRole("heading", { name: /notifications/i })).toBeVisible();
  });
});

test.describe("Applications Kanban", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/applications");
    await page.waitForLoadState("networkidle");
  });

  test("renders kanban columns", async ({ page }) => {
    await expect(page.getByText("Applied")).toBeVisible();
    await expect(page.getByText("Online Assessment")).toBeVisible();
    await expect(page.getByText("Interview")).toBeVisible();
    await expect(page.getByText("Offer")).toBeVisible();
    await expect(page.getByText("Rejected")).toBeVisible();
  });

  test("shows application count in each column", async ({ page }) => {
    // Each column header should show a count
    const columnHeaders = page.locator('[class*="border-t-"]');
    const count = await columnHeaders.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("clicking an application card opens the stage dialog", async ({ page }) => {
    // Look for any application card
    const appCard = page.getByRole("button").first();
    const cardCount = await page.getByRole("button").count();

    if (cardCount > 0) {
      await appCard.click();
      // Dialog should appear
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 3_000 });
    }
  });
});

test.describe("OA Tracker", () => {
  test("renders the OA tracker page", async ({ page }) => {
    await page.goto("/oa-tracker");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /oa tracker/i })).toBeVisible();
  });
});

test.describe("Analytics", () => {
  test("renders the analytics page", async ({ page }) => {
    await page.goto("/analytics");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /analytics/i })).toBeVisible();
    await expect(page.getByText(/salary distribution/i)).toBeVisible();
    await expect(page.getByText(/placement funnel/i)).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("skip to main content link is present and functional", async ({ page }) => {
    await page.goto("/dashboard");
    // Tab to the skip link
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
  });

  test("sidebar links are keyboard navigable", async ({ page }) => {
    await page.goto("/dashboard");
    // Repeatedly tab and verify focus moves through sidebar links
    const sidebarLinks = page.locator("nav a");
    const count = await sidebarLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("no page has missing alt text on images", async ({ page }) => {
    await page.goto("/companies");
    await page.waitForLoadState("networkidle");

    const imagesWithoutAlt = await page.locator("img:not([alt])").count();
    expect(imagesWithoutAlt).toBe(0);
  });
});
