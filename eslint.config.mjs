import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { amaRules } from "./registry/ama/lint/eslint.ama.mjs";

export default [
  { ignores: ["node_modules", ".build", "public", "docs"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["scripts/**/*.mjs", "registry/ama/lint/*.mjs", "*.mjs"], languageOptions: { globals: globals.node } },
  ...amaRules({ entryPoint: "app/globals.css", files: ["registry/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"] }),
];
