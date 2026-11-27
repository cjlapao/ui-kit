import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Fixtures and predicates for the App Divider playground.
 *
 * A divider has no data of its own — the only content it can render is the
 * caller's `label` — so what lives here is the copy that surrounds it (the
 * toolbar items or the two sign-in lines the rule breaks) and the predicates the
 * printing rules share with the preview. Both sides read the same `LABEL_TEXT`,
 * `LABEL_NODE_JSX` and `SIDE_*` constants, so the snippet can never claim a label
 * the preview did not paint.
 */

export const LABEL_TEXT = "OR";
export const LABEL_NODE_JSX = `<Pill tone="blue" variant="soft" size="xs">3 new</Pill>`;

/** What the vertical rule separates (AppDivider.tsx:220-228 renders the rule
 * between these, which is the call site the component was written for). */
export const SIDE_ITEMS = ["Recent", "Starred", "Archive"];

/** What the horizontal rule separates. */
export const SIDE_TEXT = [
  "Sign in with your work account.",
  "Continue with a single-use link instead.",
];

export const isVertical = (state: PlaygroundState): boolean =>
  (state.orientation ?? "vertical") === "vertical";

export const hasLabel = (state: PlaygroundState): boolean =>
  (state.withLabel ?? true) !== false &&
  (String(state.label ?? "")).trim() !== "";

export const isBadgeLabel = (state: PlaygroundState): boolean =>
  hasLabel(state) && (state.labelKind ?? "text") === "badge";

/** `tone` absent means the rule takes `useSurfaceText().divider` (:170). */
export const isToned = (state: PlaygroundState): boolean => {
  const tone = String(state.tone ?? "none");
  return tone !== "none" && tone !== "";
};

/** `decorative` is three-state: absent means `!label` (:130). */
export const decorativeChoice = (
  state: PlaygroundState,
): "auto" | "yes" | "no" => {
  const value = String(state.decorative ?? "auto");
  return value === "yes" || value === "no" ? (value as "yes" | "no") : "auto";
};

/** The `length` control's `auto` is the orientation-dependent default (:117). */
export const lengthChoice = (state: PlaygroundState): string =>
  String(state.length ?? "auto");

/** The preview's wrapper — a lever, never a printed prop. */
export const contextChoice = (state: PlaygroundState): string =>
  String(state.context ?? "outlined");

/** An `auto`/empty control is the absent prop, not a value to pass. */
export const defined = (value: unknown): string | undefined => {
  const text = value === undefined || value === null ? "" : String(value);
  return text === "" || text === "auto" ? undefined : text;
};
