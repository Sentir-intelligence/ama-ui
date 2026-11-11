"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Pattern/Shell activity item: one entry in the shell's Activity tab. The comment or change, then
// where it happened (project · panel) and how long ago. With onSelect the whole item is a button
// that opens the thread.

export interface ShellActivityItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  comment: string;
  /** Where it happened, for example "AMA237 · A-2P068". */
  trail: string;
  /** How long ago, for example "3d". */
  age: string;
  onSelect?: () => void;
}

const ShellActivityItem = React.forwardRef<HTMLElement, ShellActivityItemProps>(
  ({ comment, trail, age, onSelect, className, ...props }, ref) => {
    const content = (
      <>
        <span className="text-table-cell text-foreground">{comment}</span>
        <span className="flex items-baseline gap-1 text-muted-foreground">
          <span className="min-w-0 truncate text-id">{trail}</span>
          <span className="shrink-0 text-caption">· {age}</span>
        </span>
      </>
    );
    const base = "flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left";
    if (onSelect) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onSelect}
          className={cn(base, "cursor-pointer hover:bg-accent", className)}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={cn(base, className)} {...props}>
        {content}
      </div>
    );
  }
);
ShellActivityItem.displayName = "ShellActivityItem";

export { ShellActivityItem };
