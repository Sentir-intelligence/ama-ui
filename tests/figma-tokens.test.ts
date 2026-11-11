import { readFileSync } from "node:fs";
// @ts-expect-error plain .mjs helper with no type declarations
import { compareFigma, figmaToToken } from "../scripts/lib/figma-tokens.mjs";

const tokens = JSON.parse(readFileSync("tokens/ama-tokens.json", "utf8"));

describe("Figma Color collection vs tokens", () => {
  it("maps Figma names to token names", () => {
    expect(figmaToToken("status/ifa/swatch")).toBe("status-ifa-swatch");
    expect(figmaToToken("feedback/success/default")).toBe("success");
    expect(figmaToToken("feedback/success/soft-foreground")).toBe("success-soft-foreground");
    expect(figmaToToken("sidebar/default")).toBe("sidebar");
    expect(figmaToToken("chart/1")).toBe("chart-1");
    expect(figmaToToken("primary")).toBe("primary");
  });

  it("reports a value that differs, a colour Figma lacks and one the tokens lack", () => {
    const figma = {
      primary: { Light: "#4d60ba", Dark: "#000000" },
      "made-up": { Light: "#FFFFFF", Dark: "#FFFFFF" },
    };
    const { differ, onlyFigma, onlyTokens } = compareFigma(figma, tokens);
    expect(differ).toEqual([
      { mode: "dark", token: "primary", figmaName: "primary", figma: "#000000", tokens: "#8FA3ED" },
    ]);
    expect(onlyFigma).toEqual(["made-up"]);
    expect(onlyTokens).toContain("background");
    expect(onlyTokens).not.toContain("primary");
  });
});
