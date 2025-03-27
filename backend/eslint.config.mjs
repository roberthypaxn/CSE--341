import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  {
    rules: {
      "capitalized-comments": ["warn", "always"],
      "no-unused-vars": "warn",
    },
  },
];

// Import tseslint from "typescript-eslint";

// /** @type {import('eslint').Linter.Config[]} */
// Export default [
//   { files: ["**/*.{js,mjs,cjs,ts}"] },
//   { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
//   { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
//   PluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//
// ];
