import { SmartGridLayout, SMART_GRID_VARIANTS } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS } from "../shared";

const SMALL = [
  { id: "overview", title: "Overview", rows: [{ itemIds: ["capsules", "requests"] }] },
];

/**
 * The `Panel` surface family, plus the accent/surface split.
 *
 * `tone` is the *edit accent* — tile outlines, drop indicators, resize
 * handles. `surfaceTone` tints the dashboard itself and stays `neutral`
 * unless you ask, because an accent that matches its own background has
 * nothing to stand out against.
 *
 * The accent used to come from a hand-written map covering 10 tones out of
 * 21; the other eleven silently rendered blue.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {SMART_GRID_VARIANTS.slice(0, 4).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <SmartGridLayout
            items={DASHBOARD_ITEMS}
            defaultLayout={SMALL}
            variant={variant}
            maxColumns={12}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
