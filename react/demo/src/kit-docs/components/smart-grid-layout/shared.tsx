import type { SmartGridSectionDefinition } from "@cjlapao/ui-kit";
import { TILE_COUNT, itemsOf } from "./smartGridFixture";

/**
 * The examples' catalogue is the playground's catalogue: one record per tile in
 * `smartGridFixture.tsx` drives the tile the preview mounts, the `render` the Code
 * view prints, and these definitions. Hand-writing a second list here meant the
 * examples could quietly diverge from the snippet the page shows above them.
 */
export const DASHBOARD_ITEMS = itemsOf(TILE_COUNT);

/**
 * The full-width layout, which is the one shape the fixture does not generate:
 * its own rows put two per row for the preview's narrow column, while these
 * examples have the page's width and take four across twelve columns.
 */
export const DASHBOARD_LAYOUT: SmartGridSectionDefinition[] = [
  {
    id: "overview",
    title: "Overview",
    rows: [
      {
        itemIds: ["capsules", "requests", "spend", "health"],
        defaultHeightSpan: 2,
      },
    ],
  },
  {
    id: "detail",
    title: "Detail",
    rows: [{ itemIds: ["errors", "latency"], defaultHeightSpan: 2 }],
  },
];
