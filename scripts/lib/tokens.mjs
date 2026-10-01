// Shared helpers: load the DTCG source, walk it, resolve {aliases}.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const SOURCE = fileURLToPath(new URL("../../tokens/ama-tokens.json", import.meta.url));
export const T = JSON.parse(readFileSync(SOURCE, "utf8"));

export function get(path) {
  return path.split(".").reduce((node, key) => {
    if (node == null || !(key in node)) throw new Error(`Unknown token reference {${path}}`);
    return node[key];
  }, T);
}

export function resolve(value, seen = []) {
  const m = typeof value === "string" && value.match(/^\{(.+)\}$/);
  if (!m) return value;
  if (seen.includes(m[1])) throw new Error(`Circular token reference: ${[...seen, m[1]].join(" -> ")}`);
  return resolve(get(m[1]).$value, [...seen, m[1]]);
}

export function* walk(node, path = []) {
  if (node && typeof node === "object" && "$value" in node) { yield [path, node]; return; }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) yield* walk(v, [...path, k]);
  }
}

export const semantic = (mode) =>
  Object.fromEntries(Object.entries(T.semantic[mode]).map(([k, t]) => [k, resolve(t.$value)]));
