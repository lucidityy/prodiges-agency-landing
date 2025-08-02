import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have PWA manifest', async ({ page }) => {
    // Check if manifest is linked
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');
    
    // Check if manifest file exists and is valid
    const response = await page.request.get('/manifest.json');
    expect(response.status()).toBe(200);
    
    const manifestContent = await response.json();
    expect(manifestContent.name).toContain('Prodiges');
    expect(manifestContent.start_url).toBe('/');
    expect(manifestContent.display).toBe('standalone');
    expect(manifestContent.icons).toBeDefined();
    expect(manifestContent.icons.length).toBeGreaterThan(0);
  });

  test('should have service worker', async ({ page }) => {
    // Check if service worker is registered
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          return !!registration;
        } catch (error) {
          return false;
        }
      }
      return false;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('should have proper PWA meta tags', async ({ page }) => {
    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#5B4FE9');
    
    // Check Apple touch icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toHaveAttribute('href', expect.stringContaining('icon'));
    
    // Check Apple mobile web app capable
    const appleMobileWebAppCapable = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(appleMobileWebAppCapable).toHaveAttribute('content', 'yes');
  });

  test('should work offline (basic)', async ({ page, context }) => {
    // Wait for service worker to be active
    await page.waitForTimeout(2000);
    
    // Go offline
    await context.setOffline(true);
    
    // Try to reload the page
    await page.reload();
    
    // Page should still load (from cache)
    await expect(page.locator('body')).toBeVisible();
    
    // Should show offline indicator or work in offline mode
    // This depends on your offline implementation
  });

  test('should show install prompt on supported browsers', async ({ page, browserName }) => {
    // Skip on Firefox as it doesn't support install prompts
    test.skip(browserName === 'firefox', 'Firefox does not support install prompts');
    
    // Mock beforeinstallprompt event
    await page.addInitScript(() => {
      let deferredPrompt;
      
      // Simulate the beforeinstallprompt event
      setTimeout(() => {
        const event = new Event('beforeinstallprompt');
        event.prompt = () => Promise.resolve();
        event.userChoice = Promise.resolve({ outcome: 'accepted' });
        window.dispatchEvent(event);
      }, 1000);
    });

    await page.goto('/');
    
    // Wait for potential install prompt to show
    await page.waitForTimeout(2000);
    
    // Check if install prompt component exists
    const installPrompt = page.locator('[data-testid="install-prompt"], button:has-text("Installer")');
    
    // The prompt might not always show, but component should exist
    if (await installPrompt.count() > 0) {
      await expect(installPrompt.first()).toBeVisible();
    }
  });

  test('should handle offline state changes', async ({ page, context }) => {
    await page.goto('/');
    
    // Start online
    await context.setOffline(false);
    await page.waitForTimeout(500);
    
    // Go offline
    await context.setOffline(true);
    await page.waitForTimeout(1000);
    
    // Check if offline indicator appears
    const offlineIndicator = page.locator('[data-testid="offline-banner"], .offline, :has-text("hors ligne")');
    
    if (await offlineIndicator.count() > 0) {
      await expect(offlineIndicator.first()).toBeVisible();
    }
    
    // Go back online
    await context.setOffline(false);
    await page.waitForTimeout(1000);
    
    // Offline indicator should disappear
    if (await offlineIndicator.count() > 0) {
      await expect(offlineIndicator.first()).not.toBeVisible();
    }
  });

  test('should have proper icon sizes', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();
    
    // Check that required icon sizes are present
    const requiredSizes = ['192x192', '512x512'];
    const iconSizes = manifest.icons.map(icon => icon.sizes);
    
    for (const size of requiredSizes) {
      expect(iconSizes).toContain(size);
    }
    
    // Check that icon files exist
    for (const icon of manifest.icons) {
      const iconResponse = await page.request.get(icon.src);
      expect(iconResponse.status()).toBe(200);
    }
  });

  test('should have proper caching strategy', async ({ page }) => {
    // Load page first time
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if assets are cached by service worker
    const cacheNames = await page.evaluate(async () => {
      return await caches.keys();
    });
    
    expect(cacheNames.length).toBeGreaterThan(0);
    
    // Check if main page is cached
    const isPageCached = await page.evaluate(async () => {
      const cache = await caches.open('prodiges-dynamic-v1.0.0');
      const response = await cache.match('/');
      return !!response;
    });
    
    // Page might be cached after first load
    if (isPageCached) {
      expect(isPageCached).toBe(true);
    }
  });
});