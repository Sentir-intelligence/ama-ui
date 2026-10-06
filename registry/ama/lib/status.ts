// GENERATED from tokens/ama-tokens.json (v0.3.3) by scripts/build-tokens.mjs. Do not edit by hand.
// Status keys mirror the database enum (elements.status). Order is the lifecycle ladder, lowest first.
export const STATUS = {
  "not_drawn": {
    "label": "Not Drawn",
    "icon": "pencil-off",
    "description": "No shop drawing yet."
  },
  "takeoff": {
    "label": "Takeoff",
    "icon": "ruler",
    "description": "Quantities taken off for estimating."
  },
  "ifa": {
    "label": "IFA",
    "icon": "file-clock",
    "description": "Drawing issued for approval."
  },
  "ifc": {
    "label": "IFC",
    "icon": "file-check",
    "description": "Drawing issued for construction. Only IFC elements can be scheduled or cast."
  },
  "scheduled": {
    "label": "Scheduled",
    "icon": "calendar-clock",
    "description": "Booked for manufacture."
  },
  "manufactured": {
    "label": "Manufactured",
    "icon": "factory",
    "description": "Cast (pour docket recorded)."
  },
  "manifested": {
    "label": "Manifested",
    "icon": "clipboard-list",
    "description": "Staged, load documentation printed and driver notified."
  },
  "dispatched": {
    "label": "Dispatched",
    "icon": "send",
    "description": "Driver has left the warehouse with the load."
  },
  "with_driver": {
    "label": "With Driver",
    "icon": "truck",
    "description": "Driver has had to keep the load overnight."
  },
  "delivered": {
    "label": "Delivered",
    "icon": "package-check",
    "description": "Delivered to site."
  }
} as const;

export type StatusKey = keyof typeof STATUS;
export const STATUS_KEYS = Object.keys(STATUS) as StatusKey[];
