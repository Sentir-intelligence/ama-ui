import * as React from "react";
import { CircleAlert, ExternalLink, FilePen, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Pattern/Raised item: a defect, change request or issue raised on a panel, in the Activity tab's
// Raised view. Colour follows the state: Open and In dispute warn, In progress and In review inform,
// Closed is done. The title reads "Defect D-012 · Open", the meta says who raised it and when.
// Actions sit below as small outline buttons, indented to the text:
//   AMA defect         Open: Start work, Dispute. In progress: Ready for review, Dispute.
//   AMA change request Open: Mark in review. In review: Accept, Decline.
//   Builder defect     In review or In dispute: Close, Reopen.
// Items that come read-only from Visibuild show "Open in Visibuild" instead.
// Draws only: who may act and what the action does come from the app (actions are passed in).

export type RaisedKind = "defect" | "change-request" | "issue";
export type RaisedState = "open" | "in-progress" | "in-review" | "in-dispute" | "closed";

export interface RaisedItemAction {
  label: string;
  onAction: () => void;
}

export interface RaisedItemProps extends React.HTMLAttributes<HTMLDivElement> {
  kind: RaisedKind;
  state: RaisedState;
  /** Reference and name, e.g. "D-012". */
  reference: string;
  /** "Raised by Sam, 2d ago". */
  meta?: string;
  actions?: RaisedItemAction[];
  openInVisibuildHref?: string;
}

const KIND = {
  defect: { label: "Defect", Icon: TriangleAlert },
  "change-request": { label: "Change request", Icon: FilePen },
  issue: { label: "Issue", Icon: CircleAlert },
} as const;

const STATE = {
  open: { label: "Open", tone: "bg-warning-soft text-warning-soft-foreground" },
  "in-dispute": { label: "In dispute", tone: "bg-warning-soft text-warning-soft-foreground" },
  "in-progress": { label: "In progress", tone: "bg-info-soft text-info-soft-foreground" },
  "in-review": { label: "In review", tone: "bg-info-soft text-info-soft-foreground" },
  closed: { label: "Closed", tone: "bg-success-soft text-success-soft-foreground" },
} as const;

const RaisedItem = React.forwardRef<HTMLDivElement, RaisedItemProps>(
  ({ kind, state, reference, meta, actions = [], openInVisibuildHref, className, ...props }, ref) => {
    const { label, Icon } = KIND[kind];
    const s = STATE[state];
    return (
      <div ref={ref} data-state={state} className={cn("flex items-start gap-3 px-4 py-3", className)} {...props}>
        <span aria-hidden className={cn("flex size-7 shrink-0 items-center justify-center rounded-full [&>svg]:size-4", s.tone)}>
          <Icon />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body-strong text-foreground">
            {label} {reference} · {s.label}
          </p>
          {meta && <p className="text-body-sm text-muted-foreground">{meta}</p>}
          {(actions.length > 0 || openInVisibuildHref) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {actions.map((a) => (
                <Button key={a.label} type="button" size="sm" variant="outline" onClick={a.onAction}>
                  {a.label}
                </Button>
              ))}
              {openInVisibuildHref && (
                <Button asChild size="sm" variant="link">
                  <a href={openInVisibuildHref} target="_blank" rel="noreferrer">
                    Open in Visibuild
                    <ExternalLink aria-hidden />
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
RaisedItem.displayName = "RaisedItem";

export { RaisedItem };
