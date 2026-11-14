"use client";

import * as React from "react";
import { Camera, Circle, CircleCheck, CircleMinus, CircleX, Clock, CloudOff, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QaAnswer, type QaAnswerValue } from "@/components/patterns/qa-answer";

// Pattern/QA item: one checklist item on the Visibuild QA tab.
// View: answer (QA officer: open items take Pass, Fail or N/A in one tap; answered items show the
// result and Reopen), review (read only result, for staff and for trades and project managers on
// phones), builder (Planned, In progress or Complete; never shows Failed).
// State: open, pass, fail, na. Size: desktop row, or touch card for phones and tablets.
// notSynced shows the cloud icon until the answer reaches Visibuild.
// Draws only: who may answer, what an answer does and whether it has synced come from the app.

export type QaItemView = "answer" | "review" | "builder";
export type QaItemState = "open" | "pass" | "fail" | "na";

export interface QaItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  view?: QaItemView;
  state?: QaItemState;
  size?: "desktop" | "touch";
  /** For example "11. Cast in Plates". */
  label: string;
  description?: string;
  /** Who and when, for example "Tom B · 09 Oct". */
  meta?: string;
  /** Photo count; the evidence group shows when this or `comments` is given. */
  photos?: number;
  comments?: number;
  /** Shows the cloud icon: the answer has not reached Visibuild yet. */
  notSynced?: boolean;
  /** Review view, Fail: whether a defect is still open ("Fail · defect open"). */
  defectOpen?: boolean;
  /** Answer view: a tap on Pass, Fail or N/A. */
  onAnswer?: (value: QaAnswerValue) => void;
  /** Answer view: Reopen on an answered item (back to open, kept in history). */
  onReopen?: () => void;
}

const BUILDER_STATUS: Record<QaItemState, { label: string; className: string }> = {
  open: { label: "Planned", className: "bg-muted text-muted-foreground" },
  fail: { label: "In progress", className: "bg-warning-soft text-warning-soft-foreground" },
  pass: { label: "Complete", className: "bg-success-soft text-success-soft-foreground" },
  na: { label: "Complete", className: "bg-success-soft text-success-soft-foreground" },
};

const RESULT: Record<Exclude<QaItemState, "open">, { label: string; className: string }> = {
  pass: { label: "Pass", className: "text-success-soft-foreground" },
  fail: { label: "Fail", className: "text-destructive" },
  na: { label: "N/A", className: "text-muted-foreground" },
};

function stateIcon(view: QaItemView, state: QaItemState) {
  if (view === "builder") {
    if (state === "open") return { Icon: Circle, className: "text-muted-foreground" };
    if (state === "fail") return { Icon: Clock, className: "text-warning-soft-foreground" };
    return { Icon: CircleCheck, className: "text-success-soft-foreground" };
  }
  if (state === "pass") return { Icon: CircleCheck, className: "text-success-soft-foreground" };
  if (state === "fail") return { Icon: CircleX, className: "text-destructive" };
  if (state === "na") return { Icon: CircleMinus, className: "text-muted-foreground" };
  return { Icon: Circle, className: "text-muted-foreground" };
}

const QaItem = React.forwardRef<HTMLDivElement, QaItemProps>(
  (
    {
      view = "answer",
      state = "open",
      size = "desktop",
      label,
      description,
      meta,
      photos,
      comments,
      notSynced = false,
      defectOpen = true,
      onAnswer,
      onReopen,
      className,
      ...props
    },
    ref
  ) => {
    const touch = size === "touch";
    const { Icon, className: iconClass } = stateIcon(view, state);
    const answered = state !== "open";

    const icon = <Icon aria-hidden className={cn("shrink-0", touch ? "size-5" : "size-4", iconClass)} />;
    const text = (
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body text-foreground">{label}</span>
        {description && <span className="text-body-sm text-muted-foreground">{description}</span>}
      </span>
    );
    const evidence =
      photos !== undefined || comments !== undefined ? (
        <span className="flex shrink-0 items-center gap-3 text-body-sm text-muted-foreground">
          {photos !== undefined && (
            <span className="flex items-center gap-1">
              <Camera aria-hidden className="size-3.5" />
              <span className="sr-only">Photos </span>
              {photos}
            </span>
          )}
          {comments !== undefined && (
            <span className="flex items-center gap-1">
              <MessageSquare aria-hidden className="size-3.5" />
              <span className="sr-only">Comments </span>
              {comments}
            </span>
          )}
        </span>
      ) : null;
    const metaText = meta ? <span className="shrink-0 whitespace-nowrap text-body-sm text-foreground">{meta}</span> : null;
    const cloud = notSynced ? (
      <CloudOff aria-label="Not synced" role="img" className="size-4 shrink-0 text-muted-foreground" />
    ) : null;

    // The right-hand end of a desktop row, or the bottom row of a touch card.
    let outcome: React.ReactNode = null;
    if (view === "builder") {
      const s = BUILDER_STATUS[state];
      outcome = (
        <span className={cn("shrink-0 self-start whitespace-nowrap rounded-md px-2 py-0.5 text-label", s.className)}>{s.label}</span>
      );
    } else if (view === "review") {
      if (!touch) {
        const r = state === "open" ? { label: "Open", className: "text-muted-foreground" } : RESULT[state];
        outcome = (
          <span className={cn("w-37.5 shrink-0 text-right text-body-strong", r.className)}>
            {r.label}
            {state === "fail" && defectOpen ? " · defect open" : ""}
          </span>
        );
      } else if (answered) {
        outcome = <span className={cn("text-body-strong", RESULT[state].className)}>{RESULT[state].label}</span>;
      }
    } else if (!answered) {
      outcome = <QaAnswer size={touch ? "touch" : "default"} value={null} onChange={onAnswer} />;
    } else {
      outcome = (
        <span className={cn("flex items-center gap-2", touch ? "w-full" : "w-61 justify-end")}>
          <span className={cn("text-body-strong", RESULT[state].className)}>{RESULT[state].label}</span>
          {touch && <span className="flex-1" />}
          <Button type="button" variant="ghost" size="sm" onClick={onReopen}>
            Reopen
          </Button>
        </span>
      );
    }

    const base = "border-b border-border bg-card";
    if (!touch) {
      return (
        <div
          ref={ref}
          data-view={view}
          data-state={state}
          data-size={size}
          className={cn(base, "flex items-center gap-4 px-4 py-2.5", className)}
          {...props}
        >
          {icon}
          {text}
          {evidence}
          {metaText}
          {cloud}
          {outcome}
        </div>
      );
    }
    return (
      <div
        ref={ref}
        data-view={view}
        data-state={state}
        data-size={size}
        className={cn(base, "flex flex-col gap-2.5 px-4 py-3.5", className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon}
          {text}
          {cloud}
        </div>
        {(metaText || evidence) && (
          <div className="flex items-center gap-3 pl-8">
            {metaText}
            {evidence}
          </div>
        )}
        {outcome}
      </div>
    );
  }
);
QaItem.displayName = "QaItem";

export { QaItem };
