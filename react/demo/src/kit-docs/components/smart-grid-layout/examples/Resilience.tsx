import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS } from "../shared";

const boom = () => {
  throw new Error("This tile's data source is unavailable");
};

const ITEMS = [
  ...DASHBOARD_ITEMS,
  {
    id: "broken",
    title: "Billing summary",
    active: true,
    single: true,
    defaultSpan: 6,
    render: boom,
  },
];

/**
 * Tiles are arbitrary consumer components. Without a boundary around each one,
 * a single throwing tile unmounts the whole dashboard — the user loses every
 * other tile, and the layout editor with them, because of one failed fetch.
 *
 * The fallback names the tile so the broken one is identifiable, and
 * `onTileError` reports it so the host can log it.
 */
export default function Resilience() {
  return (
    <SmartGridLayout
      items={ITEMS}
      defaultLayout={[
        {
          id: "overview",
          title: "Overview",
          rows: [{ itemIds: ["capsules", "broken"], defaultHeightSpan: 2 }],
        },
      ]}
      maxColumns={12}
      readOnly
      onTileError={(error, title) =>
        // eslint-disable-next-line no-console
        console.warn(`[dashboard] ${title} failed:`, error.message)
      }
    />
  );
}
