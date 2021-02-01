module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'hooks/**/*.js',
    '!hooks/**/__test__/*.test.js',
    '!hooks/**/demo/*.js'
  ],
  setupFiles: ['<rootDir>/enzyme.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};
