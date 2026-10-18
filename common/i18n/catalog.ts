import type { LocaleTag, MessageCatalog } from "./types";
import { devWarnOnce } from "./warn";

/**
 * Flatten a nested catalog to dot-keys (spec §4.1).
 *
 * `a.b.c` → string; arrays keep their index (`kit.date.months.0`); non-string
 * leaves are skipped with a deduped warn. Flattening happens once at provider
 * setup — `lookup` never walks raw catalogs.
 */
export function flattenCatalog(
  catalog: MessageCatalog,
  warnPrefix = "catalog",
): Record<string, string> {
  const out: Record<string, string> = {};
  walk(catalog, "", out, warnPrefix);
  return out;
}

function walk(
  node: unknown,
  prefix: string,
  out: Record<string, string>,
  warnPrefix: string,
): void {
  if (node === null || typeof node !== "object") {
    if (typeof node === "string") {
      if (prefix !== "") out[prefix] = node;
    } else if (prefix !== "") {
      devWarnOnce(`${warnPrefix}:${prefix}`, `i18n: non-string leaf at "${prefix}" — skipped`);
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      if (typeof item === "string") {
        out[`${prefix}.${index}`] = item;
      } else if (prefix !== "") {
        devWarnOnce(
          `${warnPrefix}:${prefix}.${index}`,
          `i18n: non-string array entry at "${prefix}.${index}" — skipped`,
        );
      }
    });
    return;
  }
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    walk(value, prefix === "" ? key : `${prefix}.${key}`, out, warnPrefix);
  }
}

export interface LookupResult {
  value: string;
  /** The locale the value was found in. */
  resolvedLocale: LocaleTag;
}

/**
 * Key-resolution structure (spec §4.2):
 *
 *   user[L] → kit[L] → kit[fallback]
 *
 * Built once; `lookup` is a plain map walk over that chain (no per-call
 * catalog walking). Note: `user[fallback]` is NOT consulted for a different
 * active locale — user catalogs are per-locale (deliberate v1 simplification).
 */
export interface Resolution {
  lookup(key: string, locale: LocaleTag): LookupResult | undefined;
  has(key: string, locale: LocaleTag): boolean;
  /** Union of user + built-in tags, sorted. */
  availableLocales(): LocaleTag[];
  /** Merged `user[L]` over `kit[L]` (used for `kit.date.*` overrides). */
  catalogFor(locale: LocaleTag): Record<string, string>;
}

export function buildResolution(
  userLocales: Record<LocaleTag, MessageCatalog>,
  builtIn: Record<LocaleTag, MessageCatalog>,
  fallback: LocaleTag,
): Resolution {
  const userFlat = new Map<LocaleTag, Record<string, string>>();
  for (const [tag, catalog] of Object.entries(userLocales)) {
    userFlat.set(tag, flattenCatalog(catalog, `user:${tag}`));
  }
  const builtFlat = new Map<LocaleTag, Record<string, string>>();
  for (const [tag, catalog] of Object.entries(builtIn)) {
    builtFlat.set(tag, flattenCatalog(catalog, `kit:${tag}`));
  }

  const available = new Set<LocaleTag>([...userFlat.keys(), ...builtFlat.keys()]);

  const chainFor = (locale: LocaleTag): Array<{ tag: LocaleTag; map: Record<string, string> }> => {
    const chain: Array<{ tag: LocaleTag; map: Record<string, string> }> = [];
    const user = userFlat.get(locale);
    if (user) chain.push({ tag: locale, map: user });
    if (locale !== fallback) {
      const kit = builtFlat.get(locale);
      if (kit) chain.push({ tag: locale, map: kit });
    }
    const kitFallback = builtFlat.get(fallback);
    if (kitFallback) chain.push({ tag: fallback, map: kitFallback });
    return chain;
  };

  return {
    lookup(key, locale) {
      for (const entry of chainFor(locale)) {
        const value = entry.map[key];
        if (value !== undefined) return { value, resolvedLocale: entry.tag };
      }
      return undefined;
    },
    has(key, locale) {
      for (const entry of chainFor(locale)) {
        if (key in entry.map) return true;
      }
      return false;
    },
    availableLocales() {
      return [...available].sort();
    },
    catalogFor(locale) {
      const merged: Record<string, string> = {};
      const kit = builtFlat.get(locale);
      if (kit) Object.assign(merged, kit);
      const user = userFlat.get(locale);
      if (user) Object.assign(merged, user);
      return merged;
    },
  };
}
