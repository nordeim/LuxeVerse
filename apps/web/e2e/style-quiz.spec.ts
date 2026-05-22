import { test, expect } from "@playwright/test";

test.describe("Style Quiz", () => {
  test("user can navigate through the quiz and see completion", async ({ page }) => {
    await page.goto("/style-quiz");

    // Step 1: Check initial state
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
    await expect(page.getByText(/Which style persona resonates/)).toBeVisible();

    // Answer question 1
    await page.getByRole("button", { name: /Minimalist/ }).click();

    // Step 2
    await expect(page.getByText(/Step 2 of 5/)).toBeVisible();
    await expect(page.getByText(/most frequent dressing occasion/)).toBeVisible();
  });

  test("back button is disabled on first step", async ({ page }) => {
    await page.goto("/style-quiz");

    const backButton = page.getByRole("button", { name: "Back", exact: false });
    await expect(backButton).toBeDisabled();
  });

  test("restart resets quiz to first step", async ({ page }) => {
    await page.goto("/style-quiz");

    // Answer question 1 to advance
    await page.getByRole("button", { name: /Minimalist/ }).click();
    await expect(page.getByText(/Step 2 of 5/)).toBeVisible();

    // Click Restart
    await page.getByRole("button", { name: /Restart/ }).click();

    // Verify back at step 1
    await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
  });
});
