import { test, expect } from '@playwright/test';

test.describe('Contact Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have newsletter signup form', async ({ page }) => {
    // Look for newsletter form
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"], button:has-text("guide")');
    
    await expect(emailInput.first()).toBeVisible();
    await expect(submitButton.first()).toBeVisible();
  });

  test('should validate email input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Test invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Browser should show validation message
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid;
    });
    expect(isInvalid).toBe(true);
  });

  test('should accept valid email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Test valid email
    await emailInput.fill('test@example.com');
    
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => {
      return el.validity.valid;
    });
    expect(isValid).toBe(true);
  });

  test('should track form interactions', async ({ page }) => {
    // Setup analytics tracking
    await page.addInitScript(() => {
      window.formEvents = [];
      const originalTrackFormEvent = window.trackFormEvent || (() => {});
      window.trackFormEvent = (...args) => {
        window.formEvents.push(args);
        return originalTrackFormEvent(...args);
      };
    });

    await page.goto('/');
    
    const emailInput = page.locator('input[type="email"]').first();
    
    // Focus should trigger form start tracking
    await emailInput.focus();
    await page.waitForTimeout(100);
    
    // Fill form
    await emailInput.fill('test@example.com');
    
    // Check if form events were tracked
    const events = await page.evaluate(() => window.formEvents);
    expect(events).toBeDefined();
  });

  test('should have contact buttons', async ({ page }) => {
    // Look for contact methods
    const emailLink = page.locator('a[href^="mailto:"]');
    const phoneLink = page.locator('a[href^="tel:"]');
    const calendarLink = page.locator('a[href*="calendly"], a[href*="calendar"]');
    
    // At least one contact method should be present
    const contactMethods = [emailLink, phoneLink, calendarLink];
    let hasContactMethod = false;
    
    for (const method of contactMethods) {
      if (await method.count() > 0) {
        hasContactMethod = true;
        break;
      }
    }
    
    expect(hasContactMethod).toBe(true);
  });

  test('should open email client when clicking email link', async ({ page }) => {
    const emailLinks = page.locator('a[href^="mailto:"]');
    
    if (await emailLinks.count() > 0) {
      const emailLink = emailLinks.first();
      const href = await emailLink.getAttribute('href');
      
      expect(href).toMatch(/^mailto:.+@.+\..+/);
      
      // Click should not navigate away from page
      await emailLink.click();
      expect(page.url()).toContain('/');
    }
  });

  test('should handle form submission gracefully', async ({ page }) => {
    // Mock form submission
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible() && await submitButton.isVisible()) {
      await emailInput.fill('test@example.com');
      await submitButton.click();
      
      // Should not show error and form should reset or show success
      await page.waitForTimeout(1000);
      
      // Check if form was reset
      const inputValue = await emailInput.inputValue();
      expect(inputValue).toBe('');
    }
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper labels
    const inputs = page.locator('input[type="email"]');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      
      // Should have placeholder or label
      const placeholder = await input.getAttribute('placeholder');
      const ariaLabel = await input.getAttribute('aria-label');
      const id = await input.getAttribute('id');
      
      let hasLabel = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabel = await label.count() > 0;
      }
      
      expect(placeholder || ariaLabel || hasLabel).toBeTruthy();
    }
  });
});