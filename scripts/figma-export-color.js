// Run in the AMA UI Figma library (file 9BtnLlkTrWBscwvFV9DUQC), for example with the Figma MCP
// use_figma tool or the Scripter plugin. Read only. Returns the Color collection with both modes,
// aliases resolved to hex. Save the returned object (its "modes" and "variables") into
// tokens/figma-color.json with today's date in "exported", then run npm run tokens:figma.
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const col = cols.find((c) => c.name === "Color");
if (!col) return { error: "no Color collection" };
const hex = (c) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, "0").toUpperCase();
  const base = "#" + h(c.r) + h(c.g) + h(c.b);
  return c.a !== undefined && c.a < 1 ? base + h(c.a) : base;
};
async function resolve(value, modeName, depth = 0) {
  if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    const v = await figma.variables.getVariableByIdAsync(value.id);
    if (!v || depth > 8) return null;
    const vc = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
    const mode = vc.modes.find((m) => m.name === modeName) || vc.modes[0];
    return resolve(v.valuesByMode[mode.modeId], modeName, depth + 1);
  }
  if (value && typeof value === "object" && "r" in value) return hex(value);
  return value;
}
const variables = {};
for (const id of col.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v || v.resolvedType !== "COLOR") continue;
  const row = {};
  for (const m of col.modes) row[m.name] = await resolve(v.valuesByMode[m.modeId], m.name);
  // A deprecated variable keeps its description, so the check can list it without failing.
  if (/deprecated/i.test(v.description || "")) row.deprecated = v.description;
  variables[v.name] = row;
}
return { modes: col.modes.map((m) => m.name), variables };
