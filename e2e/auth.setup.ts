import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/student.json");

/**
 * Runs once before all E2E tests.
 * Logs in as the demo student and saves the session to disk.
 * All subsequent tests reuse this session — no repeated login.
 */
setup("authenticate as student", async ({ page }) => {
  await page.goto("/login");

  // Fill in the demo credentials
  await page.getByLabel(/email/i).fill("student@placetrack.app");
  await page.getByLabel(/password/i).fill("Student@1234");

  // Submit via the button (not form submit — matches our LoginForm fix)
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for redirect to dashboard
  await page.waitForURL("**/dashboard", { timeout: 10_000 });
  await expect(page).toHaveURL("/dashboard");

  // Verify the dashboard rendered — not just a blank page
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

  // Save session cookies and localStorage to file
  await page.context().storageState({ path: authFile });
});
