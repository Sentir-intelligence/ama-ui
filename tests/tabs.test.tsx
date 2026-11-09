import type * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const renderTabs = () =>
  render(
    <Tabs defaultValue="overview">
      <TabsList aria-label="Element">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity" count={3}>
          Activity
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
    </Tabs>
  );

const renderTrigger = (props: Partial<React.ComponentProps<typeof TabsTrigger>>) =>
  render(
    <Tabs defaultValue="comments">
      <TabsList>
        <TabsTrigger value="comments" {...props}>
          Comments
        </TabsTrigger>
      </TabsList>
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

  it("shows no extras by default", () => {
    const { container } = renderTrigger({});
    expect(container.querySelector("[data-slot^='tabs-']")).toBeNull();
    expect(screen.getByRole("tab")).toHaveAccessibleName("Comments");
  });

  it("count shows after the label, including 0", () => {
    const { container } = renderTrigger({ count: 0 });
    expect(container.querySelector("[data-slot='tabs-count']")).toHaveTextContent("0");
    expect(screen.getByRole("tab")).toHaveAccessibleName("Comments 0");
  });

  it("mention and unread are primary markers with screen-reader text, in Figma order", () => {
    const { container } = renderTrigger({ count: 3, mention: true, unread: true });
    const slots = [...container.querySelectorAll("[data-slot^='tabs-']")].map((el) => el.getAttribute("data-slot"));
    expect(slots).toEqual(["tabs-count", "tabs-mention", "tabs-unread"]);
    expect(container.querySelector("[data-slot='tabs-mention'] [aria-hidden]")).toHaveTextContent("@");
    expect(container.querySelector("[data-slot='tabs-mention']")!.className).toMatch(/\btext-primary\b/);
    expect(container.querySelector("[data-slot='tabs-unread'] [aria-hidden]")!.className).toMatch(/\bsize-1\.5\b.*\bbg-primary\b/);
    expect(screen.getByRole("tab")).toHaveAccessibleName("Comments 3, mentioned, unread");
  });
});
