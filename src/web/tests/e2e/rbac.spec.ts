import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control (RBAC)', () => {
  
  test('candidate role should have restricted access', async ({ browser }) => {
    // 1. Create a context for the candidate
    const context = await browser.newContext();
    const page = await context.newPage();

    // 2. Login as candidate
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('candidate.emmanuel@bms.rw');
    await page.getByLabel(/password/i).fill('candidate123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/.*dashboard/);

    // 3. Verify sidebar restrictions (SC-3.1)
    // Candidate should NOT see "Churches" or "Settings" or "Reports"
    // Based on TranslationKeys: churches, reports, settings
    await expect(page.locator('nav')).not.toContainText(/churches|amatorero/i);
    await expect(page.locator('nav')).not.toContainText(/reports|amanarabyaha/i);
    await expect(page.locator('nav')).not.toContainText(/settings|igenamiterwe/i);

    // 4. Verify manual navigation restriction (SC-3.2)
    await page.goto('/churches');
    // Expect redirect to dashboard or an error page
    await expect(page).not.toHaveURL(/\/churches/);
    
    await page.goto('/settings');
    await expect(page).not.toHaveURL(/\/settings/);

    await context.close();
  });

  test('pastor role should see baptism records', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login as pastor
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('rev.peter@bms.rw');
    await page.getByLabel(/password/i).fill('pastor123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/.*dashboard/);

    // Verify access to Baptism module
    await page.goto('/baptism');
    await expect(page).toHaveURL(/\/baptism/);
    await expect(page.getByText(/baptism management|gukurikirana ubaptizimu/i)).toBeVisible();

    await context.close();
  });
});
