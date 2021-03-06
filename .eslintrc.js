module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    // "plugin:import/errors",
    // "plugin:import/warnings",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true,
      },
      plugins: ["jest"],
      rules: {
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "off",
        "jest/valid-expect": "error",
      },
    },
    {
      files: ["**/*.ts"],
      env: {
        node: true,
        es2021: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        // "plugin:import/errors",
        // "plugin:import/warnings",
        // "plugin:import/typescript",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
}
