import { test, expect } from '@playwright/test';

test.describe('Hierarchical Data Isolation', () => {
  
  test('instructor should only see candidates from their church/field', async ({ browser }) => {
    // 1. Instructor from Central Rwanda Field (church1)
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await page1.goto('/login');
    await page1.getByLabel(/email/i).fill('pastor.john@bms.rw');
    await page1.getByLabel(/password/i).fill('instructor123');
    await page1.getByRole('button', { name: /sign in/i }).click();

    await expect(page1).toHaveURL(/.*dashboard/);
    
    // Go to candidates list
    await page1.goto('/candidates');
    
    // Should see Emmanuel Nkusi (from church1)
    await expect(page1.getByText(/Emmanuel Nkusi/i)).toBeVisible();
    
    // Should NOT see Isaac Habimana (from Northern Field - church3)
    await expect(page1.getByText(/Isaac Habimana/i)).not.toBeVisible();

    await context1.close();

    // 2. Instructor from Northern Rwanda Field (church3)
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    await page2.goto('/login');
    await page2.getByLabel(/email/i).fill('pastor.marie@bms.rw');
    await page2.getByLabel(/password/i).fill('instructor123');
    await page2.getByRole('button', { name: /sign in/i }).click();

    await expect(page2).toHaveURL(/.*dashboard/);
    
    // Go to candidates list
    await page2.goto('/candidates');
    
    // Should see Isaac Habimana
    await expect(page2.getByText(/Isaac Habimana/i)).toBeVisible();
    
    // Should NOT see Emmanuel Nkusi
    await expect(page2.getByText(/Emmanuel Nkusi/i)).not.toBeVisible();

    await context2.close();
  });
});
