import { Button, CustomIcon } from "@cjlapao/ui-kit";
import type { ReactElement } from "react";

/**
 * The two elements the playground can hand to the banner.
 *
 * They live here, as real elements, because the preview mounts them and the
 * Code view prints them through `h.jsx`: a button renamed here disappears from
 * the snippet too, which is the only guarantee worth having.
 */

/** Actions, passed as `children` — the slot that used to be dropped (:56-60). */
export const ACTIONS: ReactElement = (
  <div className="flex gap-2">
    <Button variant="outline" size="sm">
      View logs
    </Button>
    <Button variant="soft" size="sm">
      Re-run job
    </Button>
  </div>
);

/**
 * A node in the icon slot, as opposed to a registry name.
 *
 * Worth having because the two are not the same thing: pass a string and the
 * component sizes the glyph with the title (:168-172 + CHIP_SIZES :128-134);
 * pass a node and it is rendered verbatim (:174) — this one pins its own 18px.
 */
export const ICON_NODE: ReactElement = (
  <CustomIcon icon="Rocket" customSize={18} className="text-white/90" />
);

/** Identifiers `h.jsx` may print for the elements above. */
export const FIXTURE_NAMES = { Button, CustomIcon };
