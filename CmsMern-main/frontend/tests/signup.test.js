// signup.test.js
import { test, expect } from '@playwright/test';

test.describe('Signup Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/signup', {
      waitUntil: 'networkidle'
    });
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/signup$/);
  });

  test('should fill and submit the signup form with valid data', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    
    // Fill the form
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('testuser@example.com');
    await page.locator('input[name="password"]').fill('Test@1234');
    await page.selectOption('select[name="role"]', 'attendee');
    
    // Mock the API response
    await page.route('**/auth/register', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Submit form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);

    // Verify navigation to login page
    expect(page.url()).toMatch(/\/login$/);
  });

  test('should show error for invalid email format', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    
    // Fill form with invalid email
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('Test@1234');
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('should show error for missing name', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    
    // Fill form without name
    await page.locator('input[name="email"]').fill('testuser@example.com');
    await page.locator('input[name="password"]').fill('Test@1234');
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=Name is required')).toBeVisible();
  });
});