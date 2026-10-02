import { readFileSync } from "node:fs";

// Guards the generated theme: the display roles must carry the display family, and the display font is Archivo Narrow.
const theme = readFileSync("registry/ama/styles/theme.css", "utf8");
const tokens = readFileSync("registry/ama/styles/tokens.css", "utf8");

describe("theme.css", () => {
  it("applies the display family to text-display and text-page-title", () => {
    expect(theme).toMatch(/\[class\*="text-display"\], \[class\*="text-page-title"\] \{ font-family: var\(--ama-font-display\); \}/);
  });
  it("uses Archivo Narrow as the display font", () => {
    expect(tokens).toMatch(/--ama-font-display: 'Archivo Narrow'/);
  });
  it("exposes the logo colour", () => {
    expect(theme).toMatch(/--color-logo: var\(--logo\);/);
  });
});
