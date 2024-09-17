module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    // testEnvironment: 'jsdom',
    // Specifying root directory for tests
    roots: ['<rootDir>/tests'],
  
    // File extensions that Jest will process
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
    // Match files for test cases
    testMatch: ['**/tests/**/*.test.tsx'],
  
    // Jest transformations using Babel or ts-jest
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
  
    // Mock static files like CSS or images
    // moduleNameMapper: {
    //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS files
    //   '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock image files
    // },
  
    // Setup testing environment to simulate a browser for UI testing
    // testEnvironment: 'jsdom',
  
    // Setup file for Chakra UI or any other necessary configuration
    setupFilesAfterEnv: ['<rootDir>/tests/setupTest.ts'],
  
    // Coverage collection, optional
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    // coverageReporters: ['html', 'text', 'lcov'],
  
    // Additional module resolution (if needed)
    moduleDirectories: ['node_modules', 'src']
  };