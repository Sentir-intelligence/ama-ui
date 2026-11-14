"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PhotoTile, type PhotoTileProps } from "@/components/patterns/photo-tile";
import { cn } from "@/lib/utils";

// Pattern/QA defect: the defect raised when a QA item fails. It sits inside the failed row, aligned
// to the item text, with no banner and no heading of its own. The note with Close defect on the
// right (outline until a fix photo is added, then primary; always tappable, so the app can ask once
// when closing without a photo), then the defect photos, a divider, and the fix photos with an Add
// tile. Closed: muted note, no button, no Add tile; kept in the history.
// Nothing is ever blocked: an open Pre Pour defect is a nudge on Concrete Docket, not a gate.
// Draws only: the state, who may close and the photo uploads come from the app.

export interface QaDefectProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: "open" | "fix-added" | "closed";
  note: string;
  defectPhotos?: PhotoTileProps[];
  fixPhotos?: PhotoTileProps[];
  onCloseDefect?: () => void;
  /** Add tile after the fix photos (not shown when closed). */
  onAddFix?: () => void;
}

const QaDefect = React.forwardRef<HTMLDivElement, QaDefectProps>(
  ({ state = "open", note, defectPhotos = [], fixPhotos = [], onCloseDefect, onAddFix, className, ...props }, ref) => {
    const closed = state === "closed";
    return (
      <div ref={ref} data-state={state} className={cn("flex flex-col items-start gap-2.5 rounded-lg", className)} {...props}>
        <div className="flex w-full items-center gap-2">
          <p className={cn("flex-1 text-body", closed ? "text-muted-foreground" : "text-foreground")}>{note}</p>
          {!closed && (
            <Button
              type="button"
              size="sm"
              variant={state === "fix-added" ? "default" : "outline"}
              onClick={onCloseDefect}
            >
              Close defect
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {defectPhotos.map((p, i) => (
            <PhotoTile key={`d${i}`} {...p} />
          ))}
          <span aria-hidden className={cn("h-10 w-px shrink-0", closed ? "bg-border" : "bg-destructive-border")} />
          {fixPhotos.map((p, i) => (
            <PhotoTile key={`f${i}`} {...p} />
          ))}
          {!closed && <PhotoTile state="add" onSelect={onAddFix} />}
        </div>
      </div>
    );
  }
);
QaDefect.displayName = "QaDefect";

export { QaDefect };
