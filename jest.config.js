/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/utils/tests/setupTests.ts'],
};
