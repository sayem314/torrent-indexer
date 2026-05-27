import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        clearTimeout: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        setTimeout: "readonly"
      }
    },
    rules: {
      indent: ["error", 2],
      "no-console": 0,
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"]
    }
  }
];
