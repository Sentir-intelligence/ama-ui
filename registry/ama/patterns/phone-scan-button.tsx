import * as React from "react";
import { ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Phone scan button: the centre of the phone tab bar on every screen. A raised 52px primary
// circle with a 4px card ring, then "Scan". The core yard loop is scan, act, scan the next panel.
// Draws only: the scanner is the app's.

export type PhoneScanButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PhoneScanButton = React.forwardRef<HTMLButtonElement, PhoneScanButtonProps>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn("relative flex h-14 w-19 cursor-pointer flex-col items-center justify-end gap-0.5 pb-1.5", className)}
    {...props}
  >
    <span className="absolute -top-5 left-1/2 flex size-13 -translate-x-1/2 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-sm">
      <ScanLine aria-hidden className="size-6" />
    </span>
    <span className="text-caption font-semibold text-foreground">Scan</span>
  </button>
));
PhoneScanButton.displayName = "PhoneScanButton";

export { PhoneScanButton };
