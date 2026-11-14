import * as React from "react";
import { History } from "lucide-react";
import { VisibilityTag, type Visibility } from "@/components/patterns/visibility-tag";
import { cn } from "@/lib/utils";

// Pattern/Activity log line: one automatic entry in the Log (a status change, a field edit). A 28px
// icon slot, the sentence with the changed parts in bold, then "who · when" muted, and a visibility
// tag. Pass the sentence as children so the app can wrap the changed parts in <strong>.
// Draws only: the wording comes from the app.

export interface ActivityLogLineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon for the slot; defaults to History. */
  icon?: React.ReactNode;
  who: string;
  when: string;
  visibility?: Visibility;
}

const ActivityLogLine = React.forwardRef<HTMLDivElement, ActivityLogLineProps>(
  ({ icon, who, when, visibility = "internal", children, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-start gap-3 px-4 py-2", className)} {...props}>
      <span aria-hidden className="flex size-7 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4">
        {icon ?? <History />}
      </span>
      <p className="min-w-0 flex-1 pt-1 text-body text-foreground [&_strong]:text-body-strong">
        {children}
        <span className="text-body-sm text-muted-foreground">
          {" "}
          · {who} · {when}
        </span>
      </p>
      <VisibilityTag visibility={visibility} />
    </div>
  )
);
ActivityLogLine.displayName = "ActivityLogLine";

export { ActivityLogLine };
