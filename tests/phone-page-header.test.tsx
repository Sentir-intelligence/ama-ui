import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Plus } from "lucide-react";
import { PhonePageHeader } from "@/components/patterns/phone-page-header";

describe("PhonePageHeader", () => {
  it("is a sticky 56px header with the title on one line", () => {
    const { container } = render(<PhonePageHeader title="Users and roles" />);
    const header = container.firstElementChild!;
    expect(header.tagName).toBe("HEADER");
    expect(header.className).toMatch(/\bsticky\b/);
    expect(header.className).toMatch(/\bh-14\b/);
    const title = screen.getByRole("heading", { name: "Users and roles" });
    expect(title.className).toMatch(/\btruncate\b/);
    expect(title.className).toMatch(/\btext-title\b/);
  });

  it("has no buttons without onBack or action", () => {
    render(<PhonePageHeader title="Settings" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("goes back from a 44px back button", async () => {
    const onBack = vi.fn();
    render(<PhonePageHeader title="Users and roles" onBack={onBack} />);
    const back = screen.getByRole("button", { name: "Back" });
    expect(back.className).toMatch(/\bsize-11\b/);
    await userEvent.click(back);
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("runs the one icon action, named by its label", async () => {
    const onClick = vi.fn();
    render(<PhonePageHeader title="People" action={{ icon: Plus, label: "Invite person", onClick }} />);
    await userEvent.click(screen.getByRole("button", { name: "Invite person" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
