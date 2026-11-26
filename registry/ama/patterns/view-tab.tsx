"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/View tab: one tab in the view tabs row (pinned and open views). Saved is a saved view.
// Preview is an unsaved view opened from elsewhere (Expand, Open as tab, a Documents click) and has
// a close button. Active is the foreground label and a 2px primary underline; inactive is muted.
// The row is the tabs left to right, then a ghost + (New view). Draws only: the app opens and closes.

export interface ViewTabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  active?: boolean;
  kind?: "saved" | "preview";
  /** Preview tabs only: the close (X) press. */
  onClose?: () => void;
}

const ViewTab = React.forwardRef<HTMLButtonElement, ViewTabProps>(
  ({ label, active = false, kind = "saved", onClose, className, ...props }, ref) => (
    <span className="relative inline-flex shrink-0 items-center">
      <button
        ref={ref}
        type="button"
        aria-current={active ? "page" : undefined}
        data-state={active ? "active" : "inactive"}
        className={cn(
          "relative inline-flex h-row min-h-10 min-w-11 cursor-pointer items-center justify-center px-2 text-body whitespace-nowrap text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:text-foreground data-[state=active]:text-body-strong data-[state=active]:text-foreground data-[state=active]:after:bg-primary",
          kind === "preview" && "pr-8",
          className,
        )}
        {...props}
      >
        {label}
      </button>
      {kind === "preview" && (
        <button
          type="button"
          aria-label={`Close ${label}`}
          onClick={onClose}
          className="absolute right-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-sm text-foreground hover:bg-accent"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </span>
  ),
);
ViewTab.displayName = "ViewTab";

export { ViewTab };
