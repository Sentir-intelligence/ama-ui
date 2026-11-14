"use client";

import * as React from "react";
import { Camera, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

// Pattern/Photo tile: a photo thumbnail, cover-cropped. State: photo, add (dashed tile that opens
// the camera on phones and the file picker on desktop), uploading (progress bar) and not-synced
// (cloud badge until the photo reaches Visibuild). Size 56 or 72. With onSelect the tile is a button
// (full screen for a photo, the picker for Add). Draws only: uploads and sync come from the app.

export interface PhotoTileProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  state?: "photo" | "add" | "uploading" | "not-synced";
  size?: 56 | 72;
  /** The thumbnail; a skeleton fill shows while it is missing. */
  src?: string;
  alt?: string;
  /** Uploading: 0 to 100. */
  progress?: number;
  onSelect?: () => void;
}

const PhotoTile = React.forwardRef<HTMLElement, PhotoTileProps>(
  ({ state = "photo", size = 56, src, alt = "", progress = 0, onSelect, className, ...props }, ref) => {
    const add = state === "add";
    const content = (
      <>
        {add ? (
          <>
            <Camera aria-hidden className="size-4" />
            <span className="text-caption text-muted-foreground">Add</span>
          </>
        ) : src ? (
          <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
        ) : (
          <span aria-hidden className="absolute inset-0 bg-skeleton" />
        )}
        {state === "uploading" && (
          <span
            role="progressbar"
            aria-label="Uploading"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="absolute inset-x-1 bottom-1 h-1 overflow-hidden rounded-full bg-card"
          >
            <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </span>
        )}
        {state === "not-synced" && (
          <span
            role="img"
            aria-label="Not synced"
            className="absolute right-1 top-0.75 flex size-5 items-center justify-center rounded-full bg-card"
          >
            <CloudUpload aria-hidden className="size-3" />
          </span>
        )}
      </>
    );
    const base = cn(
      "relative flex shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg border text-muted-foreground",
      size === 72 ? "size-18" : "size-14",
      add ? "border-dashed border-border-strong bg-card" : "border-border bg-surface-sunken",
      className
    );
    if (onSelect) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          aria-label={add ? "Add photo" : alt || "Open photo"}
          onClick={onSelect}
          className={cn(base, "hover:bg-accent")}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={base} {...props}>
        {content}
      </div>
    );
  }
);
PhotoTile.displayName = "PhotoTile";

export { PhotoTile };
