import { render, screen } from "@testing-library/react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

describe("Tooltip", () => {
  it("renders inverse text on the floating layer and labels its trigger", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Rev B</TooltipTrigger>
          <TooltipContent>Shop drawing · Rev B · 02 Oct 2026</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("Shop drawing · Rev B · 02 Oct 2026");
    const content = document.querySelector("[data-side]")!;
    expect(content.className).toMatch(/\bz-110\b/);
    expect(content.className).toMatch(/\bbg-foreground\b/);
    expect(content.className).toMatch(/\btext-background\b/);
    expect(content.className).toMatch(/\btext-body-sm\b/);
    expect(screen.getByRole("button", { name: "Rev B" })).toHaveAttribute("aria-describedby");
  });
});
