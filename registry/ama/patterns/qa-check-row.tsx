import * as React from "react";
import { Camera, Circle, CircleCheck, CircleX, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/QA check row: one QA or trade checklist item as a plain row: tick, label, who and when,
// and an optional photo and note count. States: done (blue tick, who and when), next (the item to
// do now, with a "Next" tag), open (not yet) and failed (red cross, who and when). The lighter
// sibling of QA item, for lists inside a card or the Board. Draws only.

export type QaCheckRowState = "done" | "next" | "open" | "failed";

export interface QaCheckRowProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: QaCheckRowState;
  /** For example "1. Shop Drawing". */
  label: string;
  /** Who and when, for example "Tom B · 09 Oct". Shown for done and failed. */
  meta?: string;
  /** Photo and note counts; each shows only when given. */
  photos?: number;
  notes?: number;
}

const ICON = {
  done: { Icon: CircleCheck, className: "text-primary", word: "Done" },
  failed: { Icon: CircleX, className: "text-destructive", word: "Failed" },
  next: { Icon: Circle, className: "text-muted-foreground", word: "Next" },
  open: { Icon: Circle, className: "text-muted-foreground", word: "Not done" },
} as const;

const QaCheckRow = React.forwardRef<HTMLDivElement, QaCheckRowProps>(
  ({ state = "open", label, meta, photos, notes, className, ...props }, ref) => {
    const { Icon, className: tone, word } = ICON[state];
    const showMeta = meta && (state === "done" || state === "failed");
    return (
      <div ref={ref} data-state={state} className={cn("flex min-h-8 items-center gap-2 py-1", className)} {...props}>
        <Icon className={cn("size-4 shrink-0", tone)} aria-hidden="true" />
        <span className="sr-only">{word}: </span>
        <span className="min-w-0 truncate text-body text-foreground">{label}</span>
        {state === "next" && (
          <span className="shrink-0 rounded-sm border border-input bg-background px-1.5 text-caption text-foreground">Next</span>
        )}
        {photos !== undefined && (
          <span className="flex shrink-0 items-center gap-0.5 text-caption text-muted-foreground">
            <Camera className="size-3.5" aria-hidden="true" />
            {photos}
            <span className="sr-only"> photos</span>
          </span>
        )}
        {notes !== undefined && (
          <span className="flex shrink-0 items-center gap-0.5 text-caption text-muted-foreground">
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {notes}
            <span className="sr-only"> notes</span>
          </span>
        )}
        {showMeta && <span className="ml-auto shrink-0 text-body-sm text-muted-foreground">{meta}</span>}
      </div>
    );
  },
);
QaCheckRow.displayName = "QaCheckRow";

export { QaCheckRow };
