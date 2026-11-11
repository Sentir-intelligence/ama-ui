import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Clock, LayoutGrid, Menu, ScanLine, Table2 } from "lucide-react";
import { ShellActivityItem } from "@/components/patterns/shell-activity-item";
import { ShellAvatar } from "@/components/patterns/shell-avatar";
import { ShellChromeButton } from "@/components/patterns/shell-chrome-button";
import { ShellMenuTab } from "@/components/patterns/shell-menu-tab";
import { ShellPanelRow } from "@/components/patterns/shell-panel-row";
import { ShellRailItem } from "@/components/patterns/shell-rail-item";

describe("ShellRailItem", () => {
  it("is a 72 x 56 chrome button with the caption", () => {
    render(<ShellRailItem icon={LayoutGrid} label="Views" />);
    const item = screen.getByRole("button", { name: "Views" });
    expect(item.className).toMatch(/\bw-18\b/);
    expect(item.className).toMatch(/\bh-14\b/);
    expect(item).toHaveAttribute("data-surface", "chrome");
    expect(item).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Views").className).toMatch(/\btext-chrome-muted\b/);
  });

  it("marks the current page with the signal indicator and aria-current", () => {
    const { container } = render(<ShellRailItem icon={Clock} label="Activity" active />);
    expect(screen.getByRole("button", { name: "Activity" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Activity").className).toMatch(/\btext-chrome-foreground\b/);
    expect(container.querySelector(".bg-signal")).not.toBeNull();
  });

  it("wraps the app's link with asChild", () => {
    render(
      <ShellRailItem asChild icon={LayoutGrid} label="Views" active>
        <a href="/views" />
      </ShellRailItem>
    );
    const link = screen.getByRole("link", { name: "Views" });
    expect(link).toHaveAttribute("href", "/views");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("ShellPanelRow", () => {
  it("opens on select and is the density row height", async () => {
    const onSelect = vi.fn();
    const { container } = render(<ShellPanelRow icon={Table2} label="WIP" onSelect={onSelect} />);
    expect((container.firstElementChild as HTMLElement).className).toMatch(/\bh-row\b/);
    await userEvent.click(screen.getByRole("button", { name: "WIP" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("fills the selected colour with the left indicator when active", () => {
    const { container } = render(<ShellPanelRow label="WIP" active />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toMatch(/\bbg-row-selected\b/);
    expect(row.className).toMatch(/\bindicator-left\b/);
    expect(screen.getByRole("button", { name: "WIP" })).toHaveAttribute("aria-current", "page");
  });

  it("pins from its own button without opening the row", async () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<ShellPanelRow label="WIP" onSelect={onSelect} pin={{ pinned: false, onToggle }} />);
    const pin = screen.getByRole("button", { name: "Pin WIP" });
    expect(pin).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(pin);
    expect(onToggle).toHaveBeenCalledOnce();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("names the pin Unpin when pinned, and shows meta", () => {
    render(<ShellPanelRow label="Stage 17" meta="3/12" pin={{ pinned: true, onToggle: () => {} }} />);
    expect(screen.getByRole("button", { name: "Unpin Stage 17" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("3/12")).toBeInTheDocument();
  });

  it("wraps the app's link with asChild", () => {
    render(
      <ShellPanelRow asChild label="Users and access">
        <a href="/settings/users" />
      </ShellPanelRow>
    );
    expect(screen.getByRole("link", { name: "Users and access" })).toHaveAttribute("href", "/settings/users");
  });
});

describe("ShellChromeButton", () => {
  it("is a 44px icon button named by its label", async () => {
    const onClick = vi.fn();
    render(<ShellChromeButton icon={Menu} label="Open menu" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button.className).toMatch(/\bh-11\b/);
    expect(button.className).toMatch(/\bw-11\b/);
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows the label in the filled pill", () => {
    render(<ShellChromeButton icon={ScanLine} label="Scan" showLabel />);
    const button = screen.getByRole("button", { name: "Scan" });
    expect(button).not.toHaveAttribute("aria-label");
    expect(button.className).toMatch(/\bbg-chrome-hover\b/);
  });
});

describe("ShellAvatar", () => {
  it("is a 44px account button with the first letter", () => {
    render(<ShellAvatar name="jacob@sentir.com.au" />);
    const button = screen.getByRole("button", { name: "Account" });
    expect(button.className).toMatch(/\bsize-11\b/);
    expect(button).toHaveTextContent("J");
  });
});

describe("ShellMenuTab", () => {
  it("is a tab, selected when active", () => {
    render(
      <div role="tablist">
        <ShellMenuTab icon={LayoutGrid} label="Views" active />
        <ShellMenuTab icon={Clock} label="Activity" />
      </div>
    );
    expect(screen.getByRole("tab", { name: "Views" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "false");
  });
});

describe("ShellActivityItem", () => {
  it("shows the comment, where and how long ago", () => {
    render(<ShellActivityItem comment="Comment: Split from L2-2." trail="AMA237 · A-2P068" age="3d" />);
    expect(screen.getByText("Comment: Split from L2-2.")).toBeInTheDocument();
    expect(screen.getByText("AMA237 · A-2P068")).toBeInTheDocument();
    expect(screen.getByText("· 3d")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("opens the thread when it has onSelect", async () => {
    const onSelect = vi.fn();
    render(<ShellActivityItem comment="Hi" trail="AMA237" age="1h" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
