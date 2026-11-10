"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

// Segmented control for 2 to 4 peer options inside a panel (Shop drawing / Floor plan).
// Not for page-level navigation: use Tabs.
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("inline-flex items-center gap-1", className)} {...props} />
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

// Selected is the card fill plus a border, so it never relies on background alone.
// The border is always drawn (transparent when off) so selecting does not shift the layout.
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex h-control shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-transparent px-4 text-label whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:text-disabled-foreground data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:text-foreground",
      className
    )}
    {...props}
  />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
