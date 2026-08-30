// Dev-time accessibility warnings (2026-08-30 a11y audit, P1-2).
//
// Contract mirrors `common/i18n/warn.ts`: at most one warning per
// (component, condition) pair, never throws. The difference: these are
// developer guidance, so they fire in dev only (vitest's NODE_ENV="test"
// counts as dev) and stay silent in production bundles.
//
// The checks here cover what a *component* can actually verify at its own
// props boundary:
// - no accessible name (no explicit name prop and no text children),
// - dialogs rendered without a title,
// - aria-hidden on an element that is focusable/interactive (P0-4).
// External label association (a <label> outside the component) is not
// detectable from props — that direction is enforced by the jsx-a11y lint
// gate instead.

import { isDev } from "../i18n/warn";

const warned = new Set<string>();

/** Warn at most once per `id`, in dev only. Never throws. */
export function devWarnA11yOnce(id: string, message: string): void {
  if (!isDev()) return;
  if (warned.has(id)) return;
  warned.add(id);
  // eslint-disable-next-line no-console
  console.warn(`[ui-kit a11y] ${message}`);
}

/** Test helper: clear the dedupe set between tests. */
export function resetA11yWarned(): void {
  warned.clear();
}

/**
 * True when the element gets an accessible name from either an explicit
 * name (aria-label / a label prop) or non-empty text content.
 *
 * `textChildren` is typed `unknown` on purpose — this module lives in
 * `common/` and must not import react. Element children count as named:
 * their text cannot be determined statically, and erring silent beats
 * warning on legitimate compositions. Pass `undefined` for controls that
 * cannot render text children, e.g. IconButton whose content is the
 * `icon` prop.
 */
export function hasAccessibleName(
  explicitName: string | null | undefined,
  textChildren?: unknown,
): boolean {
  if (typeof explicitName === "string" && explicitName.trim().length > 0) {
    return true;
  }
  if (textChildren == null) return false;
  if (typeof textChildren === "string") return textChildren.trim().length > 0;
  if (typeof textChildren === "number") return true;
  return true;
}

/**
 * Warn when a control renders with no accessible name. Call unconditionally
 * during render — it is a cheap, deduplicated check.
 */
export function warnIfMissingName(
  component: string,
  explicitName: string | null | undefined,
  textChildren?: unknown,
): void {
  if (hasAccessibleName(explicitName, textChildren)) return;
  devWarnA11yOnce(
    `${component}:no-name`,
    `<${component}> has no accessible name (no aria-label and no text content). Add an aria-label or visible text (WCAG 4.1.2).`,
  );
}

/** Warn when a dialog renders without a title (WCAG 2.4.1 page/dialog name). */
export function warnIfMissingTitle(component: string, title: unknown): void {
  const present =
    title != null &&
    title !== false &&
    !(typeof title === "string" && title.trim().length === 0);
  if (present) return;
  devWarnA11yOnce(
    `${component}:no-title`,
    `<${component}> has no title. Dialogs need an accessible name (WCAG 2.4.1) — set the title prop.`,
  );
}

/**
 * Warn when the same element is both hidden from assistive technology
 * (`aria-hidden`) and reachable by the keyboard/interactive.
 */
export function warnIfAriaHiddenFocusable(
  component: string,
  opts: { ariaHidden?: boolean | string; tabIndex?: number; interactive?: boolean },
): void {
  if (opts.ariaHidden !== true) return;
  const focusable = (opts.tabIndex ?? -1) >= 0 || opts.interactive === true;
  if (!focusable) return;
  devWarnA11yOnce(
    `${component}:aria-hidden-focusable`,
    `<${component}> is aria-hidden but focusable — keyboard users can reach a node assistive technology cannot see.`,
  );
}
