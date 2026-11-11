"use client";

import * as React from "react";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Pattern/Phone page header: the sticky 56px header for phone pages that are not a panel
// (Settings and similar). Back, the title on one line, and one optional icon action. Back and the
// action are 44px targets. The page's main action belongs in the bottom bar, not here.

export interface PhonePageHeaderAction {
  icon: LucideIcon;
  /** The accessible name; there is no visible label. */
  label: string;
  onClick: () => void;
}

export interface PhonePageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  /** Shows the back button. Without it there is none. */
  onBack?: () => void;
  /** The accessible name of the back button. */
  backLabel?: string;
  /** One icon action on the right. */
  action?: PhonePageHeaderAction;
}

const iconButton = "size-11 shrink-0 rounded-sm";

const PhonePageHeader = React.forwardRef<HTMLElement, PhonePageHeaderProps>(
  ({ title, onBack, backLabel = "Back", action, className, ...props }, ref) => {
    const ActionIcon = action?.icon;
    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-border bg-card px-1",
          className
        )}
        {...props}
      >
        {onBack && (
          <Button variant="ghost" size="icon" className={iconButton} aria-label={backLabel} onClick={onBack}>
            <ChevronLeft aria-hidden />
          </Button>
        )}
        <h1 className={cn("min-w-0 flex-1 truncate text-title text-foreground", !onBack && "pl-3")}>{title}</h1>
        {action && ActionIcon && (
          <Button variant="ghost" size="icon" className={iconButton} aria-label={action.label} onClick={action.onClick}>
            <ActionIcon aria-hidden />
          </Button>
        )}
      </header>
    );
  }
);
PhonePageHeader.displayName = "PhonePageHeader";

export { PhonePageHeader };
