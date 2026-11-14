"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Pattern/Activity tabs (and Activity tabs touch): the filter row at the top of a panel's Activity
// tab. Staff see All, Mentions, Comments, Alerts, Log; builders see All, Raised, Comments, Updates.
// Size follows density: default is 40px, touch is 48px. Counts and the dot markers come from the app.
// Draws only: what each filter shows and its counts are decided by the app.

export type ActivityTabsAudience = "staff" | "builder";

export interface ActivityTabCounts {
  count?: number;
  /** Staff Mentions: the current user is mentioned. */
  mention?: boolean;
  unread?: boolean;
}

const TABS = {
  staff: [
    { value: "all", label: "All" },
    { value: "mentions", label: "Mentions" },
    { value: "comments", label: "Comments" },
    { value: "alerts", label: "Alerts" },
    { value: "log", label: "Log" },
  ],
  builder: [
    { value: "all", label: "All" },
    { value: "raised", label: "Raised" },
    { value: "comments", label: "Comments" },
    { value: "updates", label: "Updates" },
  ],
} as const;

export interface ActivityTabsProps extends Omit<React.ComponentPropsWithoutRef<typeof Tabs>, "onValueChange"> {
  audience?: ActivityTabsAudience;
  size?: "default" | "touch";
  /** Per tab value, e.g. { comments: { count: 3 }, mentions: { unread: true } }. */
  counts?: Partial<Record<string, ActivityTabCounts>>;
  onValueChange?: (value: string) => void;
}

const ActivityTabs = React.forwardRef<React.ElementRef<typeof Tabs>, ActivityTabsProps>(
  ({ audience = "staff", size = "default", counts = {}, value, defaultValue = "all", onValueChange, className, ...props }, ref) => (
    <Tabs
      ref={ref}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onValueChange={onValueChange}
      className={className}
      {...props}
    >
      <TabsList aria-label="Activity" className={cn("gap-1", size === "touch" && "overflow-x-auto")}>
        {TABS[audience].map((t) => (
          <TabsTrigger key={t.value} value={t.value} className={size === "touch" ? "h-12" : undefined} {...counts[t.value]}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
);
ActivityTabs.displayName = "ActivityTabs";

export { ActivityTabs };
