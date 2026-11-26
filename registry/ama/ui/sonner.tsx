"use client";

import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// Pattern/Toast (Figma Patterns): the toast container. A plain card with a shadow, one line by
// default; description and one action (for example Undo) are optional. Success after a save or
// submit, Warning for something to check, Error when it failed. Bottom right on desktop and tablet,
// top on phone; 4 s, pauses on hover. The feedback colour is the icon only; the card stays neutral.
// Callers use `toast` from "sonner": toast.success(title, { description, action }). Wrap the app once
// in <Toaster />. Toasts sit on the z-120 layer.

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="z-120"
      icons={{
        success: <CircleCheck className="size-5 text-foreground" aria-hidden="true" />,
        warning: <TriangleAlert className="size-5 text-warning-soft-foreground" aria-hidden="true" />,
        error: <CircleX className="size-5 text-destructive" aria-hidden="true" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-body text-card-foreground shadow-lg",
          title: "text-body",
          description: "text-body-sm text-muted-foreground",
          actionButton: "rounded-md bg-primary px-2.5 py-1 text-button-sm text-primary-foreground hover:bg-primary-hover",
          cancelButton: "rounded-md border border-input bg-background px-2.5 py-1 text-button-sm",
        },
      }}
      {...props}
    />
  );
}
