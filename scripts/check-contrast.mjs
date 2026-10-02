#!/usr/bin/env node
// Accessibility gate for the token set. Fails CI on any WCAG 2.2 AA breach in either mode.
//   Text pairs 4.5:1, non-text (borders, rings, icons, chart marks) 3:1, status swatches distinct (OKLab dE >= 6).
// Colour-vision proximities between status swatches are reported, not failed: icon shape and label carry meaning.
import { T, semantic } from "./lib/tokens.mjs";
import { contrast, deltaE, simulate, CVD } from "./lib/color.mjs";

const STATUS = Object.keys(T.status);
const FEEDBACK = ["success", "warning", "info"];
const fails = [];
const advisories = [];
let minText = Infinity, minNonText = Infinity;

const textPairs = [
  ...["background", "canvas", "card", "popover", "muted", "surface-sunken", "row-hover", "row-selected", "accent"].map((b) => ["foreground", b]),
  ...["background", "canvas", "card", "popover", "muted", "surface-sunken", "row-hover", "row-selected"].map((b) => ["muted-foreground", b]),
  ["placeholder", "background"], ["link", "background"], ["link", "canvas"], ["link", "card"],
  ["primary-foreground", "primary"], ["primary-foreground", "primary-hover"],
  ["destructive-foreground", "destructive"], ["destructive-foreground", "destructive-hover"], ["destructive-soft-foreground", "destructive-soft"], ["destructive", "background"],
  ["secondary-foreground", "secondary"], ["accent-foreground", "accent"],
  ["chrome-foreground", "chrome"], ["chrome-muted", "chrome"], ["chrome-foreground", "chrome-hover"],
  ["signal-foreground", "signal"], ["brand-foreground", "brand"], ["card-foreground", "card"], ["popover-foreground", "popover"],
  ["sidebar-foreground", "sidebar"], ["sidebar-primary-foreground", "sidebar-primary"], ["sidebar-accent-foreground", "sidebar-accent"],
  ...FEEDBACK.flatMap((k) => [[`${k}-foreground`, k], [`${k}-soft-foreground`, `${k}-soft`], [k, "background"], [k, "card"]]),
  ["status-chip-fg", "status-chip-bg"],
  ["logo", "background"], ["logo", "canvas"], ["logo", "card"],
];
const nonTextPairs = [
  ...["background", "card", "canvas", "popover"].map((b) => ["input", b]),
  ...["background", "canvas", "card", "popover"].map((b) => ["ring", b]),
  ["signal", "chrome"], ["sidebar-ring", "sidebar"], ["selected-indicator", "row-selected"], ["primary", "background"], ["primary", "canvas"],
  ...STATUS.map((s) => [`status-${s}-ink`, `status-${s}-swatch`]),
  ...STATUS.map((s) => [`status-${s}-edge`, "status-chip-bg"]),
  ...[1, 2, 3, 4, 5].map((i) => [`chart-${i}`, "card"]),
];

for (const mode of ["light", "dark"]) {
  const S = semantic(mode);
  const need = (k) => { if (!(k in S)) throw new Error(`Missing semantic token ${mode}.${k}`); return S[k]; };
  for (const [f, b] of textPairs) {
    const c = contrast(need(f), need(b)); minText = Math.min(minText, c);
    if (c < 4.5) fails.push(`${mode}: text ${f} on ${b} = ${c.toFixed(2)} (needs 4.5)`);
  }
  for (const [f, b] of nonTextPairs) {
    const c = contrast(need(f), need(b)); minNonText = Math.min(minNonText, c);
    if (c < 3) fails.push(`${mode}: non-text ${f} on ${b} = ${c.toFixed(2)} (needs 3.0)`);
  }
  for (let i = 0; i < STATUS.length; i++)
    for (let j = i + 1; j < STATUS.length; j++) {
      const [a, b] = [STATUS[i], STATUS[j]];
      const d = deltaE(S[`status-${a}-swatch`], S[`status-${b}-swatch`]);
      if (d < 6) fails.push(`${mode}: swatches ${a} and ${b} too similar (dE ${d.toFixed(1)}, needs 6)`);
      for (const t of CVD) {
        const dc = deltaE(simulate(S[`status-${a}-swatch`], t), simulate(S[`status-${b}-swatch`], t));
        if (dc < 6) advisories.push(`${mode}: ${t} ${a}/${b} swatch dE ${dc.toFixed(1)}`);
      }
    }
}

console.log(`Contrast: min text ${minText.toFixed(2)}:1, min non-text ${minNonText.toFixed(2)}:1 across light and dark.`);
if (advisories.length) console.log(`Colour-vision advisories (mitigated by icon shape and label): ${advisories.length}\n  ${advisories.join("\n  ")}`);
if (fails.length) { console.error(`\n${fails.length} accessibility failure(s):\n  ${fails.join("\n  ")}`); process.exit(1); }
console.log("All token pairs pass WCAG 2.2 AA.");
