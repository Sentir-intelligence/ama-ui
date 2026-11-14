import { render, screen } from "@testing-library/react";
import { MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const renderSelect = (props: React.ComponentProps<typeof SelectTrigger> = {}) =>
  render(
    <Select defaultValue="comment">
      <SelectTrigger aria-label="Post type" {...props}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="comment">Comment</SelectItem>
      </SelectContent>
    </Select>
  );

describe("SelectTrigger", () => {
  it("is unchanged without the new props", () => {
    renderSelect();
    const t = screen.getByRole("combobox", { name: "Post type" });
    expect(t).toHaveClass("w-full");
    expect(t.querySelector("[aria-hidden] svg")).toBeNull();
  });

  it("draws a leading icon before the value", () => {
    renderSelect({ icon: <MessageSquare data-testid="lead" /> });
    expect(screen.getByTestId("lead")).toBeInTheDocument();
  });

  it("icon-only keeps the value for screen readers and shrinks to fit", () => {
    renderSelect({ icon: <MessageSquare />, showValue: false });
    const t = screen.getByRole("combobox", { name: "Post type" });
    expect(t).toHaveClass("w-auto");
    expect(t.querySelector(".sr-only")).toHaveTextContent("Comment");
  });
});
