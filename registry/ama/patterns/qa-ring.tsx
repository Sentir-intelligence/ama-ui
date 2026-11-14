import * as React from "react";
import { cn } from "@/lib/utils";

// Pattern/QA ring: QA progress as a ring (checks done of total). Compact 16 and Touch 24 for rows
// and boards; Large 64 for the Overview QA card. The arc is done; a red arc and dot show a failed
// check; a full ring with a tick is complete; a dashed grey ring is not scheduled.
// Draws only: the counts come from the app.

export interface QaRingProps extends React.SVGAttributes<SVGSVGElement> {
  /** Checks done (passed or N/A). */
  done: number;
  total: number;
  /** Checks currently failed. */
  failed?: number;
  /** False draws the dashed ring: QA is not scheduled for this panel. */
  scheduled?: boolean;
  size?: "compact" | "touch" | "large";
}

const SIZE_CLASS = { compact: "size-4", touch: "size-6", large: "size-16" } as const;
const STROKE = 2.5;
const R = 12 - STROKE / 2;
const C = 2 * Math.PI * R;

function arc(from: number, fraction: number) {
  // A stroke-dasharray arc starting at `from` (0 to 1) clockwise from 12 o'clock.
  return {
    strokeDasharray: `${Math.max(0, fraction) * C} ${C}`,
    transform: `rotate(${from * 360 - 90} 12 12)`,
  };
}

const QaRing = React.forwardRef<SVGSVGElement, QaRingProps>(
  ({ done, total, failed = 0, scheduled = true, size = "compact", className, ...props }, ref) => {
    const ready = scheduled && total > 0;
    const complete = ready && done >= total && failed === 0;
    const fraction = ready ? Math.min(1, done / total) : 0;
    const label = !ready
      ? "QA not scheduled"
      : `${done} of ${total} checks done${failed > 0 ? `, ${failed} failed` : ""}`;
    return (
      <svg
        ref={ref}
        role="img"
        aria-label={label}
        viewBox="0 0 24 24"
        fill="none"
        data-size={size}
        className={cn("shrink-0", SIZE_CLASS[size], className)}
        {...props}
      >
        <circle
          cx="12"
          cy="12"
          r={R}
          strokeWidth={STROKE}
          className={ready ? "stroke-border" : "stroke-muted-foreground"}
          strokeDasharray={ready ? undefined : "2 2.5"}
        />
        {ready && fraction > 0 && (
          <circle cx="12" cy="12" r={R} strokeWidth={STROKE} className="stroke-primary" {...arc(0, fraction)} />
        )}
        {ready && failed > 0 && done > 0 && !complete && (
          <circle
            cx="12"
            cy="12"
            r={R}
            strokeWidth={STROKE}
            className="stroke-destructive"
            {...arc(fraction, Math.min(failed, total - done) / total)}
          />
        )}
        {ready && failed > 0 && <circle cx="12" cy="12" r="2.25" className="fill-destructive" />}
        {complete && (
          <path d="M8 12.5l2.7 2.7L16 9.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary" />
        )}
      </svg>
    );
  }
);
QaRing.displayName = "QaRing";

export { QaRing };
