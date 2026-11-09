import { render } from "@testing-library/react";
import { StageCloud } from "@/components/icons/stage-cloud";

describe("StageCloud", () => {
  it("follows Lucide grammar: 24 grid, 2px round stroke in currentColor, decorative by default", () => {
    const { container } = render(<StageCloud />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("stroke-width", "2");
    expect(svg).toHaveAttribute("stroke-linecap", "round");
    expect(svg).toHaveAttribute("stroke-linejoin", "round");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("takes a size and becomes labelled when given aria-label", () => {
    const { container } = render(<StageCloud size={20} aria-label="Stage" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).not.toHaveAttribute("aria-hidden");
  });
});
