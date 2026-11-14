import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MetricCard } from "@/components/patterns/metric-card";
import { PhotoTile } from "@/components/patterns/photo-tile";
import { QaDefect } from "@/components/patterns/qa-defect";
import { QaRing } from "@/components/patterns/qa-ring";

describe("PhotoTile", () => {
  it("draws a photo cover-cropped, 56 by default and 72 on request", () => {
    const { container, rerender } = render(<PhotoTile src="/p.jpg" alt="Plate" />);
    expect(screen.getByAltText("Plate").className).toMatch(/\bobject-cover\b/);
    expect(container.firstElementChild?.className).toMatch(/\bsize-14\b/);
    rerender(<PhotoTile src="/p.jpg" alt="Plate" size={72} />);
    expect(container.firstElementChild?.className).toMatch(/\bsize-18\b/);
  });

  it("Add is a dashed tile that opens the picker", async () => {
    const onSelect = vi.fn();
    render(<PhotoTile state="add" onSelect={onSelect} />);
    const tile = screen.getByRole("button", { name: "Add photo" });
    expect(tile.className).toMatch(/\bborder-dashed\b/);
    await userEvent.click(tile);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("shows upload progress and the not synced badge", () => {
    const { rerender } = render(<PhotoTile state="uploading" progress={40} />);
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toHaveAttribute("aria-valuenow", "40");
    rerender(<PhotoTile state="not-synced" />);
    expect(screen.getByRole("img", { name: "Not synced" })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("is not interactive without onSelect", () => {
    render(<PhotoTile src="/p.jpg" alt="Plate" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("QaRing", () => {
  it("says what it shows", () => {
    const { rerender } = render(<QaRing done={13} total={24} />);
    expect(screen.getByRole("img", { name: "13 of 24 checks done" })).toBeInTheDocument();
    rerender(<QaRing done={6} total={24} failed={1} />);
    expect(screen.getByRole("img", { name: "6 of 24 checks done, 1 failed" })).toBeInTheDocument();
    rerender(<QaRing done={0} total={0} scheduled={false} />);
    expect(screen.getByRole("img", { name: "QA not scheduled" })).toBeInTheDocument();
  });

  it("sizes: 16, 24 and 64", () => {
    const { rerender } = render(<QaRing done={1} total={2} />);
    expect(screen.getByRole("img").getAttribute("class")).toMatch(/\bsize-4\b/);
    rerender(<QaRing done={1} total={2} size="touch" />);
    expect(screen.getByRole("img").getAttribute("class")).toMatch(/\bsize-6\b/);
    rerender(<QaRing done={1} total={2} size="large" />);
    expect(screen.getByRole("img").getAttribute("class")).toMatch(/\bsize-16\b/);
  });

  it("draws the done arc in primary, a failed arc and dot in destructive, a tick when complete", () => {
    const { container, rerender } = render(<QaRing done={6} total={24} failed={1} />);
    expect(container.querySelector("circle.stroke-primary")).not.toBeNull();
    expect(container.querySelector("circle.stroke-destructive")).not.toBeNull();
    expect(container.querySelector("circle.fill-destructive")).not.toBeNull();
    expect(container.querySelector("path")).toBeNull();
    rerender(<QaRing done={24} total={24} />);
    expect(container.querySelector("path.stroke-primary")).not.toBeNull();
    expect(container.querySelector("circle.stroke-destructive")).toBeNull();
  });

  it("draws a dashed grey ring when not scheduled", () => {
    const { container } = render(<QaRing done={0} total={24} scheduled={false} />);
    const track = container.querySelector("circle");
    expect(track?.getAttribute("stroke-dasharray")).toBeTruthy();
    expect(container.querySelector("circle.stroke-primary")).toBeNull();
  });
});

describe("MetricCard", () => {
  it("draws label, value and sub", () => {
    render(<MetricCard label="Open defects" value={1} sub="Cast in Plates" />);
    expect(screen.getByText("Open defects").className).toMatch(/\btext-label\b/);
    expect(screen.getByText("1").className).toMatch(/\btext-title\b/);
    expect(screen.getByText("Cast in Plates")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("draws a bar when progress is given, clamped to 0 to 100", () => {
    const { rerender } = render(<MetricCard label="QA done" value="13" progress={13 / 24} />);
    expect(screen.getByRole("progressbar", { name: "QA done" })).toHaveAttribute("aria-valuenow", "54");
    rerender(<MetricCard label="QA done" value="30" progress={2} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});

describe("QaDefect", () => {
  const photos = [{ src: "/a.jpg", alt: "Defect" }];

  it("open: outline Close defect and an Add tile for the fix", async () => {
    const onCloseDefect = vi.fn();
    const onAddFix = vi.fn();
    render(<QaDefect note="Plates 50 mm out" defectPhotos={photos} onCloseDefect={onCloseDefect} onAddFix={onAddFix} />);
    const close = screen.getByRole("button", { name: "Close defect" });
    expect(close.className).toMatch(/\bborder\b/);
    expect(close.className).not.toMatch(/\bbg-primary\b/);
    await userEvent.click(close);
    await userEvent.click(screen.getByRole("button", { name: "Add photo" }));
    expect(onCloseDefect).toHaveBeenCalledOnce();
    expect(onAddFix).toHaveBeenCalledOnce();
  });

  it("fix added: Close defect turns primary and stays tappable", () => {
    render(<QaDefect state="fix-added" note="Plates 50 mm out" defectPhotos={photos} fixPhotos={[{ src: "/f.jpg", alt: "Fix" }]} />);
    expect(screen.getByRole("button", { name: "Close defect" }).className).toMatch(/\bbg-primary\b/);
    expect(screen.getByRole("button", { name: "Close defect" })).toBeEnabled();
  });

  it("closed: muted note, no Close defect and no Add tile", () => {
    render(<QaDefect state="closed" note="Plates 50 mm out" defectPhotos={photos} fixPhotos={[{ src: "/f.jpg", alt: "Fix" }]} />);
    expect(screen.getByText("Plates 50 mm out").className).toMatch(/\btext-muted-foreground\b/);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
