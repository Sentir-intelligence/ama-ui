import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

describe("ToggleGroup", () => {
  it("single selection moves between peer options", async () => {
    render(
      <ToggleGroup type="single" defaultValue="shop" aria-label="Drawing">
        <ToggleGroupItem value="shop">Shop drawing</ToggleGroupItem>
        <ToggleGroupItem value="floor">Floor plan</ToggleGroupItem>
      </ToggleGroup>
    );
    const shop = screen.getByRole("radio", { name: "Shop drawing" });
    const floor = screen.getByRole("radio", { name: "Floor plan" });
    expect(shop).toHaveAttribute("data-state", "on");
    await userEvent.click(floor);
    expect(floor).toHaveAttribute("data-state", "on");
    expect(shop).toHaveAttribute("data-state", "off");
  });

  it("selected state is card fill plus border, with a density-aware height", () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    );
    const cls = screen.getByRole("radio", { name: "A" }).className;
    expect(cls).toContain("data-[state=on]:bg-card");
    expect(cls).toContain("data-[state=on]:border-border");
    expect(cls).toMatch(/\bh-control\b/);
  });
});
