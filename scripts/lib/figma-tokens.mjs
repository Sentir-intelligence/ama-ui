// Figma Color collection vs the semantic tokens. Pure functions, so tests can pass their own data.

/** Figma variable name to semantic token name. */
export function figmaToToken(name) {
  if (name === "sidebar/default") return "sidebar";
  return name.replace(/^feedback\//, "").replace(/\/default$/, "").replaceAll("/", "-");
}

function resolveIn(tokens, value, seen = []) {
  const m = typeof value === "string" && value.match(/^\{(.+)\}$/);
  if (!m) return value;
  if (seen.includes(m[1])) throw new Error(`Circular token reference: ${m[1]}`);
  const node = m[1].split(".").reduce((n, k) => n?.[k], tokens);
  if (!node) throw new Error(`Unknown token reference {${m[1]}}`);
  return resolveIn(tokens, node.$value, [...seen, m[1]]);
}

/** The semantic colours of one mode ("light" or "dark"), resolved to upper-case hex. */
export function semanticColours(tokens, mode) {
  const out = {};
  for (const [key, node] of Object.entries(tokens.semantic[mode])) {
    if (key.startsWith("$") || !node || node.$type !== "color") continue;
    out[key] = String(resolveIn(tokens, node.$value)).toUpperCase();
  }
  return out;
}

/**
 * Every difference between the Figma export and the tokens, in both modes. A Figma variable
 * marked deprecated (its description says so) is listed in `deprecated` and not compared: it is
 * on its way out of the library, and the tokens may already have dropped it.
 */
export function compareFigma(figmaVariables, tokens) {
  const modes = { light: "Light", dark: "Dark" };
  const semantic = Object.fromEntries(Object.keys(modes).map((m) => [m, semanticColours(tokens, m)]));
  const differ = [];
  const onlyFigma = [];
  const deprecated = [];
  const mapped = new Set();
  for (const [name, values] of Object.entries(figmaVariables)) {
    const token = figmaToToken(name);
    if (values.deprecated) {
      deprecated.push(name);
      if (token in semantic.light) mapped.add(token);
      continue;
    }
    if (!(token in semantic.light)) { onlyFigma.push(name); continue; }
    mapped.add(token);
    for (const [mode, figmaMode] of Object.entries(modes)) {
      const figma = String(values[figmaMode]).toUpperCase();
      if (semantic[mode][token] !== figma) {
        differ.push({ mode, token, figmaName: name, figma, tokens: semantic[mode][token] });
      }
    }
  }
  const onlyTokens = Object.keys(semantic.light).filter((k) => !mapped.has(k));
  return { differ, onlyFigma, onlyTokens, deprecated };
}
