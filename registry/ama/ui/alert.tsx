import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheck, Info, TriangleAlert, CircleX, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Feedback for alerts, inline validation summaries and toasts. Always icon plus left rule, never a pill,
// so feedback can't be mistaken for a lifecycle status. Never place inside table rows.
const alertVariants = cva("flex gap-2.5 rounded-md border border-l-4 p-3 text-body-sm text-foreground", {
  variants: {
    variant: {
      success: "border-success-border border-l-success bg-success-soft",
      warning: "border-warning-border border-l-warning bg-warning-soft",
      info: "border-info-border border-l-info bg-info-soft",
      destructive: "border-destructive-border border-l-destructive bg-destructive-soft",
    },
  },
  defaultVariants: { variant: "info" },
});

const ICON: Record<NonNullable<VariantProps<typeof alertVariants>["variant"]>, [LucideIcon, string]> = {
  success: [CircleCheck, "text-success-soft-foreground"],
  warning: [TriangleAlert, "text-warning-soft-foreground"],
  info: [Info, "text-info-soft-foreground"],
  destructive: [CircleX, "text-destructive-soft-foreground"],
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "info", title, children, ...props }, ref) => {
  const [Icon, tone] = ICON[variant ?? "info"];
  return (
    <div ref={ref} role={variant === "destructive" || variant === "warning" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone)} aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        {title && <div className={cn("text-body-strong", tone)}>{title}</div>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
});
Alert.displayName = "Alert";
