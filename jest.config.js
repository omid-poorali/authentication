/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    verbose: true,
    forceExit: true,
    // clearMocks: true,
    // resetMocks: true,
    // restoreMocks: true,
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    coverageThreshold: {
      global: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      },
    },
    collectCoverageFrom: ['src/**/*.{js,ts}'],
    moduleNameMapper: {
      '@/(.*)': '<rootDir>/src/$1',
    },
  };
  