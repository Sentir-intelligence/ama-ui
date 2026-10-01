import { render, screen } from "@testing-library/react";
import { StatusChip, STATUS_ICONS } from "@/components/ui/status-chip";
import { STATUS, STATUS_KEYS } from "@/lib/status";

const pascal = (s: string) => s.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());

describe("StatusChip", () => {
  it("covers every status in the token source", () => {
    expect(Object.keys(STATUS_ICONS).sort()).toEqual([...STATUS_KEYS].sort());
  });

  it.each(STATUS_KEYS)("%s uses the icon named in the tokens", (key) => {
    expect(STATUS_ICONS[key].displayName).toBe(pascal(STATUS[key].icon));
  });

  it.each(STATUS_KEYS)("%s renders a decorative swatch with the icon, then the label", (key) => {
    const { container } = render(<StatusChip status={key} />);
    const chip = container.querySelector(".status-chip")!;
    expect(chip).toHaveAttribute("data-status", key);
    const swatch = chip.querySelector(".status-chip__swatch")!;
    expect(swatch).toHaveAttribute("aria-hidden", "true");
    expect(swatch.querySelector("svg")).toBeInTheDocument();
    expect(chip.querySelector(".status-chip__label")).toHaveTextContent(STATUS[key].label);
    expect(screen.getByText(STATUS[key].label)).toBeInTheDocument();
  });
});
