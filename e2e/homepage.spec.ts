import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display main elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Prodiges Agency/);
    
    // Check main heading is visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Check navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check footer is present
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', expect.stringContaining('Prodiges'));
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', expect.stringContaining('Prodiges'));
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', expect.stringContaining('vision'));
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile navigation works
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }
    
    // Check content is readable on mobile
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should load all sections', async ({ page }) => {
    // Wait for all major sections to load
    const sections = [
      'header',
      'main',
      'footer'
    ];
    
    for (const section of sections) {
      await expect(page.locator(section)).toBeVisible();
    }
  });

  test('should have working scroll to sections', async ({ page }) => {
    // Find a link that scrolls to a section
    const sectionLink = page.locator('a[href^="#"]').first();
    
    if (await sectionLink.isVisible()) {
      await sectionLink.click();
      
      // Wait a bit for smooth scroll
      await page.waitForTimeout(500);
      
      // Check if page scrolled (scroll position should change)
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    }
  });

  test('should track analytics events', async ({ page }) => {
    // Mock analytics to track events
    await page.addInitScript(() => {
      window.analyticsEvents = [];
      window.gtag = (...args) => {
        window.analyticsEvents.push(args);
      };
    });

    await page.goto('/');
    
    // Trigger a trackable event (click a button)
    const trackableButton = page.locator('button, a').first();
    if (await trackableButton.isVisible()) {
      await trackableButton.click();
    }
    
    // Check if analytics events were fired
    const events = await page.evaluate(() => window.analyticsEvents);
    expect(events.length).toBeGreaterThan(0);
  });
});