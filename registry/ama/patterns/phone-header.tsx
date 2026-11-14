"use client";

import * as React from "react";
import { ChevronLeft, Ellipsis, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import type { StatusKey } from "@/lib/status";
import { cn } from "@/lib/utils";

// Pattern/Phone header: the sticky header of the phone Panel view. Back, the shop number with its
// status chip, one line (job, revision, install date), Find panel and a menu. Every button is a 44px
// target. Find panel opens the app's search, scan, recent and same-stage sheet; the menu holds Print
// label, Birth certificate and the role actions (Change stage, Merge, Split).
// Draws only: which menu items exist and who sees them come from the app.

export interface PhoneHeaderProps extends React.HTMLAttributes<HTMLElement> {
  shopNumber: string;
  status: StatusKey;
  /** One line under the shop number, e.g. "Jam Factory · IFC Rev C · Install 22 Oct". */
  line?: string;
  onBack?: () => void;
  onFind?: () => void;
  onMenu?: () => void;
}

const iconButton = "size-11 shrink-0 rounded-sm";

const PhoneHeader = React.forwardRef<HTMLElement, PhoneHeaderProps>(
  ({ shopNumber, status, line, onBack, onFind, onMenu, className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn("sticky top-0 z-10 flex items-center gap-1 border-b border-border bg-card px-1 py-1.5", className)}
      {...props}
    >
      <Button variant="ghost" size="icon" className={iconButton} aria-label="Back" onClick={onBack}>
        <ChevronLeft aria-hidden />
      </Button>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h1 className="text-title text-foreground">{shopNumber}</h1>
          <StatusChip status={status} />
        </div>
        {line && <p className="truncate text-caption text-muted-foreground">{line}</p>}
      </div>
      <Button variant="ghost" size="icon" className={iconButton} aria-label="Find panel" onClick={onFind}>
        <Search aria-hidden />
      </Button>
      <Button variant="ghost" size="icon" className={iconButton} aria-label="Menu" onClick={onMenu}>
        <Ellipsis aria-hidden />
      </Button>
    </header>
  )
);
PhoneHeader.displayName = "PhoneHeader";

export { PhoneHeader };
