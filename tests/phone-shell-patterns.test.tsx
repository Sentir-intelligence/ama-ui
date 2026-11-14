import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { House } from "lucide-react";
import { PhoneHeader } from "@/components/patterns/phone-header";
import { PhoneTabBar } from "@/components/patterns/phone-tab-bar";
import { PhoneTabBarItem } from "@/components/patterns/phone-tab-bar-item";
import { PhoneScanButton } from "@/components/patterns/phone-scan-button";
import { PhonePanelRow } from "@/components/patterns/phone-panel-row";

describe("PhoneHeader", () => {
  it("shows shop number, status and line, and sends each action", async () => {
    const [onBack, onFind, onMenu] = [vi.fn(), vi.fn(), vi.fn()];
    render(<PhoneHeader shopNumber="L2-P005" status="scheduled" line="Jam Factory · IFC Rev C" onBack={onBack} onFind={onFind} onMenu={onMenu} />);
    expect(screen.getByRole("heading", { name: "L2-P005" })).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Jam Factory · IFC Rev C")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    await userEvent.click(screen.getByRole("button", { name: "Find panel" }));
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect([onBack, onFind, onMenu].every((f) => f.mock.calls.length === 1)).toBe(true);
  });
});

describe("PhoneTabBarItem", () => {
  it("marks active and unread", () => {
    render(<PhoneTabBarItem icon={House} label="Overview" active unread />);
    const t = screen.getByRole("tab", { name: /Overview/ });
    expect(t).toHaveAttribute("aria-selected", "true");
    expect(t).toHaveTextContent("unread");
  });
});

describe("PhoneScanButton", () => {
  it("is a Scan button", async () => {
    const onClick = vi.fn();
    render(<PhoneScanButton onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Scan" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("PhoneTabBar", () => {
  it("staff: Overview, Activity, Scan, QA, More", () => {
    render(<PhoneTabBar active="overview" />);
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Overview", "Activity", "QA", "More"]);
    expect(screen.getByRole("button", { name: "Scan" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  });
  it("builder swaps QA for Files", () => {
    render(<PhoneTabBar audience="builder" />);
    expect(screen.queryByRole("tab", { name: "QA" })).toBeNull();
    expect(screen.getByRole("tab", { name: "Files" })).toBeInTheDocument();
  });
  it("reports the tab and scan", async () => {
    const [onSelect, onScan] = [vi.fn(), vi.fn()];
    render(<PhoneTabBar onSelect={onSelect} onScan={onScan} />);
    await userEvent.click(screen.getByRole("tab", { name: "Activity" }));
    await userEvent.click(screen.getByRole("button", { name: "Scan" }));
    expect(onSelect).toHaveBeenCalledWith("activity");
    expect(onScan).toHaveBeenCalled();
  });
});

describe("PhonePanelRow", () => {
  it("opens the panel from the whole row", async () => {
    const onSelect = vi.fn();
    render(<PhonePanelRow shopNumber="L2-P006" meta="Stage 3 · Wall panel" status="scheduled" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /L2-P006/ }));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });
});
