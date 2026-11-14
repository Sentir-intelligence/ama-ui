"use client";

import * as React from "react";
import { Check, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Visibility } from "@/components/patterns/visibility-tag";

// Pattern/Visibility toggle: the two-segment choice in the Activity composer, Internal or External.
// The chosen segment is tinted with a tick; the other shows its icon. One is always chosen.
// Draws only: the app decides which visibilities a person may use (the toggle is left out for people
// who can only post one kind).

export interface VisibilityToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: Visibility;
  onChange?: (value: Visibility) => void;
  disabled?: boolean;
}

const SEGMENTS = [
  { value: "internal", label: "Internal", Icon: Lock },
  { value: "external", label: "External", Icon: Globe },
] as const;

const VisibilityToggle = React.forwardRef<HTMLDivElement, VisibilityToggleProps>(
  ({ value, onChange, disabled, className, ...props }, ref) => (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Visibility"
      className={cn("inline-flex h-control shrink-0 overflow-hidden rounded-md border border-input", className)}
      {...props}
    >
      {SEGMENTS.map(({ value: v, label, Icon }, i) => {
        const on = v === value;
        const Glyph = on ? Check : Icon;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={disabled}
            onClick={() => onChange?.(v)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 px-3 text-body disabled:cursor-not-allowed disabled:text-disabled-foreground",
              i > 0 && "border-l border-input",
              on ? "bg-row-selected text-body-strong text-primary" : "bg-background text-muted-foreground hover:bg-accent"
            )}
          >
            <Glyph aria-hidden className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  )
);
VisibilityToggle.displayName = "VisibilityToggle";

export { VisibilityToggle };
