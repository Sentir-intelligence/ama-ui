#!/usr/bin/env node
// Generates every derived file from tokens/ama-tokens.json.
//   node scripts/build-tokens.mjs          write files
//   node scripts/build-tokens.mjs --check  exit 1 if any generated file is stale (CI)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { T, walk } from "./lib/tokens.mjs";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const VERSION = T.$extensions?.ama?.version ?? "0.0.0";
const HDR = `/* GENERATED from tokens/ama-tokens.json (v${VERSION}) by scripts/build-tokens.mjs. Do not edit by hand. */`;
const TS_HDR = `// GENERATED from tokens/ama-tokens.json (v${VERSION}) by scripts/build-tokens.mjs. Do not edit by hand.`;
const isRef = (v) => typeof v === "string" && v.startsWith("{");
const cssRef = (v) => {
  const m = typeof v === "string" && v.match(/^\{color\.(.+)\}$/);
  return m ? `var(--ama-${m[1].replace(/\./g, "-")})` : v;
};
const fontList = (arr) => arr.map((f) => (f.includes(" ") ? `'${f}'` : f)).join(", ");
const entries = (o) => Object.entries(o).filter(([k]) => !k.startsWith("$"));

// ---------- guards ----------
const semKeys = Object.keys(T.semantic.light).filter((k) => !k.startsWith("status-"));
const roles = Object.keys(T.typography);
const clash = roles.filter((r) => semKeys.includes(r));
if (clash.length) throw new Error(`Type role names collide with colour tokens (text-${clash[0]} would be a colour): ${clash}`);
const lightKeys = Object.keys(T.semantic.light).sort().join();
if (lightKeys !== Object.keys(T.semantic.dark).sort().join()) throw new Error("semantic.light and semantic.dark must define the same keys");
for (const mode of ["light", "dark"])
  for (const [k, t] of entries(T.semantic[mode]))
    if (!isRef(t.$value)) throw new Error(`semantic.${mode}.${k} is a raw value; semantic tokens must reference a primitive`);

// ---------- tokens.css ----------
const L = [HDR, ":root {"];
for (const [path, t] of walk(T.color)) L.push(`  --ama-${path.join("-")}: ${t.$value};`);
for (const [k, t] of entries(T.font)) L.push(`  --ama-font-${k}: ${fontList(t.$value)};`);
for (const [k, t] of entries(T.radius)) L.push(`  --ama-radius-${k}: ${t.$value};`);
for (const [k, t] of entries(T.size)) L.push(`  --ama-size-${k}: ${t.$value};`);
for (const [k, t] of entries(T.shadow)) L.push(`  --ama-shadow-${k}: ${t.$value};`);
for (const [k, t] of entries(T.component["status-chip"])) L.push(`  --ama-component-status-chip-${k}: ${t.$value};`);
for (const [k, t] of entries(T.density.comfortable)) L.push(`  --ama-density-${k}: ${t.$value};`);
for (const [k, t] of entries(T.semantic.light)) L.push(`  --${k}: ${cssRef(t.$value)};`);
L.push("}");
for (const d of ["compact", "touch", "comfortable"]) {
  L.push(`[data-density="${d}"] {`);
  for (const [k, t] of entries(T.density[d])) L.push(`  --ama-density-${k}: ${t.$value};`);
  L.push("}");
}
L.push(".dark {", "  color-scheme: dark;");
for (const [k, t] of entries(T.semantic.dark)) L.push(`  --${k}: ${cssRef(t.$value)};`);
L.push("}");

// ---------- theme.css (Tailwind v4 wiring) ----------
const G = [HDR, '@import "./tokens.css";', '@import "./status-chip.css";', "",
  "@custom-variant dark (&:where(.dark, .dark *));", "",
  "/* Only AMA tokens exist as utilities. Tailwind's default palette, type scale, radii, shadows and fonts are removed. */",
  "@theme {", "  --color-*: initial;", "  --text-*: initial;", "  --radius-*: initial;", "  --shadow-*: initial;", "  --font-*: initial;", "  --text-shadow-*: initial;", "}", "",
  "@theme inline {",
  ...semKeys.map((k) => `  --color-${k}: var(--${k});`),
  "  --color-transparent: transparent;", "  --color-current: currentColor;",
  ...Object.keys(T.font).map((k) => `  --font-${k}: var(--ama-font-${k});`),
  ...entries(T.radius).map(([k]) => `  --radius-${k}: var(--ama-radius-${k});`),
  ...entries(T.shadow).map(([k]) => `  --shadow-${k}: var(--ama-shadow-${k});`),
  ...entries(T.size).map(([k]) => `  --spacing-${k}: var(--ama-size-${k});`),
  "  --spacing-control: var(--ama-density-control);", "  --spacing-row: var(--ama-density-row);", "  --spacing-cell: var(--ama-density-cell);"];
for (const [r, t] of entries(T.typography)) {
  const v = t.$value;
  let size = isRef(String(v.fontSize)) ? "var(--ama-density-cell-text)" : v.fontSize;
  let lh = isRef(String(v.lineHeight)) ? "var(--ama-density-cell-leading)" : v.lineHeight;
  if (r === "caption" || r === "overline") { size = "var(--ama-density-caption)"; lh = "16px"; }
  G.push(`  --text-${r}: ${size};`, `  --text-${r}--line-height: ${lh};`, `  --text-${r}--font-weight: ${v.fontWeight};`, `  --text-${r}--letter-spacing: ${v.letterSpacing};`);
}
G.push("}", "", "@layer base {",
  "  * { border-color: var(--border); }",
  "  html { scroll-padding-top: 6rem; }",
  "  body { background: var(--canvas); color: var(--foreground); font-family: var(--ama-font-sans); font-size: var(--text-body); line-height: var(--text-body--line-height); -webkit-font-smoothing: antialiased; }",
  '  table, td, th, time, output, input[type="number"], [data-numeric] { font-variant-numeric: tabular-nums; }',
  "  :focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }",
  "  td :focus-visible, th :focus-visible, td:focus-visible { outline-offset: -2px; }",
  "  a:not([data-variant]) { color: var(--link); text-decoration-line: underline; text-underline-offset: 2px; }",
  "  ::placeholder { color: var(--placeholder); }",
  "  ::selection { background: var(--row-selected); }",
  '  [data-surface="chrome"] { --ring: var(--signal); }',
  "  /* Role completions: family, case and features ride on the role class itself, including variant-prefixed use. */",
  '  [class*="text-overline"] { text-transform: uppercase; }',
  '  [class*="text-kpi"], [class*="text-table-cell"] { font-variant-numeric: tabular-nums; }',
  '  [class*="text-id"] { font-feature-settings: "tnum", "zero", "cv08"; }',
  "}", "",
  "/* Indicators compose with Tailwind shadow and ring utilities. */",
  "@utility indicator-left { --tw-inset-shadow: inset 3px 0 0 var(--selected-indicator); box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow, 0 0 #0000); }",
  "@utility indicator-bottom { --tw-inset-shadow: inset 0 -3px 0 var(--signal); box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow, 0 0 #0000); }",
  "",
  "@media (prefers-reduced-motion: reduce) {",
  "  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }",
  "}",
  "@media (forced-colors: active) {",
  "  :focus-visible { outline-color: Highlight; }",
  '  [aria-current="page"], [data-active="true"] { border-bottom: 3px solid Highlight; }',
  '  [aria-selected="true"], [data-state="selected"] { outline: 2px solid Highlight; outline-offset: -2px; }',
  "}");

// ---------- status-chip.css ----------
// Swatch chip: a neutral tag (shared chip tokens) with a solid status-colour square holding the icon.
const S = [HDR,
  ".status-chip { display: inline-flex; flex: none; max-width: 100%; align-items: stretch; height: var(--ama-component-status-chip-height); border: 1px solid var(--status-chip-border); border-radius: var(--ama-component-status-chip-radius); background: var(--status-chip-bg); color: var(--status-chip-fg); font-size: var(--text-label); line-height: var(--text-label--line-height); font-weight: var(--text-label--font-weight); white-space: nowrap; vertical-align: middle; }",
  ".status-chip__swatch { display: grid; place-items: center; flex: none; aspect-ratio: 1; height: 100%; background: var(--chip-swatch); color: var(--chip-ink); box-shadow: inset 0 0 0 1px var(--chip-edge); border-start-start-radius: calc(var(--ama-component-status-chip-radius) - 1px); border-end-start-radius: calc(var(--ama-component-status-chip-radius) - 1px); }",
  ".status-chip__swatch svg { width: var(--ama-component-status-chip-icon); height: var(--ama-component-status-chip-icon); stroke-width: 2; }",
  ".status-chip__label { display: flex; align-items: center; padding: 0 calc(var(--spacing) * 1.75); }",
  '[data-density="touch"] .status-chip { height: var(--ama-component-status-chip-height-touch); font-size: var(--text-body-sm); line-height: var(--text-body-sm--line-height); }',
  '[data-density="touch"] .status-chip__swatch svg { width: var(--ama-component-status-chip-icon-touch); height: var(--ama-component-status-chip-icon-touch); }',
  "@media (forced-colors: active) { .status-chip__swatch { border-inline-end: 1px solid CanvasText; } }",
  ...Object.keys(T.status).map((k) => `.status-chip[data-status="${k.replace(/-/g, "_")}"] { --chip-swatch: var(--status-${k}-swatch); --chip-ink: var(--status-${k}-ink); --chip-edge: var(--status-${k}-edge); }`)];

// ---------- compat.css (ama-os migration only) ----------
const C = [HDR,
  "/* TEMPORARY migration shim for ama-os. Maps Tailwind defaults still used by ported prototype code onto AMA values.",
  "   ESLint warns on every use. Delete this import when the warning count reaches zero. The ama-ui library never uses it. */",
  "@theme inline {",
  "  --text-xs: 12px; --text-xs--line-height: 16px;", "  --text-sm: 14px; --text-sm--line-height: 20px;", "  --text-base: 16px; --text-base--line-height: 24px;",
  "  --text-lg: 16px; --text-lg--line-height: 24px;", "  --text-xl: 20px; --text-xl--line-height: 28px;", "  --text-2xl: 24px; --text-2xl--line-height: 32px;", "  --text-3xl: 32px; --text-3xl--line-height: 40px;",
  "  --color-white: var(--ama-white);", "  --color-black: var(--ama-black);",
  "  --radius: var(--ama-radius-md);", "  --radius-2xl: var(--ama-radius-xl);", "  --radius-3xl: var(--ama-radius-xl);",
  "  --shadow: var(--ama-shadow-sm);", "  --shadow-xl: var(--ama-shadow-lg);", "  --shadow-2xl: var(--ama-shadow-lg);",
  "}"];

// ---------- lib/utils.ts (cn with the AMA merge config) ----------
const U = `${TS_HDR}
// cn() that understands the AMA scale, so type roles, density sizes, radii and shadows are never silently dropped.
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ${JSON.stringify(roles)},
      spacing: ${JSON.stringify(["control", ...Object.keys(T.size).filter((k) => !k.startsWith("$")), "row", "cell"])},
      radius: ${JSON.stringify(Object.keys(T.radius).filter((k) => !k.startsWith("$")))},
      shadow: ${JSON.stringify(Object.keys(T.shadow).filter((k) => !k.startsWith("$")))},
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

// ---------- lib/status.ts ----------
const statusObj = Object.fromEntries(Object.entries(T.status).map(([k, v]) => [k.replace(/-/g, "_"), v]));
const ST = `${TS_HDR}
// Status keys mirror the database enum (elements.status). Order is the lifecycle ladder, lowest first.
export const STATUS = ${JSON.stringify(statusObj, null, 2)} as const;

export type StatusKey = keyof typeof STATUS;
export const STATUS_KEYS = Object.keys(STATUS) as StatusKey[];
`;

const outputs = {
  "registry/ama/styles/tokens.css": L.join("\n") + "\n",
  "registry/ama/styles/theme.css": G.join("\n") + "\n",
  "registry/ama/styles/status-chip.css": S.join("\n") + "\n",
  "registry/ama/styles/compat.css": C.join("\n") + "\n",
  "registry/ama/lib/utils.ts": U,
  "registry/ama/lib/status.ts": ST,
};

const check = process.argv.includes("--check");
let stale = [];
for (const [rel, content] of Object.entries(outputs)) {
  const file = root(rel);
  if (check) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== content) stale.push(rel);
  } else writeFileSync(file, content);
}
if (check && stale.length) {
  console.error(`Generated files are stale. Run \`npm run tokens\` and commit:\n  ${stale.join("\n  ")}`);
  process.exit(1);
}
console.log(check ? "Generated files are up to date." : `Wrote ${Object.keys(outputs).length} files from tokens v${VERSION}.`);
