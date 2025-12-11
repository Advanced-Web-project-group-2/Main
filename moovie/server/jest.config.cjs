const path = require("path");

const rootDir = __dirname; 

module.exports = {
  rootDir: "./",
  testEnvironment: "node",
  transform: {},
  setupFilesAfterEnv: [
    path.join(rootDir, "tests/setupEnv.js"),
    path.join(rootDir, "tests/setup.js"),
  ],
};