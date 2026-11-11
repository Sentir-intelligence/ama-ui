"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Pattern/Shell avatar: the account button at the bottom of the app rail. A 44px target with a
// 32px circle on chrome showing the person's initial (or photo). It is a button so it can open the
// account menu (wrap it in the menu's trigger with asChild).

export interface ShellAvatarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The person's name or email; the first letter is shown when there is no photo. */
  name: string;
  /** Profile photo. */
  src?: string;
  /** Accessible name. Default "Account". */
  label?: string;
}

const ShellAvatar = React.forwardRef<HTMLButtonElement, ShellAvatarProps>(
  ({ name, src, label = "Account", className, ...props }, ref) => {
    const initial = name.trim().charAt(0).toUpperCase() || "?";
    return (
      <button
        ref={ref}
        type="button"
        data-surface="chrome"
        aria-label={label}
        className={cn(
          "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full",
          className
        )}
        {...props}
      >
        <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-chrome-hover text-label text-chrome-foreground">
          {src ? <img src={src} alt="" className="size-full object-cover" /> : initial}
        </span>
      </button>
    );
  }
);
ShellAvatar.displayName = "ShellAvatar";

export { ShellAvatar };
