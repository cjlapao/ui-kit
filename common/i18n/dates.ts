// Locale-aware date names (spec §6). Resolution per spec:
//
//   kit.date.* catalog override → Intl.DateTimeFormat derivation (cached)
//   → English constants (from common/utils/dates).
//
// One-way import of the English constants: this module imports
// common/utils/dates, which never imports the i18n engine (no cycle).

import {
  MONTH_NAMES,
  MONTH_NAMES_SHORT,
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_SHORT,
} from "../utils/dates";
import type { LocaleTag } from "./types";

/** `kit.date.months` / `kit.date.monthsShort` — complete override only. */
function catalogNames(
  catalog: Record<string, string> | undefined,
  baseKey: string,
  count: number,
): string[] | undefined {
  if (!catalog) return undefined;
  const names: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const value = catalog[`${baseKey}.${i}`];
    if (typeof value !== "string" || value === "") return undefined;
    names.push(value);
  }
  return names;
}

const derivedCache = new Map<string, string[] | null>();

function firstSundayOf(reference: Date): Date {
  const d = new Date(reference.getFullYear(), reference.getMonth(), 1);
  d.setDate(1 + ((7 - d.getDay()) % 7));
  return d;
}

/** Derive month names (long/short) for `locale`, or `null` when Intl rejects it. */
function deriveMonths(locale: LocaleTag, short: boolean): string[] | null {
  const key = `${locale}\u0000m${short ? "s" : "l"}`;
  const cached = derivedCache.get(key);
  if (cached !== undefined) return cached;
  let names: string[] | null = null;
  try {
    const format = new Intl.DateTimeFormat(locale, { month: short ? "short" : "long" });
    // A fixed reference year; day 15 avoids DST edges. Names are year-stable.
    names = Array.from({ length: 12 }, (_, i) => format.format(new Date(2026, i, 15)));
  } catch {
    names = null;
  }
  derivedCache.set(key, names);
  return names;
}

/** Derive weekday names (long/short) for `locale`, or `null` when Intl rejects it. */
function deriveWeekdays(locale: LocaleTag, short: boolean): string[] | null {
  const key = `${locale}\u0000w${short ? "s" : "l"}`;
  const cached = derivedCache.get(key);
  if (cached !== undefined) return cached;
  let names: string[] | null = null;
  try {
    const format = new Intl.DateTimeFormat(locale, { weekday: short ? "short" : "long" });
    // Sunday-first (getDay() numbering, 0 = Sunday), matching the kit's
    // WEEKDAY_LABELS order.
    const start = firstSundayOf(new Date(2026, 8, 1));
    names = Array.from(
      { length: 7 },
      (_, i) => format.format(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)),
    );
  } catch {
    names = null;
  }
  derivedCache.set(key, names);
  return names;
}

/** Localized month names (Jan…Dec order). Catalog override, Intl, English. */
export function getMonthNames(
  locale: LocaleTag,
  short = false,
  catalog?: Record<string, string>,
): string[] {
  const fromCatalog = catalogNames(catalog, short ? "kit.date.monthsShort" : "kit.date.months", 12);
  if (fromCatalog) return fromCatalog;
  const derived = deriveMonths(locale, short);
  return derived ?? (short ? MONTH_NAMES_SHORT : MONTH_NAMES);
}

/** Localized weekday names (Sunday-first, getDay() numbering). */
export function getWeekdayNames(
  locale: LocaleTag,
  short = false,
  catalog?: Record<string, string>,
): string[] {
  const fromCatalog = catalogNames(catalog, short ? "kit.date.weekdaysShort" : "kit.date.weekdays", 7);
  if (fromCatalog) return fromCatalog;
  const derived = deriveWeekdays(locale, short);
  return derived ?? (short ? WEEKDAY_LABELS_SHORT : WEEKDAY_LABELS);
}

/** All four name sets for locale-aware date parsing (Task 2.4 consumes this). */
export function getLocalizedParseNames(
  locale: LocaleTag,
  catalog?: Record<string, string>,
): { monthFull: string[]; monthShort: string[]; weekdayFull: string[]; weekdayShort: string[] } {
  return {
    monthFull: getMonthNames(locale, false, catalog),
    monthShort: getMonthNames(locale, true, catalog),
    weekdayFull: getWeekdayNames(locale, false, catalog),
    weekdayShort: getWeekdayNames(locale, true, catalog),
  };
}
