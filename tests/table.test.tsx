import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, TableBody, TableRow, TableCheckboxCell, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

describe("Table", () => {
  it("defaults to compact density", () => {
    const { container } = render(<Table><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>);
    expect(container.querySelector("[data-density]")).toHaveAttribute("data-density", "compact");
  });

  it("clicking anywhere in a checkbox cell toggles the checkbox (24px hit-area rule)", async () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCheckboxCell data-testid="cell">
              <Checkbox aria-label="Select PCS-P180-014" />
            </TableCheckboxCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const box = screen.getByRole("checkbox", { name: "Select PCS-P180-014" });
    expect(box).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(screen.getByTestId("cell").querySelector("label")!);
    expect(box).toHaveAttribute("data-state", "checked");
  });
});
