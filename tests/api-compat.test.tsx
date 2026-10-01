import { render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// The re-skin must not change component APIs, so ama-os feature components port without edits.
describe("prototype API compatibility", () => {
  it.each(["default", "destructive", "outline", "secondary", "ghost", "link"] as const)("Button variant %s", (variant) => {
    render(<Button variant={variant}>Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it.each(["default", "sm", "lg", "icon"] as const)("Button size %s maps to a density-aware height", (size) => {
    expect(buttonVariants({ size })).toMatch(/\b(h-control(-sm|-lg)?|size-control)\b/);
  });

  it("Button asChild renders the child element", () => {
    render(<Button asChild><a href="/x">Link</a></Button>);
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute("href", "/x");
  });

  it("Badge and Input keep their props", () => {
    render(<><Badge variant="outline">3</Badge><Input placeholder="Search" aria-invalid /></>);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toHaveAttribute("aria-invalid", "true");
  });
});
