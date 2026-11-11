"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Shell menu tab: one tab across the top of the shell's menu sheet (Views, Documents,
// Activity). Icon over the label, the full 48px bar height; the active tab is foreground with a
// 2px selected indicator underneath. Use inside an element with role="tablist".

export interface ShellMenuTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

const ShellMenuTab = React.forwardRef<HTMLButtonElement, ShellMenuTabProps>(
  ({ icon: Icon, label, active = false, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "relative flex h-topbar flex-1 cursor-pointer flex-col items-center justify-center gap-0.5",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <Icon aria-hidden className="size-5" />
      <span className="text-label">{label}</span>
      {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-selected-indicator" />}
    </button>
  )
);
ShellMenuTab.displayName = "ShellMenuTab";

export { ShellMenuTab };
