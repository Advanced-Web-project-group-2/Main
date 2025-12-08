export default {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["<rootDir>/tests/loadEnvForJest.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
