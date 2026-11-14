import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QaAnswer } from "@/components/patterns/qa-answer";
import { QaItem, type QaItemState, type QaItemView } from "@/components/patterns/qa-item";

const base = { label: "11. Cast in Plates", description: "Plates are the correct size", meta: "Tom B · 09 Oct", photos: 3, comments: 1 };

describe("QaAnswer", () => {
  it("offers Pass, Fail and N/A and sends the tapped one", async () => {
    const onChange = vi.fn();
    render(<QaAnswer onChange={onChange} />);
    expect(screen.getAllByRole("radio").map((r) => r.textContent)).toEqual(["Pass", "Fail", "N/A"]);
    await userEvent.click(screen.getByRole("radio", { name: "Fail" }));
    expect(onChange).toHaveBeenCalledWith("fail");
  });

  it("colours the chosen segment with its soft colour and nothing else", () => {
    const { rerender } = render(<QaAnswer value="pass" />);
    expect(screen.getByRole("radio", { name: "Pass" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Pass" }).className).toMatch(/\bbg-success-soft\b/);
    expect(screen.getByRole("radio", { name: "Fail" }).className).not.toMatch(/\bbg-destructive-soft\b/);
    rerender(<QaAnswer value="fail" />);
    expect(screen.getByRole("radio", { name: "Fail" }).className).toMatch(/\bbg-destructive-soft\b/);
    rerender(<QaAnswer value="na" />);
    expect(screen.getByRole("radio", { name: "N/A" }).className).toMatch(/\bbg-muted\b/);
  });

  it("is full width with 48px segments in touch size", () => {
    render(<QaAnswer size="touch" />);
    expect(screen.getByRole("radiogroup").className).toMatch(/\bw-full\b/);
    expect(screen.getByRole("radio", { name: "Pass" }).className).toMatch(/\bh-11\.5\b/);
  });

  it("sends nothing when disabled", async () => {
    const onChange = vi.fn();
    render(<QaAnswer onChange={onChange} disabled />);
    await userEvent.click(screen.getByRole("radio", { name: "Pass" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("QaItem", () => {
  it("answer view, open: Pass, Fail and N/A, no Reopen", async () => {
    const onAnswer = vi.fn();
    render(<QaItem {...base} onAnswer={onAnswer} />);
    expect(screen.getByText("11. Cast in Plates")).toBeInTheDocument();
    expect(screen.getByText("Tom B · 09 Oct")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reopen" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Pass" }));
    expect(onAnswer).toHaveBeenCalledWith("pass");
  });

  it.each([
    ["pass", "Pass"],
    ["fail", "Fail"],
    ["na", "N/A"],
  ] as const)("answer view, %s: shows the result and Reopen instead of the buttons", async (state, text) => {
    const onReopen = vi.fn();
    render(<QaItem {...base} state={state} onReopen={onReopen} />);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reopen" }));
    expect(onReopen).toHaveBeenCalledOnce();
  });

  it("review view is read only on desktop and touch", () => {
    for (const size of ["desktop", "touch"] as const) {
      const { unmount } = render(<QaItem {...base} view="review" state="pass" size={size} />);
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("review view words the result, with the open defect on Fail", () => {
    const { rerender } = render(<QaItem {...base} view="review" state="open" />);
    expect(screen.getByText("Open")).toBeInTheDocument();
    rerender(<QaItem {...base} view="review" state="fail" />);
    expect(screen.getByText("Fail · defect open")).toBeInTheDocument();
    rerender(<QaItem {...base} view="review" state="fail" defectOpen={false} />);
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("review view at touch size draws nothing for an open item and the result once answered", () => {
    const { rerender, container } = render(<QaItem {...base} view="review" state="open" size="touch" />);
    expect(container.querySelector("[data-state='open']")?.children).toHaveLength(2);
    rerender(<QaItem {...base} view="review" state="fail" size="touch" />);
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("builder view maps results to Planned, In progress and Complete and never says Failed", () => {
    const wording: Record<QaItemState, string> = { open: "Planned", fail: "In progress", pass: "Complete", na: "Complete" };
    for (const state of Object.keys(wording) as QaItemState[]) {
      const { unmount } = render(<QaItem {...base} view="builder" state={state} />);
      expect(screen.getByText(wording[state])).toBeInTheDocument();
      expect(screen.queryByText(/fail/i)).not.toBeInTheDocument();
      unmount();
    }
  });

  it("shows the photo and comment counts, and the cloud icon only when not synced", () => {
    const { rerender } = render(<QaItem {...base} />);
    expect(screen.getByText(/Photos/).parentElement).toHaveTextContent("3");
    expect(screen.getByText(/Comments/).parentElement).toHaveTextContent("1");
    expect(screen.queryByRole("img", { name: "Not synced" })).not.toBeInTheDocument();
    rerender(<QaItem {...base} notSynced />);
    expect(screen.getByRole("img", { name: "Not synced" })).toBeInTheDocument();
  });

  it("leaves the evidence group out when there are no counts", () => {
    render(<QaItem label="Cast in Plates" />);
    expect(screen.queryByText(/Photos/)).not.toBeInTheDocument();
  });

  it("touch size stacks the item as a card with the answer full width", () => {
    render(<QaItem {...base} size="touch" />);
    expect(screen.getByRole("radiogroup").className).toMatch(/\bw-full\b/);
    expect(document.querySelector("[data-size='touch']")?.className).toMatch(/\bflex-col\b/);
  });

  it("uses semantic colour classes only", () => {
    const views: QaItemView[] = ["answer", "review", "builder"];
    for (const view of views) {
      for (const state of ["open", "pass", "fail", "na"] as const) {
        const { container, unmount } = render(<QaItem {...base} view={view} state={state} notSynced />);
        expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}|rgb\(|hsl\(|oklch\(/i);
        unmount();
      }
    }
  });
});
