import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeInput, type CodeInputProps } from "@/components/patterns/code-input";

function Controlled(props: Partial<CodeInputProps> & { start?: string }) {
  const { start = "", onChange, ...rest } = props;
  const [value, setValue] = React.useState(start);
  return (
    <CodeInput
      {...rest}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

const boxes = () => screen.getAllByRole("textbox") as HTMLInputElement[];
const shown = () => boxes().map((b) => b.value).join("");

describe("CodeInput", () => {
  it("draws 8 numeric boxes in a named group; the first offers the one-time code", () => {
    render(<CodeInput value="" onChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Sign-in code" })).toBeInTheDocument();
    const all = boxes();
    expect(all).toHaveLength(8);
    expect(all[0]).toHaveAttribute("autocomplete", "one-time-code");
    expect(all[1]).toHaveAttribute("autocomplete", "off");
    expect(all[0]).toHaveAttribute("inputmode", "numeric");
    expect(all[3]).toHaveAccessibleName("Digit 4 of 8");
    expect(all[0].className).toMatch(/\bh-13\b/);
    expect(all[0].className).toMatch(/\bw-9\.5\b/);
  });

  it("types digits left to right and moves to the next box", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("4821");
    expect(shown()).toBe("4821");
    expect(onChange).toHaveBeenLastCalledWith("4821");
    expect(boxes()[4]).toHaveFocus();
  });

  it("ignores anything that is not a digit", async () => {
    render(<Controlled />);
    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("4a-8");
    expect(shown()).toBe("48");
  });

  it("fires onComplete once the last digit is in", async () => {
    const onComplete = vi.fn();
    render(<Controlled onComplete={onComplete} />);
    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("4821937");
    expect(onComplete).not.toHaveBeenCalled();
    await userEvent.keyboard("6");
    expect(onComplete).toHaveBeenCalledWith("48219376");
  });

  it("fills every box from a pasted code, with or without spaces", async () => {
    const onComplete = vi.fn();
    render(<Controlled onComplete={onComplete} />);
    await userEvent.click(boxes()[0]);
    await userEvent.paste("4821 9376");
    expect(shown()).toBe("48219376");
    expect(onComplete).toHaveBeenCalledWith("48219376");
  });

  it("fills every box when the phone autofills the code into the first box", async () => {
    const onComplete = vi.fn();
    render(<Controlled onComplete={onComplete} />);
    await userEvent.type(boxes()[0], "48219376");
    expect(shown()).toBe("48219376");
    expect(onComplete).toHaveBeenCalledWith("48219376");
  });

  it("moves back with backspace", async () => {
    render(<Controlled start="482" />);
    await userEvent.click(boxes()[3]);
    await userEvent.keyboard("{Backspace}");
    expect(shown()).toBe("48");
    expect(boxes()[2]).toHaveFocus();
  });

  it("sends focus to the first empty box", async () => {
    render(<Controlled start="48" />);
    await userEvent.click(boxes()[6]);
    expect(boxes()[2]).toHaveFocus();
  });

  it("marks every box invalid, and disables them", () => {
    const { rerender } = render(<CodeInput value="48219370" onChange={() => {}} invalid />);
    for (const box of boxes()) expect(box).toHaveAttribute("aria-invalid", "true");
    rerender(<CodeInput value="48219370" onChange={() => {}} disabled />);
    for (const box of boxes()) {
      expect(box).toBeDisabled();
      expect(box).not.toHaveAttribute("aria-invalid");
    }
  });

  it("takes another length", () => {
    render(<CodeInput length={6} value="" onChange={() => {}} />);
    expect(boxes()).toHaveLength(6);
  });
});
