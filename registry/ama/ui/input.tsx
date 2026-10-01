import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// text-field (16px) below md stops iOS zooming on focus; text-body from md up.
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-control w-full rounded-md border border-input bg-background px-3 text-field text-foreground md:text-body file:border-0 file:bg-transparent file:text-body file:font-medium disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-destructive",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
