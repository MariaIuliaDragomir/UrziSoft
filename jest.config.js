module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["js"],
  collectCoverageFrom: [
    "backend/**/*.js",
    "!backend/**/*.test.js",
    "!backend/server.js",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};
