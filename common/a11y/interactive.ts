// Which elements count as a control.
//
// This answers one question: *was this click the user activating something
// inside me, or activating me?* A clickable container — a `Panel` with an
// `onClick`, a card, a row — cannot let every click inside it bubble up as a
// click on the container, or its own buttons would fire the container too.
//
// It is deliberately NOT the same selector as `Modal`'s focusable list. That
// one asks *what is tabbable* for a focus trap; this one asks *what is a
// control*. Merging them would have the trap tab into `contenteditable` divs,
// and would drop `role`-only widgets that are never tabbable but are very
// much clicked.

/**
 * Native controls plus the ARIA equivalents that behave like one. `a[href]`
 * rather than every `a` because a link without a destination is not
 * clickable; `audio`/`video` only with `controls`, since the bare element
 * offers nothing to click.
 */
export const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  '[contenteditable=""]',
  '[contenteditable="true"]',
  "audio[controls]",
  "video[controls]",
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="slider"]',
].join(",");

/**
 * The escape hatch for custom widgets: a `div` with an `onClick` has no
 * semantics for a selector to find, so it says so instead. Applied to the
 * element (or an ancestor of it) that owns the interaction.
 */
export const NO_CLICK_ATTR_SELECTOR = "[data-panel-no-click]";

/**
 * True when a click on `target` belongs to a control inside `root` rather
 * than to `root` itself.
 *
 * Both guards matter. `closest()` walks above `root`, so without
 * `root.contains()` an interactive ancestor of the whole card would silence
 * it; and without `hit !== root` a caller who puts `role="button"` on `root`
 * themselves would never receive their own clicks.
 */
export function isClickOwnedByDescendant(
  root: HTMLElement | null | undefined,
  target: EventTarget | null,
): boolean {
  if (!root || !target) return false;
  // Duck-typed rather than `instanceof Element`: keeps this working where the
  // DOM classes are not the same realm (jsdom windows, iframes, SSR stubs).
  if (typeof (target as Element).closest !== "function") return false;
  const hit = (target as Element).closest(
    `${INTERACTIVE_SELECTOR},${NO_CLICK_ATTR_SELECTOR}`,
  );
  return hit !== null && hit !== root && root.contains(hit);
}

/**
 * True when `root` hosts a control of its own inside it — the condition a
 * clickable container should warn about, since a control nested inside
 * `role="button"` is announced as part of the button rather than as a
 * control.
 */
export function hasInteractiveDescendant(
  root: Element | null | undefined,
): boolean {
  if (!root || typeof root.querySelector !== "function") return false;
  return root.querySelector(INTERACTIVE_SELECTOR) !== null;
}
