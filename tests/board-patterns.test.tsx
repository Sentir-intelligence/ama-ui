import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileText } from "lucide-react";
import { CardActionBar } from "@/components/patterns/card-action-bar";
import { CommentBox } from "@/components/patterns/comment-box";
import { IconButton } from "@/components/patterns/icon-button";
import { QaCheckRow } from "@/components/patterns/qa-check-row";
import { ViewHeader } from "@/components/patterns/view-header";
import { ViewTab } from "@/components/patterns/view-tab";
import { ViewToolbar } from "@/components/patterns/view-toolbar";

describe("IconButton", () => {
  it("is named by its label and reports a press", async () => {
    const onClick = vi.fn();
    render(<IconButton icon={FileText} label="Drawing" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Drawing" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("marks the open state and can be disabled", () => {
    render(<IconButton icon={FileText} label="Columns" open disabled />);
    const b = screen.getByRole("button", { name: "Columns" });
    expect(b).toHaveAttribute("data-state", "open");
    expect(b).toBeDisabled();
  });
});

describe("QaCheckRow", () => {
  it("shows who and when for done and failed, and the Next tag for next", () => {
    const { rerender } = render(<QaCheckRow state="done" label="1. Shop Drawing" meta="Tom B · 09 Oct" />);
    expect(screen.getByText("Tom B · 09 Oct")).toBeInTheDocument();
    rerender(<QaCheckRow state="next" label="2. Mesh" meta="ignored" />);
    expect(screen.getByText("Next", { selector: "span.rounded-sm" })).toBeInTheDocument();
    expect(screen.queryByText("ignored")).toBeNull();
  });
  it("gives the state to screen readers", () => {
    render(<QaCheckRow state="failed" label="4. Strip" />);
    expect(screen.getByText(/Failed:/)).toBeInTheDocument();
  });
});

describe("ViewTab", () => {
  it("marks the active tab and closes a preview tab", async () => {
    const onClose = vi.fn();
    render(<ViewTab label="Stage 3" kind="preview" active onClose={onClose} />);
    expect(screen.getByRole("button", { name: "Stage 3" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "Close Stage 3" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
  it("has no close button on a saved tab", () => {
    render(<ViewTab label="Stage 3" />);
    expect(screen.queryByRole("button", { name: /Close/ })).toBeNull();
  });
});

describe("CommentBox", () => {
  const setup = (over = {}) => {
    const props = { value: "", onChange: vi.fn(), onSubmit: vi.fn(), onCancel: vi.fn(), ...over };
    render(<CommentBox {...props} />);
    return props;
  };
  it("posts on Enter, not on Shift+Enter, and cancels on Escape", async () => {
    const p = setup({ value: "Check the voids" });
    const box = screen.getByRole("textbox");
    await userEvent.type(box, "{Shift>}{Enter}{/Shift}");
    expect(p.onSubmit).not.toHaveBeenCalled();
    await userEvent.type(box, "{Enter}");
    expect(p.onSubmit).toHaveBeenCalledOnce();
    await userEvent.type(box, "{Escape}");
    expect(p.onCancel).toHaveBeenCalledOnce();
  });
  it("does not post an empty comment", async () => {
    const p = setup();
    await userEvent.type(screen.getByRole("textbox"), "{Enter}");
    expect(p.onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();
  });
  it("shows an @mention in primary", () => {
    const { container } = render(<CommentBox value="Check with @Tom B" onChange={() => {}} onSubmit={() => {}} onCancel={() => {}} />);
    expect(container.querySelector("span.text-primary")?.textContent).toBe("@Tom B");
  });
  it("inline shows its buttons only while editing", async () => {
    render(<CommentBox variant="inline" value="" onChange={() => {}} onSubmit={() => {}} onCancel={() => {}} submitLabel="Save" />);
    expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
    await userEvent.click(screen.getByRole("textbox"));
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

describe("ViewHeader", () => {
  it("shows an action only when its handler is given", () => {
    const { rerender } = render(<ViewHeader title="Stage 3" onPin={() => {}} />);
    expect(screen.getByRole("button", { name: "Pin view" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
    rerender(<ViewHeader title="Stage 3" onDelete={() => {}} />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
  it("offers the empty description to edit", async () => {
    const onEdit = vi.fn();
    render(<ViewHeader title="Stage 3" onEditDescription={onEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Add a description…" }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});

describe("ViewToolbar", () => {
  it("reports search, shows the filter count and hides Add element without a handler", async () => {
    const onSearch = vi.fn();
    render(<ViewToolbar search="" onSearchChange={onSearch} count="9 of 9" filterCount={2} />);
    await userEvent.type(screen.getByRole("searchbox"), "L2");
    expect(onSearch).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Filters · 2" })).toBeInTheDocument();
    expect(screen.getByText("9 of 9")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add element" })).toBeNull();
  });
  it("disables undo and redo with no handler or when they cannot run", () => {
    render(<ViewToolbar search="" onSearchChange={() => {}} onUndo={() => {}} canUndo={false} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled();
  });
});

describe("CardActionBar", () => {
  it("shows only the slots it is given and shows unread, mention and the QA fraction", async () => {
    const onQa = vi.fn();
    render(<CardActionBar onActivity={() => {}} activity={{ count: 3, unread: true, mention: true }} onQa={onQa} qa={{ done: 6, total: 24, failed: 1 }} />);
    expect(screen.queryByRole("button", { name: /Drawing/ })).toBeNull();
    expect(screen.getByText("Unread")).toBeInTheDocument();
    expect(screen.getByText("You are mentioned")).toBeInTheDocument();
    expect(screen.getByText("6/24")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /QA/ }));
    expect(onQa).toHaveBeenCalledOnce();
  });
});
