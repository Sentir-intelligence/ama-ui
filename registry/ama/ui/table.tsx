import * as React from "react";
import { cn } from "@/lib/utils";

// Row height, cell padding and cell text follow data-density (compact by default for tables).
// Selection is never background alone: data-state="selected" adds the left indicator bar too.
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement> & { density?: "compact" | "comfortable" | "touch" }>(
  ({ className, density = "compact", ...props }, ref) => (
    <div className="relative w-full overflow-auto" data-density={density}>
      <table ref={ref} className={cn("w-full caption-bottom text-table-cell", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-surface-sunken [&_tr]:border-b [&_tr]:border-border", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t border-border bg-surface-sunken font-medium [&>tr]:last:border-b-0", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-row-hover data-[state=selected]:bg-row-selected data-[state=selected]:indicator-left",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("h-row px-cell text-left align-middle text-table-header text-muted-foreground [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("h-row px-cell align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
));
TableCell.displayName = "TableCell";

// New, additive: the whole cell is the click target for its checkbox (rule: hit area at least 24px).
const TableCheckboxCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <td ref={ref} className={cn("w-10 p-0 align-middle", className)} {...props}>
      <label className="flex h-row w-full cursor-pointer items-center justify-center">{children}</label>
    </td>
  )
);
TableCheckboxCell.displayName = "TableCheckboxCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-caption text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCheckboxCell, TableCaption };
