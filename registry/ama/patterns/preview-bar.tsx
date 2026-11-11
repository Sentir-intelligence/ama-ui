"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Pattern/Preview bar: shown while Admin or IT preview another shell as someone, read only (Front
// door 10.9). Names the shell and the person, with Exit. Sits under the page header. Info soft
// fill with an info border underneath. Draws only: the app makes the preview read only.

export interface PreviewBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The shell being previewed, for example "Builder". */
  shell: string;
  /** Who it is previewed as, for example "Ben Ryan". */
  person: string;
  onExit: () => void;
  exitLabel?: string;
}

const PreviewBar = React.forwardRef<HTMLDivElement, PreviewBarProps>(
  ({ shell, person, onExit, exitLabel = "Exit", className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "flex min-h-13 items-center gap-2 border-b border-info-border bg-info-soft py-1 pl-4 pr-2",
        className
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-label text-info-soft-foreground">
        Preview · {shell} · {person}
      </span>
      <Button variant="link" className="h-11 shrink-0 px-2" onClick={onExit}>
        {exitLabel}
      </Button>
    </div>
  )
);
PreviewBar.displayName = "PreviewBar";

export { PreviewBar };
