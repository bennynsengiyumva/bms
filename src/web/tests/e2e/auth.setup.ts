import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('/login');

  // Step 2: Fill in credentials
  // These should match the seeded data in the test environment
  await page.getByLabel('Email').fill('admin@bms.rw');
  await page.getByLabel('Password').fill('admin123');
  
  // Step 3: Submit login
  await page.getByRole('button', { name: /sign in/i }).click();

  // Step 4: Verify login success (redirect to dashboard)
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 5: Save authentication state
  await page.context().storageState({ path: authFile });
});
