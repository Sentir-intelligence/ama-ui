"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Pattern/Icon button: a square ghost icon button with a tooltip, built from Button variant=ghost
// size=icon. States: Rest, Hover, Open (its menu or panel is open: tinted fill and a primary edge),
// Tinted (primary icon, no fill: the setting is on) and Disabled. `label` is required: it is both the
// accessible name and the tooltip. Draws only: the app decides what a press does.

export interface IconButtonProps extends Omit<ButtonProps, "variant" | "size" | "children" | "aria-label"> {
  icon: LucideIcon;
  /** The accessible name and the tooltip text, such as "Undo". */
  label: string;
  /** Its menu or panel is open. */
  open?: boolean;
  /** The setting it stands for is on. */
  tinted?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, open = false, tinted = false, className, ...props }, ref) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            data-state={open ? "open" : undefined}
            className={cn(
              (open || tinted) && "text-primary hover:text-primary",
              open && "border border-primary bg-row-selected",
              className,
            )}
            {...props}
          >
            <Icon aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
);
IconButton.displayName = "IconButton";

export { IconButton };
