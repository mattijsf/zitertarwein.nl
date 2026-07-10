import js from "@eslint/js"
import filenameExport from "eslint-plugin-filename-export"
import prettierRecommended from "eslint-plugin-prettier/recommended"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import { readFileSync } from "node:fs"
import tseslint from "typescript-eslint"

// ESLint does not read .gitignore (Prettier does), so ignore the same paths here.
const gitignored = readFileSync(new URL(".gitignore", import.meta.url), "utf8")
  .split("\n")
  .map(line => line.trim())
  .filter(line => line !== "" && !line.startsWith("#") && !line.startsWith("!"))
  .map(line => (line.endsWith("/") ? `**/${line}**` : `**/${line}`))

export default defineConfig(
  globalIgnores([...gitignored, "public", "**/*.py"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: {
      "filename-export": filenameExport,
    },
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-console": "error",
      "no-duplicate-case": "error",
      "no-nested-ternary": "error",
      "no-return-await": "error",
      "no-shadow": "off",
      eqeqeq: ["error", "always"],
      "prefer-const": "error",

      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],

      "react/jsx-key": "error",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/no-danger": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-refresh/only-export-components": ["error", { allowConstantExport: true }],

      "filename-export/match-named-export": "error",
      "filename-export/match-default-export": "error",
    },
  },
  {
    // tool configs export an anonymous default
    files: ["*.config.ts"],
    rules: {
      "filename-export/match-default-export": "off",
    },
  },
  {
    files: ["scripts/**/*.ts"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-console": "off",
    },
  },
  prettierRecommended,
  {
    rules: {
      curly: ["error", "all"],
    },
  }
)
