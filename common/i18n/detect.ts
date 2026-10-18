import { devWarnOnce } from "./warn";
import type { LocaleTag } from "./types";

/** BCP-47 base language (`"fr-CA"` → `"fr"`), lowercased. */
export function baseLanguage(tag: LocaleTag): string {
  const idx = tag.indexOf("-");
  const base = idx === -1 ? tag : tag.slice(0, idx);
  return base.toLowerCase();
}

/**
 * Locale prefixes the kit treats as right-to-left (spec §6). A small static
 * list keeps the engine dependency-free; extend as needed.
 */
export const RTL_PREFIXES: readonly LocaleTag[] = ["ar", "he", "fa", "ur", "yi", "ckb", "dv", "nqo"];

export function isRTLLocale(tag: LocaleTag): boolean {
  return RTL_PREFIXES.includes(baseLanguage(tag));
}

/**
 * The first candidate that has a catalog — exact tag, then base language
 * (`matchTag(["fr-CA"], {"fr"})` → `"fr"`). `undefined` when none matches.
 */
export function matchTag(
  candidates: readonly LocaleTag[],
  available: ReadonlySet<LocaleTag>,
): LocaleTag | undefined {
  for (const candidate of candidates) {
    if (available.has(candidate)) return candidate;
    const base = baseLanguage(candidate);
    if (available.has(base)) return base;
  }
  return undefined;
}

export interface InitialLocaleInput {
  /** Explicit `locale` config — skips detection + persistence. */
  explicit?: LocaleTag;
  detect: boolean;
  /** Stored tag (or `null`). */
  stored: LocaleTag | null;
  languages: readonly LocaleTag[];
  available: ReadonlySet<LocaleTag>;
  fallback: LocaleTag;
}

/**
 * Detection order (spec §7): explicit → stored → `navigator.languages` →
 * fallback. Invalid values fall through the chain — this never fails.
 */
export function resolveInitialLocale(input: InitialLocaleInput): LocaleTag {
  const { explicit, detect, stored, languages, available, fallback } = input;
  if (explicit !== undefined) {
    const matched = matchTag([explicit], available);
    if (matched) return matched;
    devWarnOnce(
      `explicit-locale:${explicit}`,
      `i18n: locale "${explicit}" has no catalog — falling back to detection`,
    );
  }
  const candidates: LocaleTag[] = [];
  if (stored !== null) candidates.push(stored);
  if (detect) candidates.push(...languages);
  const matched = matchTag(candidates, available);
  if (matched) return matched;
  return available.has(fallback) ? fallback : "en";
}
