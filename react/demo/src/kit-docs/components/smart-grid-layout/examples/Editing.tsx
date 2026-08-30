import { useState } from "react";
import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS, DASHBOARD_LAYOUT } from "../shared";

/**
 * Everything the editor can do, in one place. Press **Edit layout**, then:
 *
 * - **Add a tile** from the palette: press **Add Item**, then drag an entry
 *   out of the panel and onto the grid. It lands where the preview shows,
 *   using the same drop targets as a move. The panel stays open, so adding
 *   several is one flow rather than one dialog per tile.
 * - **Move a tile** by dragging it. The source all but disappears so the ghost
 *   showing where it will land stays readable.
 * - **Remove a tile** by dragging it onto the zone that appears top-left. It is
 *   only there while something is in flight — an always-armed delete target is
 *   a hazard, and there is nothing for it to say otherwise.
 * - **Reorder sections** with the `⠿` handle, which appears only when there is
 *   more than one, or with the up and down arrows once it has focus.
 * - **Rename a section** by clicking its title.
 * - **Resize a column** by dragging the divider between two tiles, or focusing
 *   it and using the left and right arrows.
 * - **Undo and redo** from the toolbar or `Ctrl`/`Cmd`+`Z`.
 *
 * All of it works from the keyboard: tab to a tile, `Enter` lifts it, the
 * arrows move it a slot at a time, `Enter` places it and `Esc` puts it back.
 * Sections move with their handle and the up/down arrows, columns resize with
 * left/right on the divider. Every action is announced through a polite live
 * region, so the editor is usable without sight of it.
 *
 * `controlVariant` gives the editing chrome a surface of its own — here the
 * body is `plain` and the controls are `glass`, which reads on any background.
 */
export default function Editing() {
  const [editing, setEditing] = useState(true);
  return (
    <SmartGridLayout
      items={DASHBOARD_ITEMS}
      defaultLayout={DASHBOARD_LAYOUT}
      controlVariant="glass"
      maxColumns={12}
      isEditMode={editing}
      onEditModeChange={setEditing}
    />
  );
}
