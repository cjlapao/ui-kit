import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS, DASHBOARD_LAYOUT } from "../shared";

/**
 * `storageKey` is the whole opt-in, exactly as on `Table`: the grid restores
 * its layout on mount and saves after every change, under
 * `{storagePrefix}:{storageKey}` — `ui-kit:grid:demo-dashboard` here.
 *
 * Writes are debounced, because column and row resizing update the layout on
 * every mousemove; an unthrottled save would serialise the whole dashboard
 * dozens of times a second. A pending write is flushed on unmount, so closing
 * the page does not lose the last change.
 *
 * Edit this layout, reload the page, and it comes back. **Reset layout**
 * clears the stored key and returns to the default the app shipped with.
 *
 * Pass `persistedLayout` as well and it wins: a caller holding the state is
 * the source of truth, and storage is the fallback beneath it.
 */
export default function Persistence() {
  return (
    <SmartGridLayout
      items={DASHBOARD_ITEMS}
      defaultLayout={DASHBOARD_LAYOUT}
      storageKey="demo-dashboard"
      maxColumns={12}
    />
  );
}
