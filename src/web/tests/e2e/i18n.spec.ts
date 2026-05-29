import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
  
  test('should switch language from English to Kinyarwanda', async ({ page }) => {
    await page.goto('/dashboard');

    // 1. Verify English defaults (assuming it defaults to EN or we select it)
    // Check for "Active Candidates" card
    await expect(page.getByText(/active candidates/i)).toBeVisible();

    // 2. Switch to Kinyarwanda
    // Assuming there's a language switcher in the header/footer
    // The previous implementation mentioned a language selector
    await page.getByRole('button', { name: /english/i }).click();
    await page.getByRole('menuitem', { name: /kinyarwanda/i }).click();

    // 3. Verify Kinyarwanda translation (SC-5.1)
    // "Active Candidates" in Kinyarwanda is "Abategerwa bari gukora"
    await expect(page.getByText(/abategerwa bari gukora/i)).toBeVisible();
    
    // Check sidebar
    await expect(page.locator('nav')).toContainText(/Imbere/i); // Dashboard/Home
    await expect(page.locator('nav')).toContainText(/Abategerwa/i); // Candidates
  });
});
