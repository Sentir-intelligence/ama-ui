import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { amaRules } from "./registry/ama/lint/eslint.ama.mjs";

export default [
  // scripts/figma-export-color.js runs inside Figma (figma global, top-level return), not in Node.
  { ignores: ["node_modules", ".build", "public", "docs", "playground/dist", "scripts/figma-export-color.js"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["scripts/**/*.mjs", "registry/ama/lint/*.mjs", "*.mjs"], languageOptions: { globals: globals.node } },
  ...amaRules({ entryPoint: "app/globals.css", files: ["registry/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}", "playground/**/*.{ts,tsx}"] }),
];
