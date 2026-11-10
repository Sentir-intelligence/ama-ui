"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Underline tabs for switching views of one record (Overview, Files, Activity).
// Active is the foreground label plus a 2px primary indicator, never background alone.
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  // Item count after the label, e.g. 3 comments. 0 is shown; leave undefined to hide.
  count?: number | string;
  // The current user is mentioned in this view: a primary "@".
  mention?: boolean;
  // There is something new in this view: a 6px primary dot.
  unread?: boolean;
}

// Height follows density: 40px in office densities, 48px (44px+ target) in touch.
// The mention and unread markers carry screen-reader text, so they never rely on the symbol alone.
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, children, count, mention = false, unread = false, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex h-row min-h-10 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-1 px-2 text-body whitespace-nowrap text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:text-foreground disabled:cursor-not-allowed disabled:text-disabled-foreground data-[state=active]:text-body-strong data-[state=active]:text-foreground data-[state=active]:after:bg-primary",
        className
      )}
      {...props}
    >
      {children}
      {/* The whitespace node is dropped by flex layout but keeps "Comments 3" as two words for screen readers. */}
      {count !== undefined && " "}
      {count !== undefined && (
        <span data-slot="tabs-count" className="text-table-cell text-muted-foreground">
          {count}
        </span>
      )}
      {mention && (
        <span data-slot="tabs-mention" className="text-body-strong text-primary">
          <span aria-hidden="true">@</span>
          <span className="sr-only">, mentioned</span>
        </span>
      )}
      {unread && (
        <span data-slot="tabs-unread">
          <span aria-hidden="true" className="block size-1.5 rounded-full bg-primary" />
          <span className="sr-only">, unread</span>
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn("mt-4", className)} {...props} />);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
