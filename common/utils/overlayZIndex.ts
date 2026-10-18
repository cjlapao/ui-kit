/**
 * The z-index a body-portaled overlay needs so it sits above whatever layer
 * stack its anchor lives in.
 *
 * A `position: fixed` box teleported to `document.body` is stacked against
 * the root stacking context, so "above the anchor" is not a property of the
 * anchor — it is one above the highest numeric z-index found walking the
 * anchor's ancestors. Without it, an overlay opened from inside a
 * `z-50` modal renders *under* the modal. Shared by both kits' overlays
 * (DatePicker, Popover, …) so they stack identically.
 */
export const resolveOverlayZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n)) {
        highest = highest === null ? n : Math.max(highest, n);
      }
    }
    node = node.parentElement;
  }
  return Math.max(1, (highest ?? 20) + 1);
};
