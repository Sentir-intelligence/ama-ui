// GENERATED from tokens/ama-tokens.json (v0.3.2) by scripts/build-tokens.mjs. Do not edit by hand.
// cn() that understands the AMA scale, so type roles, density sizes, radii and shadows are never silently dropped.
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display","page-title","title","section","body-strong","body","body-sm","label","caption","overline","table-header","table-cell","kpi","button","button-sm","field","id"],
      spacing: ["control","control-sm","control-lg","topbar","row","cell"],
      radius: ["xs","sm","md","lg","xl"],
      shadow: ["xs","sm","md","lg"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
