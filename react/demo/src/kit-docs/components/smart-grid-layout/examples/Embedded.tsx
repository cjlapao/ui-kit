import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS, DASHBOARD_LAYOUT } from "../shared";

/**
 * The default surface is `plain`: no background, border, shadow, ring, radius
 * or padding.
 *
 * A dashboard is nearly always dropped into a page that already has its own
 * container, and drawing a second panel around it produced a grey slab
 * floating over whatever was behind — obvious the moment the host had a
 * background image, as here. The host owns the surface and the spacing; the
 * grid just lays out tiles on it.
 *
 * `variant` takes a surface back whenever you want one.
 */
export default function Embedded() {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-200 via-rose-100 to-amber-100 p-6 dark:from-indigo-950 dark:via-slate-900 dark:to-amber-950">
      <SmartGridLayout
        items={DASHBOARD_ITEMS}
        defaultLayout={DASHBOARD_LAYOUT}
        maxColumns={12}
      />
    </div>
  );
}
