import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for e2e tests...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for dev server to be ready
    const baseURL = config.webServer?.url || 'http://localhost:3000';
    console.log(`⏳ Waiting for server at ${baseURL}...`);
    
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Verify the app is working
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    
    console.log('✅ Server is ready and app is loading correctly');

    // Set up any global state if needed
    // For example, create test data, authenticate, etc.
    
    // Store authentication state if needed
    // await page.context().storageState({ path: 'e2e/auth-state.json' });

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed successfully');
}

export default globalSetup;