"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Pattern/Comment box: one soft box for writing text. Floating is a comment on a markup (sits beside
// the pin on the drawing or plan, with a shadow). Inline is a view or Board description (reads as
// plain text until clicked; Cancel and the submit button appear while editing). One border, no box
// inside a box; the border takes the ring colour while typing; @mentions show in primary.
// Enter posts, Shift+Enter adds a line, Esc cancels. Draws only: the app saves and parses mentions.

export interface CommentBoxProps {
  variant?: "floating" | "inline";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** "Post" or "Save". */
  submitLabel?: string;
  onSubmit: () => void;
  onCancel: () => void;
  autoFocus?: boolean;
  className?: string;
}

// "@Tom", or "@Tom B" with one capitalised word after it. The app owns the real mention rules.
const MENTION = /(@\p{L}[\p{L}\p{N}_-]*(?: \p{Lu}\p{Ll}*)?)/gu;

function highlight(text: string) {
  return text.split(MENTION).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-primary">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const CommentBox = React.forwardRef<HTMLTextAreaElement, CommentBoxProps>(
  (
    { variant = "floating", value, onChange, placeholder = "Add a comment, @ to mention", submitLabel = "Post", onSubmit, onCancel, autoFocus, className },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const editing = focused || value.length > 0;
    const showActions = variant === "floating" || editing;
    const canSubmit = value.trim().length > 0;
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSubmit) onSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    return (
      <div
        data-variant={variant}
        data-editing={editing ? "" : undefined}
        className={cn(
          "flex flex-col gap-2 rounded-lg border p-3",
          variant === "floating" ? "bg-card shadow-lg" : "bg-card",
          editing ? "border-ring" : variant === "floating" ? "border-border" : "border-transparent bg-muted",
          className,
        )}
      >
        {/* The highlighted copy sets the height; the transparent textarea on top takes the typing. */}
        <div className="grid">
          <div aria-hidden="true" className="col-start-1 row-start-1 min-h-6 text-body break-words whitespace-pre-wrap text-foreground">
            {highlight(value)}
            {"\n"}
          </div>
          <textarea
            ref={ref}
            value={value}
            rows={1}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="col-start-1 row-start-1 min-h-6 w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-body text-transparent caret-foreground outline-hidden placeholder:text-placeholder"
          />
        </div>
        {showActions && (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" size="sm" disabled={!canSubmit} onClick={onSubmit}>
              {submitLabel}
            </Button>
          </div>
        )}
      </div>
    );
  },
);
CommentBox.displayName = "CommentBox";

export { CommentBox };
