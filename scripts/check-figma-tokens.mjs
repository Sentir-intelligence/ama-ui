// Compares the Figma Color collection (tokens/figma-color.json, exported with
// scripts/figma-export-color.js) with the semantic tokens in tokens/ama-tokens.json, in light and
// dark. Figma names map to token names by path: "status/ifa/swatch" is status-ifa-swatch,
// "feedback/success/default" is success, "sidebar/default" is sidebar, "chart/1" is chart-1.
// Fails on a value that differs, a Figma colour with no token, or a token with no Figma colour.
import { readFileSync } from "node:fs";
import { figmaToToken, compareFigma } from "./lib/figma-tokens.mjs";

const figma = JSON.parse(readFileSync("tokens/figma-color.json", "utf8"));
const tokens = JSON.parse(readFileSync("tokens/ama-tokens.json", "utf8"));
const { differ, onlyFigma, onlyTokens } = compareFigma(figma.variables, tokens);

for (const d of differ) console.error(`${d.mode}: ${d.token} is ${d.tokens} in ama-ui, ${d.figma} in Figma (${d.figmaName})`);
for (const n of onlyFigma) console.error(`Figma ${n} (${figmaToToken(n)}) has no semantic token`);
for (const k of onlyTokens) console.error(`token ${k} has no Figma colour`);
const problems = differ.length + onlyFigma.length + onlyTokens.length;
if (problems) {
  console.error(`\n${problems} difference(s) between Figma (exported ${figma.exported}) and tokens/ama-tokens.json.`);
  process.exit(1);
}
console.log(`Figma Color collection (exported ${figma.exported}) matches the tokens: ${Object.keys(figma.variables).length} colours, light and dark.`);
