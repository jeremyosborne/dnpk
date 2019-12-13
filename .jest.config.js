//
// see: https://jestjs.io/docs/en/configuration
//
module.exports = {
  // Fail quick because all of our tests should pass all the time.
  bail: 1,
  collectCoverage: true,
  coverageDirectory: "coverage",
  // If module is under CI, use the more extensive reporting options.
  // Default: ["json", "lcov", "text", "clover"]
  coverageReporters: ["text", "text-summary"],
}
