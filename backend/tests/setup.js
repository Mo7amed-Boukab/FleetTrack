// Configure environment variables for testing
process.env.JWT_SECRET = "test-jwt-secret-key-for-unit-tests";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-token-secret-key";
process.env.NODE_ENV = "test";

// Mock console.error to reduce noise in test output
global.console.error = jest.fn();
