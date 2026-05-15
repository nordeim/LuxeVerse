import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs["recommended-type-checked"].rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-enum": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Enums are not allowed. Use string unions instead.",
        },
        {
          selector: "TSModuleDeclaration",
          message: "Namespaces are not allowed. Use ES modules instead.",
        },
      ],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
