import { test, expect } from '@playwright/test';

test.describe('Login Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and wait for network idle
    await page.goto('http://localhost:5173/login', {
      waitUntil: 'networkidle'
    });
  });

  test('should navigate to login page', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    // Check if we're on the login page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/login$/);
  });

  test('should fill and submit the login form with valid credentials', async ({ page }) => {
    // Wait for form to be visible and interactable
    await expect(page.locator('form')).toBeVisible();
    
    // Fill in the form
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('Test@1234');
    
    // Set up route interception before clicking
    await page.route('**/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          role: 'attendee'
        })
      });
    });
    
    // Submit form and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);

    // Verify navigation
    expect(page.url()).toMatch(/\/all-users\/events$/);
  });

  test('should show error for invalid email format', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    
    // Fill form with invalid email
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('Test@1234');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for error message
    const errorMessage = page.locator('text=Invalid email format');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error for empty fields', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for error messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });
});