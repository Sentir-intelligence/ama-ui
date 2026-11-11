import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonRow, initialsOf } from "@/components/patterns/person-row";

describe("PersonRow", () => {
  it("draws the name, detail and role, with initials when there is no photo", () => {
    render(<PersonRow name="Ben Ryan" detail="ben@hutchinson.com.au · Hutchinson" role="Builder" />);
    expect(screen.getByText("Ben Ryan").className).toMatch(/\btext-body-strong\b/);
    expect(screen.getByText("ben@hutchinson.com.au · Hutchinson").className).toMatch(/\btext-caption\b/);
    expect(screen.getByText("Builder").className).toMatch(/\bbg-muted\b/);
    expect(screen.getByText("BR")).toBeInTheDocument();
    expect(screen.queryByText("Invited")).not.toBeInTheDocument();
  });

  it("shows Invited until the invite is accepted", () => {
    render(<PersonRow name="Ben Ryan" detail="ben@x.com" role="Builder" invited />);
    expect(screen.getByText("Invited")).toBeInTheDocument();
  });

  it("is one button that opens the person when onSelect is given", async () => {
    const onSelect = vi.fn();
    render(<PersonRow name="Ben Ryan" detail="ben@x.com" role="Builder" onSelect={onSelect} />);
    const row = screen.getByRole("button", { name: /Ben Ryan/ });
    expect(row.className).toMatch(/\bmin-h-16\b/);
    await userEvent.click(row);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("is not interactive without onSelect", () => {
    render(<PersonRow name="Ben Ryan" detail="ben@x.com" role="Builder" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("makes up to two initials from the name", () => {
    expect(initialsOf("Ben Ryan")).toBe("BR");
    expect(initialsOf("  maria de la cruz ")).toBe("MC");
    expect(initialsOf("Cher")).toBe("C");
    expect(initialsOf("")).toBe("?");
  });
});
