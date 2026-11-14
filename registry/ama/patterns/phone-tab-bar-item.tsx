import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Phone tab bar item: one tab of the phone bottom bar. Icon over label; Active tints the
// icon pill and uses primary, Default is muted. A dot shows something unread (with screen-reader
// text). The whole 76 x 56 cell is the touch target.
// Draws only: which tab is active and the unread state come from the app.

export interface PhoneTabBarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  unread?: boolean;
}

const PhoneTabBarItem = React.forwardRef<HTMLButtonElement, PhoneTabBarItemProps>(
  ({ icon: Icon, label, active = false, unread = false, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "flex h-14 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 pb-1.5 pt-2",
        active ? "text-primary" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className={cn("relative flex h-7 w-13 items-center justify-center rounded-full", active && "bg-row-selected")}>
        <Icon aria-hidden className="size-5" />
        {unread && <span aria-hidden className="absolute right-3 top-1 size-1.5 rounded-full bg-primary" />}
      </span>
      <span className={cn("text-caption", active && "font-semibold")}>{label}</span>
      {unread && <span className="sr-only">, unread</span>}
    </button>
  )
);
PhoneTabBarItem.displayName = "PhoneTabBarItem";

export { PhoneTabBarItem };
