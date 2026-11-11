"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Pattern/Person row: one person in Settings · Users and roles. Avatar (photo or initials), name,
// detail (email · company), the role as a badge, and Invited until the invite is accepted.
// With onSelect the whole row is one 64px button that opens the person, with a chevron.
// Draws only: who is listed, their role and whether they are invited come from the app.

export interface PersonRowProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "role"> {
  name: string;
  /** Email · company (or the number of views for other external people). */
  detail: string;
  /** Shown as the role badge. */
  role: string;
  /** The person's photo; initials from the name when missing or while it loads. */
  avatarUrl?: string;
  /** Shows the Invited badge (the person has not signed in yet). */
  invited?: boolean;
  /** Opens the person. Without it the row is not interactive. */
  onSelect?: () => void;
}

/** Up to two initials: the first letters of the first and last words of the name. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const PersonRow = React.forwardRef<HTMLElement, PersonRowProps>(
  ({ name, detail, role, avatarUrl, invited = false, onSelect, className, ...props }, ref) => {
    const content = (
      <>
        <Avatar className="shrink-0">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>{initialsOf(name)}</AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-body-strong text-foreground">{name}</span>
          <span className="truncate text-caption text-muted-foreground">{detail}</span>
        </span>
        {invited && (
          <Badge variant="outline" className="shrink-0">
            Invited
          </Badge>
        )}
        <Badge variant="secondary" className="shrink-0">
          {role}
        </Badge>
        {onSelect && <ChevronRight aria-hidden className="size-6 shrink-0 text-foreground" />}
      </>
    );
    const rowClass = cn(
      "flex min-h-16 w-full items-center gap-3 border-b border-border bg-card py-2.5 pl-4 pr-3 text-left",
      className
    );
    if (onSelect) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onSelect}
          className={cn(rowClass, "hover:bg-row-hover")}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={rowClass} {...props}>
        {content}
      </div>
    );
  }
);
PersonRow.displayName = "PersonRow";

export { PersonRow };
