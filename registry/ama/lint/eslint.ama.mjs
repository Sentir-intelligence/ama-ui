// AMA UI lint rules. Installed into consuming apps by the `lint` registry item and spread into eslint.config.mjs:
//
//   import { amaRules } from "./eslint.ama.mjs";
//   export default [...amaRules({ entryPoint: "app/globals.css", compat: true })];
//
// Enforces the guideline mechanically: only classes the AMA theme generates (no palette, no default sizes),
// no arbitrary values, no warning colour inside table rows. With compat: true (ama-os migration only)
// the Tailwind defaults mapped by compat.css are allowed but warned, so the count can be driven to zero.
import betterTailwind from "eslint-plugin-better-tailwindcss";

const COMPAT = "^(?:.*:)?(?:text-(?:xs|sm|base|lg|xl|2xl|3xl)|(?:bg|text|border)-(?:white|black)(?:/\\d+)?|rounded(?:-2xl|-3xl)?|shadow(?:-xl|-2xl)?)$";

export function amaRules({ entryPoint, files = ["**/*.{ts,tsx,js,jsx}"], compat = false } = {}) {
  return [
    {
      files,
      plugins: { "better-tailwindcss": betterTailwind },
      settings: { "better-tailwindcss": { entryPoint } },
      rules: {
        "better-tailwindcss/no-unknown-classes": ["error", { ignore: ["^status-chip(__swatch|__label)?$", "^group$", "^peer$", "^dark$"] }],
        "better-tailwindcss/no-conflicting-classes": "error",
        "better-tailwindcss/no-duplicate-classes": "error",
        "better-tailwindcss/no-deprecated-classes": "error",
        "better-tailwindcss/no-restricted-classes": [
          compat ? "warn" : "error",
          {
            restrict: [
              { pattern: "\\]$", message: "Arbitrary value. Use an AMA token, type role or the Tailwind 4px spacing scale instead." },
              { pattern: "^(?:.*:)?(?:outline-none|ring-ring/\\d+)$", message: "Focus uses the global outline. Use outline-hidden only when a replacement focus style is drawn." },
              { pattern: "^(?:.*:)?opacity-\\d+$", message: "No opacity for hover or disabled states. Use the hover, disabled and muted tokens." },
              ...(compat ? [{ pattern: COMPAT, message: "Migration shim class. Replace with the AMA role or token (see AGENTS.md mapping)." }] : []),
            ],
          },
        ],
      },
    },
    {
      files,
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            selector: "JSXOpeningElement[name.name=/^(tr|td|th|TableRow|TableCell|TableHead)$/] JSXAttribute[name.name='className'] Literal[value=/(^|\\s|:)(bg|text|border)-warning/]",
            message: "Warning colour is for alerts, toasts and validation only, never inside table rows. Use <StatusChip> for lifecycle state.",
          },
          {
            selector: "JSXOpeningElement[name.name='select']",
            message: "Use the <Select> component, not a raw <select>.",
          },
        ],
      },
    },
  ];
}
