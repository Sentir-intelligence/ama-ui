import { readFileSync } from "node:fs";
import { STATUS_KEYS } from "@/lib/status";

// Guards the generated chip CSS: reviewers required the swatch edge (3:1 boundary), no clipping under
// WCAG 1.4.12 text spacing, and a visible two-part shape in Windows high contrast.
const css = readFileSync("registry/ama/styles/status-chip.css", "utf8");
const chipRule = css.match(/\.status-chip \{[^}]*\}/)![0];

describe("status-chip.css", () => {
  it("draws the edge on every swatch", () => {
    expect(css).toMatch(/\.status-chip__swatch \{[^}]*box-shadow: inset 0 0 0 1px var\(--chip-edge\)/);
  });
  it.each(STATUS_KEYS)("%s sets swatch, ink and edge", (key) => {
    const rule = css.match(new RegExp(`\\.status-chip\\[data-status="${key}"\\] \\{[^}]*\\}`))![0];
    expect(rule).toMatch(/--chip-swatch:/);
    expect(rule).toMatch(/--chip-ink:/);
    expect(rule).toMatch(/--chip-edge:/);
  });
  it("never clips the label (no overflow hidden, does not shrink)", () => {
    expect(chipRule).not.toMatch(/overflow:\s*hidden/);
    expect(chipRule).toMatch(/flex: none/);
  });
  it("keeps the swatch outline in forced-colours mode", () => {
    expect(css).toMatch(/@media \(forced-colors: active\) \{ \.status-chip__swatch \{ border-inline-end: 1px solid CanvasText; \} \}/);
  });
});
