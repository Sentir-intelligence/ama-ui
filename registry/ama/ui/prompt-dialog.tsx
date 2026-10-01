"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Reusable single-input prompt dialog. Replaces the native browser prompt()
 * for naming actions (e.g. "Name the cloned view"). Seeds the input from
 * defaultValue each time it opens, submits on Enter, and disables submit when
 * empty.
 */
interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: (value: string) => void;
}

export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  label = "Name",
  placeholder,
  defaultValue = "",
  confirmLabel = "Confirm",
  loading = false,
  error,
  onConfirm,
}: PromptDialogProps) {
  const [value, setValue] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setValue(defaultValue);
      // Focus + select after the dialog paints.
      const t = setTimeout(() => inputRef.current?.select(), 50);
      return () => clearTimeout(t);
    }
  }, [open, defaultValue]);

  const canConfirm = value.trim().length > 0 && !loading;

  function submit() {
    if (!canConfirm) return;
    onConfirm(value.trim());
  }

  return (
    <Dialog open={open} onOpenChange={loading ? () => {} : onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="prompt-dialog-input">{label}</Label>
          <Input
            id="prompt-dialog-input"
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            disabled={loading}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>

        {error && (
          <div role="alert" className="rounded-md border border-destructive-border border-l-4 border-l-destructive bg-destructive-soft px-3 py-2 text-body-sm text-destructive-soft-foreground">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={!canConfirm}>
            {loading ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
