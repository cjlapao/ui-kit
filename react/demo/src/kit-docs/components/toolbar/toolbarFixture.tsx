import { Button, IconButton, Input } from "@cjlapao/ui-kit";
import type { ReactElement } from "react";

/**
 * The four things the playground can put in the bar's regions.
 *
 * They are real elements, not strings: the preview mounts them and the Code
 * view prints them through `h.jsx`, so a label changed here disappears from the
 * snippet too. That is the only guarantee worth having for a component whose
 * whole API is "hand me three groups of nodes" (:30-48).
 */

/** The left group — PrimeVue's `start` slot (:30-33). */
export const START: ReactElement = (
  <>
    <IconButton icon="Add" variant="ghost" srLabel="Add" />
    <IconButton icon="Send" variant="ghost" srLabel="Send" />
    <IconButton icon="Download" variant="ghost" srLabel="Download" />
  </>
);

/**
 * The centred group (:34-38).
 *
 * Narrow on purpose: `justify-between` (:152) only centres this by measuring the
 * flanks, so a wide search field is what turns "centered" into "somewhere near
 * the middle" — the JSDoc says so at :35-37 and the width is the demo's answer.
 */
export const SEARCH: ReactElement = (
  <Input leadingIcon="Search" placeholder="Search" className="w-56" />
);

/** The right group (:39-42). */
export const END: ReactElement = (
  <Button leadingIcon="Save" color="indigo">
    Save
  </Button>
);

/** The fourth group, appended after the three (:43-48,:165). */
export const EXTRA: ReactElement = (
  <Button variant="ghost" size="sm" leadingIcon="Refresh">
    Regenerate
  </Button>
);

/** Identifiers `h.jsx` may print for the elements above. */
export const FIXTURE_NAMES = { Button, IconButton, Input };
