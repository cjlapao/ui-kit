/**
 * Built-in persistence for CustomColorSwatches' saved custom colours.
 *
 * The kit's swatches expose `storageKey`; when set, the saved list reads once
 * on mount and writes a full snapshot after every save/edit/remove. This
 * module is framework-agnostic so the React and Vue kits share one envelope
 * format and one validation pass — same discipline as `tableStorage.ts`.
 *
 * The default backend is the shared best-effort localStorage wrapper
 * (`safeStorage.ts`): quota errors, private-mode rejections and SSR degrade to
 * no-ops, so persistence can never crash a render.
 */

import {
  buildStorageKey,
  type KitStorageAdapter,
} from "./safeStorage";
import { normalizeHex } from "./colorMath";

/** The storage backend, under the swatches' own name. */
export type SwatchStorageAdapter = KitStorageAdapter;

/** Default key prefix so swatch entries never collide with app keys. */
export const SWATCH_STORAGE_DEFAULT_PREFIX = "ui-kit:swatches";

/** Envelope version. Bump when the stored shape changes incompatibly. */
export const SWATCH_SAVED_STORAGE_VERSION = 1;

/** How many saved colours a row keeps; the oldest makes way for the newest. */
export const MAX_SAVED_COLORS = 12;

export interface SwatchStoredColors {
  v: number;
  colors: string[];
}

export const buildSwatchStorageKey = (
  prefix: string,
  storageKey: string,
): string => buildStorageKey(prefix, storageKey);

export const encodeSavedColors = (colors: string[]): string =>
  JSON.stringify({
    v: SWATCH_SAVED_STORAGE_VERSION,
    colors,
  } satisfies SwatchStoredColors);

/**
 * A stored list is trusted only as far as it validates: bad JSON, a foreign
 * version or a non-array drops the whole entry; a single junk colour in an
 * otherwise good list is dropped alone. Duplicate hexes collapse, keeping the
 * first (newest) position, and the list is clamped to the cap — a hand-edited
 * bucket can never smuggle a render-time surprise.
 */
export const decodeSavedColors = (raw: string | null): string[] => {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    (parsed as SwatchStoredColors).v !== SWATCH_SAVED_STORAGE_VERSION ||
    !Array.isArray((parsed as SwatchStoredColors).colors)
  ) {
    return [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of (parsed as SwatchStoredColors).colors) {
    const hex = typeof entry === "string" ? normalizeHex(entry) : null;
    if (!hex || seen.has(hex)) continue;
    seen.add(hex);
    out.push(hex);
    if (out.length >= MAX_SAVED_COLORS) break;
  }
  return out;
};

/** Newest first, deduped by normalised hex, capped. */
export const pushSavedColor = (
  saved: readonly string[],
  hex: string,
): string[] => {
  const normalized = normalizeHex(hex);
  if (!normalized) return [...saved];
  return [
    normalized,
    ...saved.filter((c) => normalizeHex(c) !== normalized),
  ].slice(0, MAX_SAVED_COLORS);
};
