// AMA UI lint rules. Installed into consuming apps by the `lint` registry item and spread into eslint.config.mjs:
//
//   import { amaRules } from "./eslint.ama.mjs";
//   export default [...amaRules({ entryPoint: "app/globals.css", compat: true })];
//
// Enforces the guideline mechanically: only classes the AMA theme generates (no palette, no default sizes),
// no arbitrary values, no warning colour inside table rows, status colours only through <StatusChip>,
// website yellow (signal) only on navy chrome, and the logo only through <Logo>.
// With compat: true (ama-os migration only) every rule warns instead of erroring,
// so a consuming app can adopt the rules today and ratchet the warning count down to zero.
// chromeFiles: files that render on navy chrome (top bar, side nav) and may use the signal colour.
import betterTailwind from "eslint-plugin-better-tailwindcss";

const COMPAT = "^(?:.*:)?(?:text-(?:xs|sm|base|lg|xl|2xl|3xl)|(?:bg|text|border)-(?:white|black)(?:/\\d+)?|rounded(?:-2xl|-3xl)?|shadow(?:-xl|-2xl)?)$";

const CLASS_TEXT = (re) => `:matches(Literal[value=${re}], TemplateElement[value.raw=${re}])`;
const STATUS_CLASS = "/(^|\\s|:)(bg|text|border|fill|stroke|ring|outline|decoration|from|via|to)-status-/";
const SIGNAL_CLASS = "/(^|\\s|:)(bg|text|border|fill|stroke|ring|outline|decoration|from|via|to)-signal\\b/";

const BASE_SYNTAX = [
  {
    selector: "JSXOpeningElement[name.name=/^(tr|td|th|TableRow|TableCell|TableHead)$/] JSXAttribute[name.name='className'] Literal[value=/(^|\\s|:)(bg|text|border)-warning/]",
    message: "Warning colour is for alerts, toasts and validation only, never inside table rows. Use <StatusChip> for lifecycle state.",
  },
  {
    selector: "JSXOpeningElement[name.name='select']",
    message: "Use the <Select> component, not a raw <select>.",
  },
  {
    selector: CLASS_TEXT(STATUS_CLASS),
    message: "Status colours are only drawn by <StatusChip status=...>. Never use status-* colour classes directly.",
  },
  {
    selector: "JSXOpeningElement[name.name=/^(img|Image)$/] JSXAttribute[name.name='src'] :matches(Literal[value=/logo/i], TemplateElement[value.raw=/logo/i])",
    message: "Use <Logo /> (tone and variant props), never an image of the logo.",
  },
  {
    selector: "ImportDeclaration[source.value=/ama-logo[\\w.-]*\\.(svg|png|jpe?g|webp)$/]",
    message: "Use <Logo /> (tone and variant props), never an imported logo file.",
  },
];
const SIGNAL_SYNTAX = {
  selector: CLASS_TEXT(SIGNAL_CLASS),
  message: "Website yellow (signal) is only for highlights on navy chrome. Elsewhere yellow means Delivered and appears only inside <StatusChip>. Add the file to chromeFiles if it renders on navy chrome.",
};
const CHROME_FILES = ["**/{app-shell,top-bar,topbar,side-nav,sidenav,sidebar,nav-bar,navbar}*.{ts,tsx,js,jsx}", "**/shell/**/*.{ts,tsx,js,jsx}"];

export function amaRules({ entryPoint, files = ["**/*.{ts,tsx,js,jsx}"], compat = false, chromeFiles = CHROME_FILES } = {}) {
  return [
    {
      files,
      plugins: { "better-tailwindcss": betterTailwind },
      settings: { "better-tailwindcss": { entryPoint } },
      rules: {
        "better-tailwindcss/no-unknown-classes": [compat ? "warn" : "error", { ignore: ["^status-chip(__swatch|__label)?$", "^group$", "^peer$", "^dark$"] }],
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
    // Chrome files: everything except the signal ban. Later configs win for the same rule, so the
    // non-chrome block below (base + signal) overrides this one for every file outside chromeFiles.
    { files, rules: { "no-restricted-syntax": [compat ? "warn" : "error", ...BASE_SYNTAX] } },
    { files, ignores: chromeFiles, rules: { "no-restricted-syntax": [compat ? "warn" : "error", ...BASE_SYNTAX, SIGNAL_SYNTAX] } },
  ];
}
