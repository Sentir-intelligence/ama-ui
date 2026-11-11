"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Star, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Shell panel row: one row in the shell's side panel and menu sheet (views, documents,
// Settings sections). Optional icon, the label on one line, optional meta, and the pin star when
// the row can be pinned. Active fills the selected row colour with the left indicator. The row
// height follows the density (32 compact, 48 touch). With asChild the label part wraps the app's
// link. The pin is its own button, so pinning never opens the row.

export interface ShellPanelRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  label: string;
  icon?: LucideIcon;
  /** Short text on the right, for example a count. */
  meta?: string;
  /** The row for the current page. */
  active?: boolean;
  /** Opens the row. Ignored with asChild, where the child is the link. */
  onSelect?: () => void;
  /** Render the single child (a link) as the row's main target. */
  asChild?: boolean;
  /** Shows the pin star; pinned fills it. Omit for rows that cannot be pinned. */
  pin?: { pinned: boolean; onToggle: () => void; label?: string };
}

const ShellPanelRow = React.forwardRef<HTMLDivElement, ShellPanelRowProps>(
  ({ label, icon: Icon, meta, active = false, onSelect, asChild = false, pin, className, children, ...props }, ref) => {
    const Main = asChild ? Slot : "button";
    const body = (
      <>
        {Icon && <Icon aria-hidden className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />}
        <span className="min-w-0 flex-1 truncate text-table-cell text-foreground">{label}</span>
        {meta && <span className="shrink-0 text-id text-muted-foreground">{meta}</span>}
      </>
    );
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex h-row items-center pr-3",
          active ? "bg-row-selected indicator-left" : "hover:bg-accent",
          className
        )}
        {...props}
      >
        <Main
          {...(asChild ? {} : { type: "button" as const, onClick: onSelect })}
          aria-current={active ? "page" : undefined}
          className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2.5 pl-4 text-left"
        >
          {asChild ? React.cloneElement(children as React.ReactElement<{ children?: React.ReactNode }>, undefined, body) : body}
        </Main>
        {pin && (
          <button
            type="button"
            aria-label={pin.label ?? (pin.pinned ? `Unpin ${label}` : `Pin ${label}`)}
            aria-pressed={pin.pinned}
            onClick={pin.onToggle}
            className={cn(
              "flex h-full w-7 shrink-0 cursor-pointer items-center justify-center",
              pin.pinned ? "text-primary" : "text-transparent group-hover:text-muted-foreground focus-visible:text-muted-foreground"
            )}
          >
            <Star aria-hidden className={cn("size-4", pin.pinned && "fill-primary")} />
          </button>
        )}
      </div>
    );
  }
);
ShellPanelRow.displayName = "ShellPanelRow";

export { ShellPanelRow };
