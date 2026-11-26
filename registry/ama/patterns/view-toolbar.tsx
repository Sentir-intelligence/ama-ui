"use client";

import * as React from "react";
import { Columns3, Download, Funnel, Plus, Redo2, Rows3, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/patterns/icon-button";
import { cn } from "@/lib/utils";

// Pattern/View toolbar: the bar above a view's rows: search, undo, redo, the count (N of the
// matching set), Group by, Filters (with the number of active filters), Columns, Download (CSV or
// PDF) and Add element. Group by, Filters, Columns and Download only report a press (the app opens
// its own menu or panel and can pass `open`); Add element shows only when its handler is given.
// Draws only: the app searches, groups and filters.

export interface ViewToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  /** For example "9 of 9". */
  count?: string;
  /** The grouping now, for example "None" or "Stage". */
  groupBy?: string;
  onGroupBy?: () => void;
  /** Number of active filters; shown as "Filters · 2" and tinted when above 0. */
  filterCount?: number;
  onFilters?: () => void;
  onColumns?: () => void;
  onDownload?: () => void;
  /** Shows Add element. */
  onAddElement?: () => void;
  /** Which of the four menu buttons has its menu or panel open. */
  open?: "groupBy" | "filters" | "columns" | "download";
}

const ViewToolbar = React.forwardRef<HTMLDivElement, ViewToolbarProps>(
  (
    {
      search,
      onSearchChange,
      searchPlaceholder = "Search project, panel #, stage, type…",
      onUndo,
      onRedo,
      canUndo = true,
      canRedo = true,
      count,
      groupBy = "None",
      onGroupBy,
      filterCount = 0,
      onFilters,
      onColumns,
      onDownload,
      onAddElement,
      open,
      className,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} role="toolbar" aria-label="View toolbar" className={cn("flex items-center gap-2", className)} {...props}>
      <Input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label="Search the view"
        className="w-70"
      />
      <IconButton icon={Undo2} label="Undo" onClick={onUndo} disabled={!onUndo || !canUndo} />
      <IconButton icon={Redo2} label="Redo" onClick={onRedo} disabled={!onRedo || !canRedo} />
      {count && <span className="text-body-sm whitespace-nowrap text-muted-foreground">{count}</span>}
      <span className="flex-1" aria-hidden="true" />
      <Button type="button" variant="ghost" size="sm" data-state={open === "groupBy" ? "open" : undefined} onClick={onGroupBy}>
        <Rows3 aria-hidden="true" />
        Group by {groupBy}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        data-state={open === "filters" ? "open" : undefined}
        className={cn(filterCount > 0 && "text-primary hover:text-primary")}
        onClick={onFilters}
      >
        <Funnel aria-hidden="true" />
        {filterCount > 0 ? `Filters · ${filterCount}` : "Filters"}
      </Button>
      <IconButton icon={Columns3} label="Columns" open={open === "columns"} onClick={onColumns} />
      <IconButton icon={Download} label="Download (CSV or PDF)" open={open === "download"} onClick={onDownload} />
      {onAddElement && <IconButton icon={Plus} label="Add element" onClick={onAddElement} />}
    </div>
  ),
);
ViewToolbar.displayName = "ViewToolbar";

export { ViewToolbar };
