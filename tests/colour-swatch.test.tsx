import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColourSwatchGroup, ColourSwatch, SWATCH_COLOURS } from "@/components/ui/colour-swatch";

const NAMES = { 1: "Cobalt", 2: "Teal", 3: "Amber", 4: "Plum", 5: "Slate" } as const;

describe("ColourSwatch", () => {
  it("is a radio group of named colours, one selected at a time", async () => {
    render(
      <ColourSwatchGroup defaultValue="1" aria-label="Stage colour">
        {([1, 2, 3, 4, 5] as const).map((c) => (
          <ColourSwatch key={c} value={String(c)} colour={c} aria-label={NAMES[c]} />
        ))}
      </ColourSwatchGroup>
    );
    expect(screen.getByRole("radiogroup", { name: "Stage colour" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Cobalt" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "Plum" }));
    expect(screen.getByRole("radio", { name: "Plum" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Cobalt" })).not.toBeChecked();
  });

  it.each([1, 2, 3, 4, 5] as const)("colour %s draws the stage-cloud glyph in chart-%s with a ring when selected", (c) => {
    render(
      <ColourSwatchGroup>
        <ColourSwatch value="x" colour={c} aria-label="Colour" />
      </ColourSwatchGroup>
    );
    const swatch = screen.getByRole("radio", { name: "Colour" });
    expect(swatch.className).toContain(SWATCH_COLOURS[c]);
    expect(swatch.className).toContain("data-[state=checked]:border-ring");
    expect(swatch.className).toMatch(/\bsize-7\b/);
    const glyph = swatch.querySelector("svg")!;
    expect(glyph).toHaveAttribute("stroke", "currentColor");
    expect(glyph).toHaveAttribute("width", "20");
  });
});
