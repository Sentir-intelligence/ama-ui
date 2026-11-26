"use client";

import * as React from "react";
import { FileText, MessageSquare } from "lucide-react";
import { QaRing } from "@/components/patterns/qa-ring";
import { cn } from "@/lib/utils";

// Pattern/Card action bar: the action bar under a phone element card: Drawing, Activity and QA, each
// an icon over a caption, 44px tall (Density/control in Touch), in equal slots. A slot shows only
// when its handler is given. Activity has an unread state (primary icon, count and caption plus a
// dot) and an @ for a mention; QA shows the QA ring and the fraction of checks done.
// Draws only: the app decides what each press opens.

export interface CardActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onDrawing?: () => void;
  onActivity?: () => void;
  /** The comment count, the unread dot and the @ for a mention. */
  activity?: { count?: number; unread?: boolean; mention?: boolean };
  onQa?: () => void;
  /** Checks done of total, and how many have failed. Leave out when QA is not scheduled. */
  qa?: { done: number; total: number; failed?: number };
}

const SLOT =
  "flex h-control-lg min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md text-caption text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

const CardActionBar = React.forwardRef<HTMLDivElement, CardActionBarProps>(
  ({ onDrawing, onActivity, activity, onQa, qa, className, ...props }, ref) => {
    const unread = activity?.unread ?? false;
    return (
      <div ref={ref} role="group" aria-label="Card actions" className={cn("flex items-center gap-0 px-2 py-1", className)} {...props}>
        {onDrawing && (
          <button type="button" className={SLOT} onClick={onDrawing}>
            <FileText className="size-5" aria-hidden="true" />
            Drawing
          </button>
        )}
        {onActivity && (
          <button type="button" className={cn(SLOT, unread && "text-primary hover:text-primary")} onClick={onActivity}>
            <span className="relative flex items-center gap-1">
              <MessageSquare className="size-5" aria-hidden="true" />
              {activity?.count !== undefined && <span className="text-body-strong">{activity.count}</span>}
              {activity?.mention && (
                <span className="text-body-strong text-primary">
                  <span aria-hidden="true">@</span>
                  <span className="sr-only">You are mentioned</span>
                </span>
              )}
              {unread && (
                <span className="absolute -top-0.5 -right-1 size-1.5 rounded-full bg-primary">
                  <span className="sr-only">Unread</span>
                </span>
              )}
            </span>
            Activity
          </button>
        )}
        {onQa && (
          <button type="button" className={SLOT} onClick={onQa}>
            <span className="flex items-center gap-1">
              <QaRing done={qa?.done ?? 0} total={qa?.total ?? 0} failed={qa?.failed} scheduled={qa !== undefined} size="touch" />
              {qa && (
                <span className="text-body-strong text-foreground">
                  {qa.done}/{qa.total}
                </span>
              )}
            </span>
            QA
          </button>
        )}
      </div>
    );
  },
);
CardActionBar.displayName = "CardActionBar";

export { CardActionBar };
