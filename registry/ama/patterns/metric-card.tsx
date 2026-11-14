import * as React from "react";
import { cn } from "@/lib/utils";

// Pattern/Metric card: a summary card for a tab (Open defects, QA done). Always the same three
// lines and height: label, a 28px value row, and a sub line. Fill the sub on every card in a row,
// or on none. Number shows a count; give `progress` (0 to 1) for the Progress type, a bar beside the
// value. Use 3 to 5 in a row under the tabs, equal widths. The Person type is not used (there is no
// QA assignee, 2026-11-10). Draws only: the numbers come from the app.

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  /** Third line, for example the item or panel the number is about. */
  sub?: React.ReactNode;
  /** 0 to 1: draws the progress bar beside the value. */
  progress?: number;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ label, value, sub, progress, className, ...props }, ref) => {
    const pct = progress === undefined ? undefined : Math.round(Math.min(1, Math.max(0, progress)) * 100);
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-start gap-1.5 rounded-lg border border-border bg-card px-4 py-3.5", className)}
        {...props}
      >
        <span className="w-full text-label text-muted-foreground">{label}</span>
        <div className="flex h-7 w-full items-center gap-3">
          <span className="text-title text-foreground">{value}</span>
          {pct !== undefined && (
            <span
              role="progressbar"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="flex h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <span className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </span>
          )}
        </div>
        {sub !== undefined && <span className="w-full text-body-sm text-muted-foreground">{sub}</span>}
      </div>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { MetricCard };
