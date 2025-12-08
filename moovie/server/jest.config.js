export default {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["<rootDir>/src/loadEnv.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
