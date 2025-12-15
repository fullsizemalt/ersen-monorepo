// Test setup file - runs before all tests
import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: '.env.test' });

// Set test-specific environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
    // Close any open handles
    await new Promise((resolve) => setTimeout(resolve, 100));
});
