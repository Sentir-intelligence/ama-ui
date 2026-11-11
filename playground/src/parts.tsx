// Shared playground layout: a titled card per component or pattern, labelled rows, a phone frame.
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/\W+/g, "-");
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {note && <CardDescription>{note}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// A phone-width frame for patterns drawn at 390px in Figma.
export function Phone({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card">{children}</div>;
}
