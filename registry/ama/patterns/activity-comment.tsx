"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VisibilityTag, type Visibility } from "@/components/patterns/visibility-tag";
import { cn } from "@/lib/utils";

// Pattern/Activity comment: one comment in the Activity tab. Avatar, name, age and a visibility tag,
// then the body (an @mention is ActivityMention), an optional photo grid of 96px tiles (the last
// shows +N when there are more than `maxPhotos`), and a footer with Reply and the reply count.
// Unread adds a 6px primary dot before the name and a selected-row background. Replies are
// ActivityComments inside `children`, indented under the parent.
// Draws only: threading, unread state and visibility come from the app.

export interface ActivityCommentPhoto {
  src: string;
  alt?: string;
}

export interface ActivityCommentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  author: string;
  /** Initials shown while the photo loads or when there is none. */
  initials: string;
  avatarSrc?: string;
  age: string;
  visibility?: Visibility;
  unread?: boolean;
  photos?: ActivityCommentPhoto[];
  /** Photos shown before the +N tile. */
  maxPhotos?: number;
  /** "3 replies · last 2h ago"; shown in the footer when set. */
  replySummary?: string;
  onReply?: () => void;
  onOpenPhoto?: (index: number) => void;
}

/** An @mention inside a comment body. */
const ActivityMention = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-xs bg-accent px-0.5 text-primary">{children}</span>
);

const ActivityComment = React.forwardRef<HTMLDivElement, ActivityCommentProps>(
  (
    {
      author,
      initials,
      avatarSrc,
      age,
      visibility = "internal",
      unread = false,
      photos = [],
      maxPhotos = 4,
      replySummary,
      onReply,
      onOpenPhoto,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const shown = photos.length > maxPhotos ? photos.slice(0, maxPhotos) : photos;
    const extra = photos.length - shown.length;
    // The body is the plain text children; replies are ActivityComment elements.
    const nodes = React.Children.toArray(children);
    const isReply = (n: React.ReactNode) => React.isValidElement(n) && n.type === ActivityComment;
    const body = nodes.filter((n) => !isReply(n));
    const replies = nodes.filter(isReply);
    return (
      <div
        ref={ref}
        data-unread={unread || undefined}
        className={cn("flex flex-col gap-2 px-4 py-3", unread && "bg-row-selected", className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Avatar>
            {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              {unread && (
                <>
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="sr-only">Unread, </span>
                </>
              )}
              <span className="text-body-strong text-foreground">{author}</span>
              <span className="text-body-sm text-muted-foreground">{age}</span>
              <VisibilityTag visibility={visibility} className="ml-auto" />
            </div>
            <div className="text-body text-foreground">{body}</div>
            {shown.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {shown.map((p, i) => {
                  const last = i === shown.length - 1 && extra > 0;
                  return (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => onOpenPhoto?.(i)}
                      aria-label={last ? `${extra} more photos` : p.alt || "Open photo"}
                      className="relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-surface-sunken"
                    >
                      <img src={p.src} alt={p.alt ?? ""} className="absolute inset-0 size-full object-cover" />
                      {last && (
                        <span className="absolute inset-0 flex items-center justify-center bg-overlay text-title text-primary-foreground">
                          +{extra}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {(onReply || replySummary) && (
              <div className="flex items-center gap-3 pt-0.5">
                {onReply && (
                  <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={onReply}>
                    Reply
                  </Button>
                )}
                {replySummary && <span className="text-body-sm text-muted-foreground">{replySummary}</span>}
              </div>
            )}
          </div>
        </div>
        {replies.length > 0 && <div className="ml-10 flex flex-col border-l border-border">{replies}</div>}
      </div>
    );
  }
);
ActivityComment.displayName = "ActivityComment";

export { ActivityComment, ActivityMention };
