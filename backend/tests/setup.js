// Test setup file
require('dotenv').config({ path: '.env.test', override: true });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  if (process.env.VERBOSE_TESTS === 'true') {
    originalConsoleLog(...args);
  }
};

console.warn = (...args) => {
  if (process.env.VERBOSE_TESTS === 'true') {
    originalConsoleWarn(...args);
  }
};

// Global test timeout
jest.setTimeout(30000);

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global teardown
afterAll(async () => {
  // Cleanup operations if needed
  console.log('Test suite completed');
});
