//
// see: https://jestjs.io/docs/en/configuration#bail-number-boolean
//
module.exports = {
  // Fail quick because all of our tests should pass all the time.
  bail: 1,
  collectCoverage: true,
  coverageDirectory: "coverage",
  // Pruned automation defaults for now since we're not doing any CI.
  // Default: ["json", "lcov", "text", "clover"]
  coverageReporters: ["text", "text-summary"],
}
