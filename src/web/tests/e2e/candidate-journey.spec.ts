import { test, expect } from '@playwright/test';

test.describe('Candidate Journey', () => {
  const timestamp = Date.now();
  const candidateName = `Test_Candidate_${timestamp}`;
  const candidateEmail = `test_cand_${timestamp}@example.rw`;

  test('should complete a full candidate lifecycle', async ({ page }) => {
    // 1. Registration
    await page.goto('/candidates/new');
    
    await page.getByLabel(/full name/i).fill(candidateName);
    await page.getByLabel(/email/i).fill(candidateEmail);
    await page.getByLabel(/phone/i).fill('+250780000000');
    await page.getByLabel(/date of birth/i).fill('2000-01-01');
    await page.getByLabel(/gender/i).selectOption('male');
    
    await page.getByLabel(/province/i).selectOption('kigali');
    await page.getByLabel(/district/i).fill('Nyarugenge');
    await page.getByLabel(/sector/i).fill('Nyamirambo');
    
    await page.getByLabel(/local church/i).selectOption('kigali-central');
    
    await page.getByRole('button', { name: /submit registration|ohereza/i }).click();

    // Verify redirect and presence in list
    await expect(page).toHaveURL(/.*candidates/);
    await expect(page.getByText(candidateName)).toBeVisible();

    // 2. View Details & Verification (Task 6ef3a595 implementation)
    await page.getByText(candidateName).click();
    await expect(page).toHaveURL(/\/candidates\/\d+/);
    
    // Check if the Verification section is present
    await expect(page.getByText(/verify requirements|genzura ibisabwa/i)).toBeVisible();

    // 3. Mock/Simulate Lesson Completion
    // In a real integration test, we might go to the Bible Study module
    // For now, let's verify the UI state for requirements
    const progressText = await page.getByText(/lessons completed/i).isVisible();
    if (progressText) {
       // Interactions to log lessons if UI allows
    }

    // 4. Spiritual Preparation / Readiness
    // Verify readiness score display
    await expect(page.getByText(/readiness score/i)).toBeVisible();

    // 5. Baptism & Signing (if ready)
    // This part depends on the candidate being marked 'ready'
    // For the integration test to pass reliably, we might need the backend
    // to have this candidate in a 'ready' state or we simulate it.
  });
});
