import { iconRegistry } from "@cjlapao/ui-kit";

/*
  Shared vocabulary for the Icon Registry playground. A `.ts` file so the config
  can import it without JSX: everything here is a plain constant or a predicate
  over the playground state. The preview, the emitted snippet and both test files
  ask these same questions, so a claim cannot drift between what the page shows
  and what it prints.
*/

/** The three glyphs a consumer app might own, in the order a batch prints them. */
export const GLYPH_NAMES = ["Pulse", "Ring", "Bars"] as const;
export type GlyphName = (typeof GLYPH_NAMES)[number];

/** The component a consumer would hand the registry, named the way they would. */
export const glyphComponent = (name: string): string => `${name}Glyph`;

/** The name the preview resolves by default. */
export const TARGET_DEFAULT: GlyphName = "Pulse";

/**
 * The names the workbench offers as a resolution target: the two glyphs a batch
 * can register, one name that no batch covers, one name the generated registry
 * owns, and one name nobody owns at all.
 */
export const TARGET_CHOICES = ["Pulse", "Ring", "Bars", "Star", "Unicorn"] as const;

/** A name the generated registry does own (registry.ts:711). */
export const BUILT_IN_EXAMPLE = "Star";

/** A name neither map has ever heard of, so `CustomIcon` paints a monogram. */
export const MISSING_EXAMPLE = "Unicorn";

/** The names the kit's generated registry owns (:711 and friends). */
export const BUILT_IN_CHOICES = ["Star", "Add", "Search", "Trash", "Save"] as const;

/** The registry's own words, quoted from customRegistry.ts:43,:45. */
export const DUPLICATE_MESSAGE = "Icon already registered";
export const OVERRIDE_HINT = "Use { override: true } to replace it.";
export const EMPTY_MESSAGE = "An icon needs a name and SVG component.";

/** The size rung the preview renders at, and the documented default (:24). */
export const SIZE_DEFAULT = "md";

/** How many glyphs the stage registers in one call. */
export const BATCH_DEFAULT = 1;
export const BATCH_MAX = GLYPH_NAMES.length;

/** Example `alt` text, so the preview can show what a name does to the tag. */
export const ALT_EXAMPLE = "Pulse report";

/** What the last registration attempt did, as the stage reports it. */
export type Outcome = "registered" | "rejected" | "nothing";

/** A trimmed text-field value, or "" when nothing was typed. */
export const textValue = (state: Record<string, unknown>, id: string): string =>
  typeof state[id] === "string" ? (state[id] as string).trim() : "";

const text = textValue;

/** The name the preview resolves by, whatever the reader typed or chose. */
export const target = (state: Record<string, unknown>): string =>
  text(state, "target") || TARGET_DEFAULT;

export const altText = (state: Record<string, unknown>): string =>
  text(state, "alt");

export const hasAlt = (state: Record<string, unknown>): boolean =>
  altText(state) !== "";

export const toneName = (state: Record<string, unknown>): string =>
  typeof state.tone === "string" ? state.tone : "";

export const hasTone = (state: Record<string, unknown>): boolean =>
  toneName(state) !== "";

export const sizeValue = (state: Record<string, unknown>): string =>
  typeof state.size === "string" && state.size ? state.size : SIZE_DEFAULT;

export const hasSize = (state: Record<string, unknown>): boolean =>
  sizeValue(state) !== SIZE_DEFAULT;

/** How many of the three glyphs a single `registerIcons` call carries (:40). */
export const batchCount = (state: Record<string, unknown>): number => {
  const raw = state.batch;
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value)) return BATCH_DEFAULT;
  return Math.min(BATCH_MAX, Math.max(0, Math.floor(value)));
};

/** The names actually covered by the batch, in registration order. */
export const batchNames = (state: Record<string, unknown>): string[] =>
  GLYPH_NAMES.slice(0, batchCount(state));

export const isInBatch = (
  state: Record<string, unknown>,
  name: string = target(state),
): boolean => batchNames(state).includes(name);

export const isStacked = (state: Record<string, unknown>): boolean =>
  state.stack === true;

export const isOverride = (state: Record<string, unknown>): boolean =>
  state.override === true;

export const isAfterPaint = (state: Record<string, unknown>): boolean =>
  state.afterPaint === true;

/**
 * Whether the target is a name the generated registry owns. Asked of the real
 * map, the way the kit asks it — `hasOwnProperty`, no prototype chain (:27).
 */
export const isRegisteredBuiltIn = (name: string): boolean =>
  Object.prototype.hasOwnProperty.call(iconRegistry, name);

/** Whether the name the preview resolves by belongs to the generated registry. */
export const isBuiltIn = (state: Record<string, unknown>): boolean =>
  isRegisteredBuiltIn(target(state));

/**
 * The glyph the claim call registers under the target name. It steps one place
 * past the batch on purpose: claiming a name with the same drawing the batch just
 * put there would repaint nothing, and the whole point of the switch is that the
 * newest registration is the one you see.
 */
export const stackedGlyph = (state: Record<string, unknown>): string =>
  GLYPH_NAMES[batchCount(state) % GLYPH_NAMES.length];

/** The glyph the batch registers under `name`, or "" when the batch skips it. */
export const batchGlyph = (
  state: Record<string, unknown>,
  name: string,
): string => {
  const index = (GLYPH_NAMES as readonly string[]).indexOf(name);
  return index >= 0 && index < batchCount(state) ? name : "";
};

/**
 * Whether the *claim* call would be rejected. It registers the target name, and
 * that name is a duplicate when the generated registry owns it or the batch call
 * has just taken it — `registerIcons` checks both maps (:44) and validates the
 * whole batch before the registry is touched (:41-47).
 */
export const blocksStackCall = (state: Record<string, unknown>): boolean =>
  isStacked(state) && !isOverride(state) && nameIsTaken(state);

/** Whether the target name already belongs to somebody in this configuration. */
export const nameIsTaken = (state: Record<string, unknown>): boolean =>
  isBuiltIn(state) || isInBatch(state, target(state));

export const wouldThrow = (state: Record<string, unknown>): boolean =>
  blocksStackCall(state);

/**
 * Whether the claim call is heading for the duplicate error — asked *without*
 * consulting `override`, so the `{ override: true }` control appears exactly when
 * it is the way out and stays visible while it is switched on.
 */
export const needsOverride = (state: Record<string, unknown>): boolean =>
  isStacked(state) && nameIsTaken(state);

/** Where the preview's glyph comes from, given what the stage really registered. */
export type Resolution = "custom" | "built-in" | "nothing";

export const resolution = (
  state: Record<string, unknown>,
  registered: readonly string[],
): Resolution => {
  const name = target(state);
  if (registered.includes(name)) return "custom";
  return isRegisteredBuiltIn(name) ? "built-in" : "nothing";
};

/** One line under the preview: where the glyph came from, in the reader's words. */
export const resolutionCaption = (
  state: Record<string, unknown>,
  registered: readonly string[],
): string => {
  const name = target(state);
  switch (resolution(state, registered)) {
    case "custom":
      return `${name} resolved from a consumer registration, which shadows the generated registry — and the newest registration is the one that paints (customRegistry.ts:26).`;
    case "built-in":
      return `${name} resolved from the generated registry, because no registration claimed that name (registry.ts:497-745).`;
    default:
      return `${name} is in neither the custom map nor the generated registry, so CustomIcon paints a monogram and warns once per name (:59-60,:141-144).`;
  }
};

/** One line under the preview: what the call did, quoting the registry's error. */
export const outcomeCaption = (
  state: Record<string, unknown>,
  outcome: Outcome,
  message = "",
): string => {
  const count = batchCount(state);
  const names = batchNames(state);
  if (outcome === "rejected") {
    return `${DUPLICATE_MESSAGE}: ${message || OVERRIDE_HINT} Nothing was written — the whole batch is validated before the registry is touched (:41-47), so a call that throws leaves the map exactly as it was.`;
  }
  if (outcome === "registered") {
    return `registerIcons took ${count} name${count === 1 ? "" : "s"} (${
      names.join(", ") || "none"
    })${
      isStacked(state)
        ? `, then ${stackedGlyph(state)}Glyph took ${target(state)} again — the newest registration is what paints (:26,:50)`
        : ""
    }. Keeping the returned cleanup is what gives the name back (:55-66).`;
  }
  return "No call yet — set a batch size above zero and the workbench registers for real.";
};

/** The classes the stage puts the preview row in — also the test selector. */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";
