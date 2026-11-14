"use client";

import * as React from "react";
import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/QA answer: Pass, Fail or N/A in one tap. Default for desktop rows; Touch (full width,
// 48 high) for phones and tablets. The chosen segment takes the success, destructive or muted
// soft colour. Draws only: whether the caller may answer, and what an answer does, come from the app.

export type QaAnswerValue = "pass" | "fail" | "na";

export interface QaAnswerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The chosen answer; none while the item is open. */
  value?: QaAnswerValue | null;
  onChange?: (value: QaAnswerValue) => void;
  size?: "default" | "touch";
  disabled?: boolean;
}

const SEGMENTS: {
  value: QaAnswerValue;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  selected: string;
}[] = [
  { value: "pass", label: "Pass", icon: CircleCheck, selected: "bg-success-soft text-success-soft-foreground" },
  { value: "fail", label: "Fail", icon: CircleX, selected: "bg-destructive-soft text-destructive-soft-foreground" },
  { value: "na", label: "N/A", icon: CircleMinus, selected: "bg-muted text-foreground" },
];

const QaAnswer = React.forwardRef<HTMLDivElement, QaAnswerProps>(
  ({ value = null, onChange, size = "default", disabled = false, className, ...props }, ref) => {
    const touch = size === "touch";
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Answer"
        data-size={size}
        className={cn(
          "flex items-start rounded-md border border-border bg-card p-px",
          touch ? "w-full" : "w-fit",
          className
        )}
        {...props}
      >
        {SEGMENTS.map(({ value: v, label, icon: Icon, selected }) => {
          const on = value === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={disabled}
              onClick={() => onChange?.(v)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-sm transition-colors",
                "disabled:bg-disabled disabled:text-disabled-foreground",
                touch ? "h-11.5 flex-1 px-4 text-button" : "h-7.5 w-20 px-3 text-button-sm",
                on ? selected : "text-foreground hover:bg-accent"
              )}
            >
              <Icon aria-hidden className="size-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    );
  }
);
QaAnswer.displayName = "QaAnswer";

export { QaAnswer };
