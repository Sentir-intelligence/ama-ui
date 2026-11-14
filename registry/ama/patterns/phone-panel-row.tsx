import * as React from "react";
import { ChevronRight } from "lucide-react";
import { StatusChip } from "@/components/ui/status-chip";
import type { StatusKey } from "@/lib/status";
import { cn } from "@/lib/utils";

// Pattern/Phone panel row: one panel in a phone list (Find panel results, Recent, This stage). Shop
// number (or panel number and elevation before a shop number exists), one meta line, StatusChip and
// a chevron. The whole row opens the panel; 64px touch target.
// Draws only: the list and its order come from the app.

export interface PhonePanelRowProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  shopNumber: string;
  /** One line, e.g. "Stage 3 · Wall panel · Install 22 Oct". */
  meta?: string;
  status: StatusKey;
  onSelect?: () => void;
}

const PhonePanelRow = React.forwardRef<HTMLButtonElement, PhonePanelRowProps>(
  ({ shopNumber, meta, status, onSelect, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-h-16 w-full cursor-pointer items-center gap-3 border-b border-border bg-card py-2.5 pl-4 pr-3 text-left hover:bg-accent",
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-strong text-foreground">{shopNumber}</span>
        {meta && <span className="truncate text-caption text-muted-foreground">{meta}</span>}
      </span>
      <StatusChip status={status} />
      <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
    </button>
  )
);
PhonePanelRow.displayName = "PhonePanelRow";

export { PhonePanelRow };
