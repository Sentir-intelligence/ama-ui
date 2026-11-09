import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const renderTabs = () =>
  render(
    <Tabs defaultValue="overview">
      <TabsList aria-label="Element">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">
          Activity <span className="text-table-cell text-muted-foreground">3</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
    </Tabs>
  );

describe("Tabs", () => {
  it("switches panels and marks the active tab", async () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Overview panel")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Activity 3" }));
    expect(screen.getByRole("tab", { name: "Activity 3" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Activity panel")).toBeInTheDocument();
  });

  it("active state is a label weight plus a primary indicator, never background alone", () => {
    renderTabs();
    const cls = screen.getByRole("tab", { name: "Overview" }).className;
    expect(cls).toContain("data-[state=active]:after:bg-primary");
    expect(cls).toContain("data-[state=active]:text-body-strong");
    expect(cls).not.toMatch(/data-\[state=active\]:bg-/);
  });

  it("height follows density with a 40px floor", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Overview" }).className).toMatch(/\bh-row\b.*\bmin-h-10\b/);
  });
});
