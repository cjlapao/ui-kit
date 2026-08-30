import React from "react";
import { StatCard } from "@cjlapao/ui-kit";
import type {
  SmartGridItemDefinition,
  SmartGridSectionDefinition,
} from "@cjlapao/ui-kit";

/** A tile that looks like something a real dashboard would hold. */
const tile = (
  label: string,
  value: React.ReactNode,
  icon: "Database" | "Rocket" | "Shop" | "HealthCheck",
) =>
  function Tile() {
    return (
      <StatCard
        label={label}
        value={value}
        icon={icon}
        variant="elevated"
        className="h-full"
      />
    );
  };

export const DASHBOARD_ITEMS: SmartGridItemDefinition[] = [
  { id: "capsules", title: "Active capsules", active: true, single: true,
    defaultSpan: 3, render: tile("Active capsules", 128, "Rocket") },
  { id: "requests", title: "Requests", active: true, single: true,
    defaultSpan: 3, render: tile("Requests", "1.2M/h", "Database") },
  { id: "spend", title: "Spend", active: true, single: true,
    defaultSpan: 3, render: tile("Spend", "$8.4k", "Shop") },
  { id: "health", title: "Health", active: true, single: true,
    defaultSpan: 3, render: tile("Health", "99.98%", "HealthCheck") },
  { id: "errors", title: "Errors", active: true, single: true,
    defaultSpan: 6, render: tile("Errors", 42, "Database") },
  { id: "latency", title: "Latency", active: true, single: true,
    defaultSpan: 6, render: tile("Latency", "142ms", "Database") },
  // Not placed by the default layout, so there is always something for the
  // "Add Item" dialog to offer. Without a spare, every example whose layout
  // uses all six items renders no Add button at all.
  { id: "queue", title: "Queue depth", active: true, single: true,
    defaultSpan: 6, render: tile("Queue depth", 17, "Database") },
];

/**
 * The playground's preview pane is roughly half the page, so four tiles across
 * twelve columns leaves each one ~90px and the labels clip. Two per row is
 * what actually fits there; the full-width examples below use all four.
 */
export const PLAYGROUND_LAYOUT: SmartGridSectionDefinition[] = [
  {
    id: "overview",
    title: "Overview",
    rows: [
      { itemIds: ["capsules", "requests"], defaultHeightSpan: 2 },
      { itemIds: ["spend", "health"], defaultHeightSpan: 2 },
    ],
  },
];

export const DASHBOARD_LAYOUT: SmartGridSectionDefinition[] = [
  {
    id: "overview",
    title: "Overview",
    rows: [
      { itemIds: ["capsules", "requests", "spend", "health"], defaultHeightSpan: 2 },
    ],
  },
  {
    id: "detail",
    title: "Detail",
    rows: [{ itemIds: ["errors", "latency"], defaultHeightSpan: 2 }],
  },
];
