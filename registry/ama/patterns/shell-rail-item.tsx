"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Shell rail item: one item in the app rail on navy chrome (Views, Documents, Activity,
// Settings, Reader). 72 x 56, icon over a caption. Active draws the yellow signal indicator on
// the left and sets aria-current; focus is the yellow chrome ring. With asChild it wraps the app's
// own link (Next Link), so ama-ui never decides where an item goes.

export interface ShellRailItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  /** The item for the current page: indicator, white caption and aria-current="page". */
  active?: boolean;
  /** Render the single child (a link) instead of a button. */
  asChild?: boolean;
}

const ShellRailItem = React.forwardRef<HTMLButtonElement, ShellRailItemProps>(
  ({ icon: Icon, label, active = false, asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const inner = (
      <>
        <Icon aria-hidden className={cn("size-5", active ? "text-chrome-foreground" : "text-chrome-muted")} />
        <span className={cn("text-caption", active ? "text-chrome-foreground" : "text-chrome-muted")}>{label}</span>
        {active && <span aria-hidden className="absolute left-0 top-3 h-8 w-0.75 bg-signal" />}
      </>
    );
    return (
      <Comp
        ref={ref}
        data-surface="chrome"
        aria-current={active ? "page" : undefined}
        {...(asChild ? {} : { type: "button" as const })}
        className={cn(
          "relative flex h-14 w-18 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md hover:bg-chrome-hover",
          className
        )}
        {...props}
      >
        {asChild ? React.cloneElement(children as React.ReactElement<{ children?: React.ReactNode }>, undefined, inner) : inner}
      </Comp>
    );
  }
);
ShellRailItem.displayName = "ShellRailItem";

export { ShellRailItem };
