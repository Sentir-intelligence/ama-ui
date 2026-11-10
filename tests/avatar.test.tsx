import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("shows initials on accent when there is no photo", () => {
    render(
      <Avatar>
        <AvatarFallback>MT</AvatarFallback>
      </Avatar>
    );
    const initials = screen.getByText("MT");
    expect(initials.className).toMatch(/\bbg-accent\b/);
    expect(initials.className).toMatch(/\btext-primary\b/);
    expect(initials.className).toMatch(/\btext-label\b/);
  });

  it("keeps the initials while the photo has not loaded (jsdom never loads images)", () => {
    render(
      <Avatar>
        <AvatarImage src="/people/mt.jpg" />
        <AvatarFallback>MT</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("MT")).toBeInTheDocument();
  });

  it("is a 28px circle that className can resize", () => {
    const { container } = render(
      <Avatar className="size-16">
        <AvatarFallback>MT</AvatarFallback>
      </Avatar>
    );
    const root = container.firstElementChild!;
    expect(root.className).toMatch(/\brounded-full\b/);
    expect(root.className).toMatch(/\bsize-16\b/);
    expect(root.className).not.toMatch(/\bsize-7\b/);
  });
});
