import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreviewBar } from "@/components/patterns/preview-bar";

describe("PreviewBar", () => {
  it("names the shell and the person on the info soft fill", () => {
    render(<PreviewBar shell="Builder" person="Ben Ryan" onExit={() => {}} />);
    const bar = screen.getByRole("status");
    expect(bar).toHaveTextContent("Preview · Builder · Ben Ryan");
    expect(bar.className).toMatch(/\bbg-info-soft\b/);
    expect(bar.className).toMatch(/\bborder-info-border\b/);
  });

  it("exits from a 44px link button", async () => {
    const onExit = vi.fn();
    render(<PreviewBar shell="Builder" person="Ben Ryan" onExit={onExit} />);
    const exit = screen.getByRole("button", { name: "Exit" });
    expect(exit.className).toMatch(/\bh-11\b/);
    await userEvent.click(exit);
    expect(onExit).toHaveBeenCalledOnce();
  });
});
