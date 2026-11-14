"use client";

import * as React from "react";
import { CircleAlert, ImagePlus, MessageSquare, Pencil, Send, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisibilityToggle } from "@/components/patterns/visibility-toggle";
import type { Visibility } from "@/components/patterns/visibility-tag";
import { cn } from "@/lib/utils";

// Pattern/Activity composer: the one-row box at the bottom of the Activity tab. The Post to select
// (the panel or element the comment lands on), then by mode:
//   internal / external  visibility toggle, input, add photo, Send (or "Send to builder")
//   no-toggle            input and Send, for people who can post only one kind
//   builder              post type select (Comment, Change request, Defect, Issue), input, send
//                        label that follows the type (Send, Raise request, Raise defect, Raise issue)
// Attached photos show as 48px tiles above the row until sent. On phones the post type is the
// icon-only Select. Replies reuse the composer inline with `reply` (no pickers or toggle).
// Draws only: who may post what, mentions, uploads and sending come from the app.

export type ActivityComposerMode = "internal" | "external" | "no-toggle" | "builder";
export type BuilderPostType = "comment" | "change-request" | "defect" | "issue";

const POST_TYPES = {
  comment: { label: "Comment", Icon: MessageSquare, placeholder: "Comment, @ to mention", send: "Send" },
  "change-request": { label: "Change request", Icon: Pencil, placeholder: "Describe the change you need", send: "Raise request" },
  defect: { label: "Defect", Icon: TriangleAlert, placeholder: "Describe the defect", send: "Raise defect" },
  issue: { label: "Issue", Icon: CircleAlert, placeholder: "Describe the issue", send: "Raise issue" },
} as const;

export interface ActivityComposerPhoto {
  src: string;
  alt?: string;
}

export interface ActivityComposerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit"> {
  mode?: ActivityComposerMode;
  /** Post to options, e.g. ["L2-P005", "Level 2"]. Hidden when empty or in reply. */
  postTo?: string[];
  postToValue?: string;
  onPostToChange?: (value: string) => void;
  /** Internal or external (the toggle in those modes). */
  visibility?: Visibility;
  onVisibilityChange?: (value: Visibility) => void;
  postType?: BuilderPostType;
  onPostTypeChange?: (value: BuilderPostType) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  photos?: ActivityComposerPhoto[];
  onAddPhoto?: () => void;
  onRemovePhoto?: (index: number) => void;
  onSend?: () => void;
  /** Phones: the post type select shows its icon only. */
  compact?: boolean;
  /** Inline reply: no Post to, no toggle, no post type. */
  reply?: boolean;
  /** External comments from staff: the send label reads "Send to builder". */
  sendLabel?: string;
}

const ActivityComposer = React.forwardRef<HTMLDivElement, ActivityComposerProps>(
  (
    {
      mode = "internal",
      postTo = [],
      postToValue,
      onPostToChange,
      visibility,
      onVisibilityChange,
      postType = "comment",
      onPostTypeChange,
      value,
      onValueChange,
      photos = [],
      onAddPhoto,
      onRemovePhoto,
      onSend,
      compact = false,
      reply = false,
      sendLabel,
      className,
      ...props
    },
    ref
  ) => {
    const builder = mode === "builder";
    const toggle = mode === "internal" || mode === "external";
    const vis = visibility ?? (mode === "external" ? "external" : "internal");
    const type = POST_TYPES[postType];
    const placeholder = builder
      ? type.placeholder
      : vis === "external"
        ? "Comment externally, @ to mention"
        : mode === "no-toggle"
          ? "Comment, @ to mention"
          : "Comment internally, @ to mention";
    const send = sendLabel ?? (builder ? type.send : toggle && vis === "external" ? "Send to builder" : "Send");
    return (
      <div ref={ref} data-mode={mode} className={cn("flex flex-col gap-2 border-t border-border bg-card p-3", className)} {...props}>
        {photos.length > 0 && (
          <ul aria-label="Attached photos" className="flex gap-2">
            {photos.map((p, i) => (
              <li key={p.src} className="relative size-12 overflow-hidden rounded-md border border-border bg-surface-sunken">
                <img src={p.src} alt={p.alt ?? ""} className="size-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => onRemovePhoto?.(i)}
                  className="absolute right-0.5 top-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full bg-card text-foreground"
                >
                  <X aria-hidden className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          {!reply && postTo.length > 0 && (
            <Select value={postToValue} onValueChange={onPostToChange}>
              <SelectTrigger aria-label="Post to" className="w-37.5 shrink-0">
                <SelectValue placeholder="Post to" />
              </SelectTrigger>
              <SelectContent>
                {postTo.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!reply && toggle && <VisibilityToggle value={vis} onChange={onVisibilityChange} />}
          {!reply && builder && (
            <Select value={postType} onValueChange={(v) => onPostTypeChange?.(v as BuilderPostType)}>
              <SelectTrigger
                aria-label="Post type"
                showValue={!compact}
                icon={<type.Icon />}
                className={cn(!compact && "w-44 shrink-0")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(POST_TYPES) as BuilderPostType[]).map((k) => {
                  const { Icon, label } = POST_TYPES[k];
                  return (
                    <SelectItem key={k} value={k}>
                      <span className="flex items-center gap-2">
                        <Icon aria-hidden className="size-4" />
                        {label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
          <Input
            aria-label="Comment"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="min-w-0 flex-1"
          />
          {onAddPhoto && (
            <Button type="button" variant="ghost" size="icon" aria-label="Add photo" onClick={onAddPhoto}>
              <ImagePlus aria-hidden />
            </Button>
          )}
          <Button type="button" onClick={onSend}>
            {compact ? <Send aria-hidden /> : null}
            <span className={cn(compact && "sr-only")}>{send}</span>
          </Button>
        </div>
      </div>
    );
  }
);
ActivityComposer.displayName = "ActivityComposer";

export { ActivityComposer };
