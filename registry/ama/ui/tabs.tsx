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

// Height follows density: 40px in office densities, 48px (44px+ target) in touch.
// Count, mention or unread dot go in as children after the label.
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex h-row min-h-10 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-1 px-2 text-body whitespace-nowrap text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:text-foreground disabled:cursor-not-allowed disabled:text-disabled-foreground data-[state=active]:text-body-strong data-[state=active]:text-foreground data-[state=active]:after:bg-primary",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn("mt-4", className)} {...props} />);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
