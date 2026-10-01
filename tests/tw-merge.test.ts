import { cn } from "@/lib/utils";

// cn() must understand the AMA scale, or shadcn-style className overrides silently drop styles.
describe("cn() with the AMA merge config", () => {
  it.each([
    ["text-label text-muted-foreground", "text-label text-muted-foreground"],
    ["text-body text-caption", "text-caption"],
    ["text-field md:text-body text-body", "md:text-body text-body"],
    ["h-9 h-control", "h-control"],
    ["h-control h-control-sm", "h-control-sm"],
    ["px-2 px-cell", "px-cell"],
    ["shadow-xs shadow-lg", "shadow-lg"],
    ["rounded-md rounded-xl", "rounded-xl"],
    ["text-kpi text-primary", "text-kpi text-primary"],
  ])("%s -> %s", (input, expected) => {
    expect(cn(input)).toBe(expected);
  });
});
