import * as React from "react";
import {
  CalendarClock,
  ClipboardList,
  Factory,
  FileCheck,
  FileClock,
  PackageCheck,
  PencilOff,
  Ruler,
  Send,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS, type StatusKey } from "@/lib/status";

// The only way a lifecycle status is shown. A neutral tag with a solid status-colour swatch holding the icon,
// then the label. Colour family (Andrew's code), icon and label always travel together, so a status reads without
// colour (colour blindness, glare, Windows high contrast). Styling lives in status-chip.css, driven by data-status.
export const STATUS_ICONS: Record<StatusKey, LucideIcon> = {
  not_drawn: PencilOff,
  takeoff: Ruler,
  ifa: FileClock,
  ifc: FileCheck,
  scheduled: CalendarClock,
  manufactured: Factory,
  manifested: ClipboardList,
  dispatched: Send,
  with_driver: Truck,
  delivered: PackageCheck,
};

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusKey;
}

export const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(({ status, className, children, ...props }, ref) => {
  const Icon = STATUS_ICONS[status];
  return (
    <span ref={ref} data-status={status} className={cn("status-chip", className)} {...props}>
      <span className="status-chip__swatch" aria-hidden="true">
        <Icon focusable="false" />
      </span>
      <span className="status-chip__label">{children ?? STATUS[status].label}</span>
    </span>
  );
});
StatusChip.displayName = "StatusChip";
