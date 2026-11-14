import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { VisibilityTag } from "@/components/patterns/visibility-tag";
import { VisibilityToggle } from "@/components/patterns/visibility-toggle";
import { ActivityTabs } from "@/components/patterns/activity-tabs";
import { ActivityLogLine } from "@/components/patterns/activity-log-line";
import { ActivityComment, ActivityMention } from "@/components/patterns/activity-comment";
import { ActivityComposer } from "@/components/patterns/activity-composer";
import { RaisedItem } from "@/components/patterns/raised-item";

describe("VisibilityTag", () => {
  it("names the visibility in words", () => {
    render(<VisibilityTag visibility="external" />);
    expect(screen.getByText("External")).toBeInTheDocument();
  });
  it("is a menu button with menu", async () => {
    const onClick = vi.fn();
    render(<VisibilityTag visibility="internal" menu onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Internal" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("VisibilityToggle", () => {
  it("marks one segment and reports changes", async () => {
    const onChange = vi.fn();
    render(<VisibilityToggle value="internal" onChange={onChange} />);
    expect(screen.getByRole("radio", { name: "Internal" })).toHaveAttribute("aria-checked", "true");
    await userEvent.click(screen.getByRole("radio", { name: "External" }));
    expect(onChange).toHaveBeenCalledWith("external");
  });
});

describe("ActivityTabs", () => {
  it("staff tabs", () => {
    render(<ActivityTabs counts={{ comments: { count: 3 }, mentions: { unread: true } }} />);
    expect(screen.getAllByRole("tab").map((t) => t.textContent?.replace(/\d+$|, unread$/, "").trim())).toEqual([
      "All", "Mentions", "Comments", "Alerts", "Log",
    ]);
    expect(screen.getByRole("tab", { name: /Comments 3/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Mentions.*unread/ })).toBeInTheDocument();
  });
  it("builder tabs and touch height", () => {
    render(<ActivityTabs audience="builder" size="touch" />);
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["All", "Raised", "Comments", "Updates"]);
    expect(screen.getByRole("tab", { name: "All" })).toHaveClass("h-12");
  });
  it("reports the chosen tab", async () => {
    const onValueChange = vi.fn();
    render(<ActivityTabs onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Log" }));
    expect(onValueChange).toHaveBeenCalledWith("log");
  });
});

describe("ActivityLogLine", () => {
  it("shows the sentence, who and when", () => {
    render(
      <ActivityLogLine who="Sam" when="2h ago">
        Status set to <strong>Poured</strong>
      </ActivityLogLine>
    );
    expect(screen.getByText(/Status set to/)).toHaveTextContent("Poured · Sam · 2h ago");
    expect(screen.getByText("Internal")).toBeInTheDocument();
  });
});

describe("ActivityComment", () => {
  const photos = Array.from({ length: 6 }, (_, i) => ({ src: `/p${i}.jpg`, alt: `Photo ${i}` }));
  it("shows the author, mention and unread", () => {
    render(
      <ActivityComment author="Alex" initials="AL" age="2h" unread>
        Check with <ActivityMention>@Sam</ActivityMention>
      </ActivityComment>
    );
    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("@Sam")).toBeInTheDocument();
    expect(screen.getByText(/Unread/)).toBeInTheDocument();
  });
  it("caps the photo grid with +N", () => {
    render(<ActivityComment author="A" initials="A" age="1h" photos={photos} maxPhotos={4}>x</ActivityComment>);
    expect(screen.getAllByRole("img", { hidden: true }).filter((i) => i.tagName === "IMG")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "2 more photos" })).toHaveTextContent("+2");
  });
  it("replies and reply summary", async () => {
    const onReply = vi.fn();
    render(
      <ActivityComment author="A" initials="A" age="1h" onReply={onReply} replySummary="1 reply · last 5m ago">
        Parent
        <ActivityComment author="B" initials="B" age="5m">Child</ActivityComment>
      </ActivityComment>
    );
    await userEvent.click(screen.getByRole("button", { name: "Reply" }));
    expect(onReply).toHaveBeenCalled();
    expect(screen.getByText("1 reply · last 5m ago")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});

describe("ActivityComposer", () => {
  it("internal mode", async () => {
    const onSend = vi.fn();
    render(<ActivityComposer postTo={["L2-P005"]} postToValue="L2-P005" onSend={onSend} onAddPhoto={() => {}} />);
    expect(screen.getByPlaceholderText("Comment internally, @ to mention")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Visibility" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalled();
  });
  it("external mode sends to the builder", () => {
    render(<ActivityComposer mode="external" />);
    expect(screen.getByPlaceholderText("Comment externally, @ to mention")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send to builder" })).toBeInTheDocument();
  });
  it("no toggle has no visibility choice", () => {
    render(<ActivityComposer mode="no-toggle" />);
    expect(screen.queryByRole("radiogroup")).toBeNull();
  });
  it.each([
    ["comment", "Comment, @ to mention", "Send"],
    ["change-request", "Describe the change you need", "Raise request"],
    ["defect", "Describe the defect", "Raise defect"],
    ["issue", "Describe the issue", "Raise issue"],
  ] as const)("builder %s", (postType, placeholder, send) => {
    render(<ActivityComposer mode="builder" postType={postType} />);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: send })).toBeInTheDocument();
  });
  it("attached photos can be removed", async () => {
    const onRemovePhoto = vi.fn();
    render(<ActivityComposer photos={[{ src: "/a.jpg" }]} onRemovePhoto={onRemovePhoto} />);
    await userEvent.click(within(screen.getByRole("list", { name: "Attached photos" })).getByRole("button", { name: "Remove photo" }));
    expect(onRemovePhoto).toHaveBeenCalledWith(0);
  });
  it("reply drops the pickers", () => {
    render(<ActivityComposer reply postTo={["L2-P005"]} />);
    expect(screen.queryByRole("radiogroup")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});

describe("RaisedItem", () => {
  it("reads kind, reference and state", () => {
    render(<RaisedItem kind="defect" state="open" reference="D-012" meta="Raised by Sam" />);
    expect(screen.getByText("Defect D-012 · Open")).toBeInTheDocument();
  });
  it("runs an action", async () => {
    const onAction = vi.fn();
    render(<RaisedItem kind="defect" state="open" reference="D-012" actions={[{ label: "Start work", onAction }, { label: "Dispute", onAction }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Start work" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Dispute" })).toBeInTheDocument();
  });
  it("links to Visibuild", () => {
    render(<RaisedItem kind="change-request" state="in-review" reference="CR-031" openInVisibuildHref="https://example.test/x" />);
    expect(screen.getByRole("link", { name: /Open in Visibuild/ })).toHaveAttribute("href", "https://example.test/x");
  });
});
