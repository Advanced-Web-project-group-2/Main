const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname), 
  testEnvironment: "node",
  transform: {},
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};