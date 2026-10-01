import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// For counts and tags only. Lifecycle statuses always use <StatusChip>, never a Badge.
const badgeVariants = cva("inline-flex h-5 items-center rounded-sm border px-1.5 text-label", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-border bg-muted text-foreground",
      destructive: "border-transparent bg-destructive text-destructive-foreground",
      outline: "border-border text-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
