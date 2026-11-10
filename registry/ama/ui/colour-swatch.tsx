"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { StageCloud } from "@/components/icons/stage-cloud";
import { cn } from "@/lib/utils";

// Stage cloud colour picker: a radio group of round 28px buttons. Each swatch is the stage-cloud glyph
// drawn in the colour it will draw on the plan. The set is fixed to the chart tokens 1 to 5.
// Selected shows the ring. Every swatch needs an aria-label that names the colour.
const SWATCH_COLOURS = {
  1: "text-chart-1",
  2: "text-chart-2",
  3: "text-chart-3",
  4: "text-chart-4",
  5: "text-chart-5",
} as const;

type SwatchColour = keyof typeof SWATCH_COLOURS;

const ColourSwatchGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn("flex flex-wrap items-center gap-2", className)}
    {...props}
  />
));
ColourSwatchGroup.displayName = "ColourSwatchGroup";

export interface ColourSwatchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "children" | "aria-label"> {
  colour: SwatchColour;
  "aria-label": string;
}

const ColourSwatch = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, ColourSwatchProps>(
  ({ className, colour, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-colour={colour}
      className={cn(
        "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors hover:bg-accent disabled:cursor-not-allowed data-[state=checked]:border-ring",
        SWATCH_COLOURS[colour],
        className
      )}
      {...props}
    >
      <StageCloud size={20} />
    </RadioGroupPrimitive.Item>
  )
);
ColourSwatch.displayName = "ColourSwatch";

export { ColourSwatchGroup, ColourSwatch, SWATCH_COLOURS };
export type { SwatchColour };
