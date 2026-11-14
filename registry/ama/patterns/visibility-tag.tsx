import * as React from "react";
import { ChevronDown, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Visibility tag: who can see a comment. Internal (Lock) is AMA staff only; External (Globe)
// is shared with the builder. 20px, outlined, never colour alone: the icon and the word both say it.
// With `menu` it is a button with a chevron that opens the app's visibility menu.
// Draws only: who may change the visibility comes from the app.

export type Visibility = "internal" | "external";

export interface VisibilityTagProps extends React.HTMLAttributes<HTMLElement> {
  visibility: Visibility;
  /** Draws a chevron and renders a button; the app opens the menu on click. */
  menu?: boolean;
}

const VisibilityTag = React.forwardRef<HTMLElement, VisibilityTagProps>(
  ({ visibility, menu = false, className, ...props }, ref) => {
    const Icon = visibility === "internal" ? Lock : Globe;
    const base = cn(
      "inline-flex h-5 shrink-0 items-center gap-1 rounded-sm border border-border px-1.5 text-caption text-muted-foreground",
      className
    );
    const content = (
      <>
        <Icon aria-hidden className="size-3" />
        {visibility === "internal" ? "Internal" : "External"}
        {menu && <ChevronDown aria-hidden className="-mr-1 size-3" />}
      </>
    );
    if (menu) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          aria-haspopup="menu"
          className={cn(base, "cursor-pointer hover:bg-accent")}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} data-visibility={visibility} className={base} {...props}>
        {content}
      </span>
    );
  }
);
VisibilityTag.displayName = "VisibilityTag";

export { VisibilityTag };
