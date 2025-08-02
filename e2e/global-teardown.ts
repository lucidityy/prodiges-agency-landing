async function globalTeardown() {
  console.log('🧹 Starting global teardown for e2e tests...');

  try {
    // Clean up any global state
    // For example, delete test data, clean up files, etc.
    
    // Clean up test artifacts if needed
    // await fs.rm('e2e/auth-state.json', { force: true });
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here as it might mask test failures
  }
}

export default globalTeardown;