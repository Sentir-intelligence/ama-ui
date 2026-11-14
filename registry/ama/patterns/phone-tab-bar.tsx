"use client";

import * as React from "react";
import { ClipboardList, Ellipsis, FileText, House, MessageSquare } from "lucide-react";
import { PhoneScanButton } from "@/components/patterns/phone-scan-button";
import { PhoneTabBarItem } from "@/components/patterns/phone-tab-bar-item";
import { cn } from "@/lib/utils";

// Pattern/Phone tab bar: the phone bottom bar. Overview, Activity, Scan (centre, every screen), QA,
// More. Builders swap QA for Files (QA moves into More). Includes the 24px home indicator safe area.
// Set `active` to one tab. Draws only: the tab set and unread dots come from the app.

export type PhoneTab = "overview" | "activity" | "qa" | "files" | "more";

const TABS = {
  overview: { label: "Overview", icon: House },
  activity: { label: "Activity", icon: MessageSquare },
  qa: { label: "QA", icon: ClipboardList },
  files: { label: "Files", icon: FileText },
  more: { label: "More", icon: Ellipsis },
} as const;

export interface PhoneTabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  audience?: "staff" | "builder";
  active?: PhoneTab;
  unread?: Partial<Record<PhoneTab, boolean>>;
  onSelect?: (tab: PhoneTab) => void;
  onScan?: () => void;
}

const PhoneTabBar = React.forwardRef<HTMLElement, PhoneTabBarProps>(
  ({ audience = "staff", active, unread = {}, onSelect, onScan, className, ...props }, ref) => {
    const fourth: PhoneTab = audience === "builder" ? "files" : "qa";
    const item = (tab: PhoneTab) => (
      <PhoneTabBarItem
        key={tab}
        icon={TABS[tab].icon}
        label={TABS[tab].label}
        active={active === tab}
        unread={unread[tab]}
        onClick={() => onSelect?.(tab)}
      />
    );
    return (
      <nav
        ref={ref}
        aria-label="Panel"
        className={cn("flex items-start justify-between border-t border-border bg-card px-2 pb-6", className)}
        {...props}
      >
        <div role="tablist" aria-label="Panel views" className="contents">
          {item("overview")}
          {item("activity")}
          <PhoneScanButton onClick={onScan} className="flex-1" />
          {item(fourth)}
          {item("more")}
        </div>
      </nav>
    );
  }
);
PhoneTabBar.displayName = "PhoneTabBar";

export { PhoneTabBar };
