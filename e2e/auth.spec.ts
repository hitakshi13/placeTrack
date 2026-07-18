import { test, expect } from "@playwright/test";

// These tests do NOT use the saved session — they test the auth flow directly
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Authentication flow", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("shows demo credentials on login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("student@placetrack.app")).toBeVisible();
  });

  test("redirects unauthenticated users from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("redirects unauthenticated users from /companies to /login", async ({ page }) => {
    await page.goto("/companies");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("student@placetrack.app");
    await page.getByLabel(/password/i).fill("Student@1234");
    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("**/dashboard", { timeout: 10_000 });
    await expect(page).toHaveURL("/dashboard");
  });

  test("shows error message for wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("student@placetrack.app");
    await page.getByLabel(/password/i).fill("WrongPassword@1");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(
      page.getByText(/invalid email or password/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  test("toggle show/hide password works", async ({ page }) => {
    await page.goto("/login");
    const passwordInput = page.getByLabel(/^password/i);
    await expect(passwordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: /show password/i }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: /hide password/i }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("register page renders correctly", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/college email/i)).toBeVisible();
  });

  test("login page link navigates to register", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /create one/i }).click();
    await expect(page).toHaveURL("/register");
  });
});
