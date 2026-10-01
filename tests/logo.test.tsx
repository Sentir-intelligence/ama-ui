import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, mkdirSync } from "node:fs";
import { Logo } from "@/components/brand/logo";

describe("Logo", () => {
  it("is an accessible image named AMA Precast", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "AMA Precast" })).toBeInTheDocument();
  });

  it("uses token fills: brand on light, chrome-foreground when reversed", () => {
    const { container, rerender } = render(<Logo />);
    expect(container.querySelector("g")).toHaveClass("fill-brand");
    rerender(<Logo tone="reverse" />);
    expect(container.querySelector("g")).toHaveClass("fill-chrome-foreground");
  });

  it("mark variant drops PRECAST and the rule", () => {
    const { container } = render(<Logo variant="mark" />);
    expect(container.querySelectorAll("g")).toHaveLength(1);
  });

  it("writes a render fixture for visual review", () => {
    mkdirSync(".build", { recursive: true });
    const html = renderToStaticMarkup(
      <div className="flex flex-wrap gap-4 p-4">
        <div className="bg-background p-4"><Logo className="h-20" /></div>
        <div className="bg-chrome p-4"><Logo tone="reverse" className="h-20" /></div>
        <div data-surface="chrome" className="flex h-topbar items-center bg-chrome px-4"><Logo tone="reverse" variant="mark" className="h-6" /></div>
        <div className="dark bg-background p-4"><Logo className="h-20" /></div>
      </div>
    );
    writeFileSync(".build/logo-fixture.html", html);
  });
});
