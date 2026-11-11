"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Pattern/Code input: the email sign-in code, one digit per box (8 by default), with a gap in the
// middle. Digits only. Typing moves to the next box, backspace to the previous one; a pasted or
// autofilled code fills every box. onComplete fires when the last box is filled. It never checks
// the code: the app does, and sets invalid when the code is wrong.
//
// value is the digits typed so far, left to right ("4821" is the first four boxes). Editing a box
// in the middle replaces that digit; deleting it closes the gap, like editing text.

export interface CodeInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Number of digits. Default 8. */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Fires with the full code when the last digit is entered or a full code is pasted. */
  onComplete?: (code: string) => void;
  /** Draws the destructive borders and sets aria-invalid on every box. */
  invalid?: boolean;
  disabled?: boolean;
  /** The group's accessible name. */
  label?: string;
}

const digitsOf = (text: string) => text.replace(/\D/g, "");

const CodeInput = React.forwardRef<HTMLDivElement, CodeInputProps>(
  (
    { length = 8, value, onChange, onComplete, invalid = false, disabled = false, label = "Sign-in code", className, ...props },
    ref
  ) => {
    const boxes = React.useRef<Array<HTMLInputElement | null>>([]);
    const code = digitsOf(value).slice(0, length);

    const focusBox = (index: number) => {
      const box = boxes.current[Math.max(0, Math.min(length - 1, index))];
      box?.focus();
      box?.select();
    };

    // Focus moves once the new value has rendered, so the first-empty-box rule sees it.
    const pendingFocus = React.useRef<number | null>(null);
    React.useLayoutEffect(() => {
      if (pendingFocus.current === null) return;
      const index = pendingFocus.current;
      pendingFocus.current = null;
      focusBox(index);
    });

    const commit = (next: string, focusAt: number) => {
      const clean = digitsOf(next).slice(0, length);
      pendingFocus.current = focusAt;
      if (clean === code) {
        pendingFocus.current = null;
        focusBox(focusAt);
        return;
      }
      onChange(clean);
      if (clean.length === length) onComplete?.(clean);
    };

    // Several digits at once (paste, or the phone's one-time-code autofill): a full code replaces
    // everything; a shorter run is written from this box on.
    const writeMany = (index: number, digits: string) => {
      if (digits.length >= length) {
        commit(digits.slice(0, length), length - 1);
        return;
      }
      const start = Math.min(index, code.length);
      const next = code.slice(0, start) + digits + code.slice(start + digits.length);
      commit(next, start + digits.length);
    };

    const onBoxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const typed = digitsOf(event.target.value);
      if (!typed) return;
      // The box held its old digit; the new one is whatever is not that digit.
      const old = code[index] ?? "";
      const digits = typed.length > 1 && old && typed.includes(old) ? typed.replace(old, "") || old : typed;
      if (digits.length > 1) {
        writeMany(index, digits);
        return;
      }
      const at = Math.min(index, code.length);
      commit(code.slice(0, at) + digits + code.slice(at + 1), at + 1);
    };

    const onKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        if (index < code.length) {
          commit(code.slice(0, index) + code.slice(index + 1), index);
        } else if (code.length > 0) {
          commit(code.slice(0, -1), code.length - 1);
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusBox(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        focusBox(Math.min(index + 1, code.length));
      }
    };

    const onPaste = (index: number) => (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const digits = digitsOf(event.clipboardData.getData("text"));
      if (digits) writeMany(index, digits);
    };

    // A box past the typed digits sends focus to the first empty box, so digits stay in order.
    const onFocus = (index: number) => () => {
      if (index > code.length) focusBox(code.length);
      else boxes.current[index]?.select();
    };

    const half = length % 2 === 0 ? length / 2 : -1;

    return (
      <div ref={ref} role="group" aria-label={label} className={cn("flex items-start gap-1.5", className)} {...props}>
        {Array.from({ length }, (_, index) => (
          <React.Fragment key={index}>
            {index === half && <span aria-hidden className="w-1 shrink-0" />}
            <Input
              ref={(node) => {
                boxes.current[index] = node;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={invalid || undefined}
              disabled={disabled}
              value={code[index] ?? ""}
              onChange={onBoxChange(index)}
              onKeyDown={onKeyDown(index)}
              onPaste={onPaste(index)}
              onFocus={onFocus(index)}
              className="h-13 w-9.5 shrink-0 rounded-xl bg-card px-0 text-center text-section md:text-section"
            />
          </React.Fragment>
        ))}
      </div>
    );
  }
);
CodeInput.displayName = "CodeInput";

export { CodeInput };
