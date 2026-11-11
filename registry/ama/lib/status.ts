// GENERATED from tokens/ama-tokens.json (v0.3.6) by scripts/build-tokens.mjs. Do not edit by hand.
// Status keys mirror the database enum (elements.status). Order is the lifecycle ladder, lowest first.
export const STATUS = {
  "not_drawn": {
    "label": "Not Drawn",
    "icon": "pencil-off",
    "description": "No shop drawing yet."
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
    "description": "QA marks Poured."
  },
  "manifested": {
    "label": "Manifested",
    "icon": "clipboard-list",
    "description": "Load booked by the office."
  },
  "dispatched": {
    "label": "Dispatched",
    "icon": "send",
    "description": "Driver form done and the truck has left."
  },
  "with_driver": {
    "label": "With Driver",
    "icon": "truck",
    "description": "Not delivered; the load is kept at the driver's depot overnight."
  },
  "delivered": {
    "label": "Delivered",
    "icon": "package-check",
    "description": "Proof of delivery."
  }
} as const;

export type StatusKey = keyof typeof STATUS;
export const STATUS_KEYS = Object.keys(STATUS) as StatusKey[];
