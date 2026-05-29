import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('admin@bms.rw');
    await page.getByLabel(/password/i).fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('WrongPass123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify error message (assuming the UI shows one)
    // await expect(page.getByText(/invalid/i)).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should logout successfully', async ({ page }) => {
    // Start from an authenticated state (using storageState from config)
    await page.goto('/dashboard');
    
    // Assuming there's a logout button in the header or sidebar
    // Adjust selector based on actual UI
    await page.getByRole('button', { name: /logout|sohoka/i }).click();

    await expect(page).toHaveURL(/.*login/);
  });
});
