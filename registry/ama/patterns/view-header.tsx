"use client";

import * as React from "react";
import { Copy, Share2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/patterns/icon-button";
import { cn } from "@/lib/utils";

// Pattern/View header: a saved view's header. The title with Pin, Clone, Share (people, groups or
// everyone; CSV and PDF inside) and Delete (owner only, quiet destructive) beside it, and an
// editable description underneath ("Add a description…" when empty). Unsaved views use the Preview
// bar instead. An action shows only when its handler is given, so the app decides who sees Pin and
// Delete. Draws only: the description opens in a Comment box (inline) when pressed.

export interface ViewHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  description?: string;
  /** Pressing the description: the app swaps in a Comment box (inline). */
  onEditDescription?: () => void;
  /** Shows Pin. */
  onPin?: () => void;
  pinned?: boolean;
  onClone?: () => void;
  onShare?: () => void;
  /** Shows Delete: give it to the owner only. */
  onDelete?: () => void;
}

const ViewHeader = React.forwardRef<HTMLDivElement, ViewHeaderProps>(
  ({ title, description, onEditDescription, onPin, pinned = false, onClone, onShare, onDelete, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex items-center gap-1">
        <h2 className="min-w-0 truncate text-title text-foreground">{title}</h2>
        <span className="w-2 shrink-0" aria-hidden="true" />
        {onPin && <IconButton icon={Star} label={pinned ? "Unpin view" : "Pin view"} tinted={pinned} onClick={onPin} />}
        {onClone && <IconButton icon={Copy} label="Clone view" onClick={onClone} />}
        {onShare && <IconButton icon={Share2} label="Share view" onClick={onShare} />}
        {onDelete && (
          <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
        )}
      </div>
      {(description || onEditDescription) && (
        <button
          type="button"
          onClick={onEditDescription}
          disabled={!onEditDescription}
          className={cn(
            "w-fit max-w-full cursor-pointer truncate text-left text-body disabled:cursor-default",
            description ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {description || "Add a description…"}
        </button>
      )}
    </div>
  ),
);
ViewHeader.displayName = "ViewHeader";

export { ViewHeader };
