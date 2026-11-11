"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Shell chrome button: a button on navy chrome (Open menu, Scan, the update prompt). Icon
// only is a 44px square with a 24px icon and needs a label for screen readers; with showLabel it
// is a filled 44px pill with a 20px icon and the label. Focus is the yellow chrome ring.

export interface ShellChromeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  /** The accessible name, and the visible text when showLabel is set. */
  label: string;
  showLabel?: boolean;
  asChild?: boolean;
}

const ShellChromeButton = React.forwardRef<HTMLButtonElement, ShellChromeButtonProps>(
  ({ icon: Icon, label, showLabel = false, asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const inner = showLabel ? (
      <>
        <Icon aria-hidden className="size-5" />
        <span className="text-button">{label}</span>
      </>
    ) : (
      <Icon aria-hidden className="size-6" />
    );
    return (
      <Comp
        ref={ref}
        data-surface="chrome"
        aria-label={showLabel ? undefined : label}
        {...(asChild ? {} : { type: "button" as const })}
        className={cn(
          "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-chrome-foreground",
          showLabel ? "gap-2 bg-chrome-hover px-3" : "w-11 hover:bg-chrome-hover",
          className
        )}
        {...props}
      >
        {asChild ? React.cloneElement(children as React.ReactElement<{ children?: React.ReactNode }>, undefined, inner) : inner}
      </Comp>
    );
  }
);
ShellChromeButton.displayName = "ShellChromeButton";

export { ShellChromeButton };
