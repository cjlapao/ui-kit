/**
 * Gantt time engine — pure date/scale math, no framework imports.
 *
 * The timeline is a linear time→px projection: `x = (t - viewStart) *
 * pxPerDay / MS_PER_DAY`. Header levels are generated from the real calendar
 * (month columns have real widths, weeks start on the configured weekday), so
 * labels never drift from the grid.
 */

import type { GanttDate, GanttSnap, GanttTimeScaleLevel } from "./types";

export const MS_PER_DAY = 86_400_000;
export const MS_PER_HOUR = 3_600_000;
export const MS_PER_WEEK = 7 * MS_PER_DAY;

/** Week starts Monday (0) … Sunday (6). Default 1 = Monday. */
export const GANTT_WEEK_START = 1;

// ── Normalisation ────────────────────────────────────────────────────────────

export function toMs(value: GanttDate): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`gantt: invalid date "${value}"`);
  }
  return parsed;
}

export function msToIso(ms: number): string {
  return new Date(ms).toISOString();
}

/** Whole days between two ms values (fractional). */
export function daysBetween(a: number, b: number): number {
  return (b - a) / MS_PER_DAY;
}

// ── Calendar alignment ───────────────────────────────────────────────────────

export function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function addDays(ms: number, days: number): number {
  return ms + days * MS_PER_DAY;
}

/** `weekday` 1 = Monday … 7 = Sunday, matching the ISO week (0 unused). */
export function startOfWeek(ms: number, weekday: number = GANTT_WEEK_START): number {
  const day = startOfDay(ms);
  const d = new Date(day);
  const iso = d.getDay() === 0 ? 7 : d.getDay(); // Mon=1 … Sun=7
  const delta = iso - weekday;
  return addDays(day, -delta);
}

export function startOfMonth(ms: number): number {
  const d = new Date(ms);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfQuarter(ms: number): number {
  const d = new Date(ms);
  const month = Math.floor(d.getMonth() / 3) * 3;
  d.setMonth(month, 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfYear(ms: number): number {
  const d = new Date(ms);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function endOfMonth(ms: number): number {
  const d = new Date(ms);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/** Start of the month `months` from `ms` (negative supported). */
export function addMonths(ms: number, months: number): number {
  const d = new Date(ms);
  d.setMonth(d.getMonth() + months, 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// ── Labels (Intl, no dependencies) ──────────────────────────────────────────

type LabelLocale = string | undefined;

const fmtCache = new Map<string, Intl.DateTimeFormat>();

function formatter(locale: LabelLocale, init: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify([locale, init]);
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale ?? "en", init);
    fmtCache.set(key, f);
  }
  return f;
}

export function formatDay(ms: number, locale?: LabelLocale): string {
  return formatter(locale, { day: "numeric", month: "short" }).format(new Date(ms));
}

export function formatDayNumber(ms: number, locale?: LabelLocale): string {
  return formatter(locale, { day: "numeric" }).format(new Date(ms));
}

export function formatWeekday(ms: number, locale?: LabelLocale): string {
  return formatter(locale, { weekday: "short" }).format(new Date(ms));
}

export function formatMonth(ms: number, locale?: LabelLocale): string {
  return formatter(locale, { month: "short", year: "2-digit" }).format(new Date(ms));
}

export function formatMonthName(ms: number, locale?: LabelLocale): string {
  return formatter(locale, { month: "short" }).format(new Date(ms));
}

export function formatYear(ms: number, locale?: LabelLocale): string {
  return formatter(locale, { year: "numeric" }).format(new Date(ms));
}

export function formatQuarter(ms: number, _locale?: LabelLocale): string {
  const q = Math.floor(new Date(ms).getMonth() / 3) + 1;
  return `Q${q}`;
}

export function formatDateTime(ms: number, locale?: LabelLocale): string {
  return formatter(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

/** "3d" / "1d 4h" / "6h" — duration label for tooltips & cells. */
export function formatDuration(startMs: number, endMs: number): string {
  let ms = Math.max(0, endMs - startMs);
  const days = Math.floor(ms / MS_PER_DAY);
  ms -= days * MS_PER_DAY;
  const hours = Math.round(ms / MS_PER_HOUR);
  if (days > 0 && hours > 0) return `${days}d ${hours}h`;
  if (days > 0) return `${days}d`;
  return `${hours}h`;
}

// ── View range ───────────────────────────────────────────────────────────────

/**
 * Compute the timeline's visible range from the data: from the earliest
 * start to the latest end, padded one week on each side so the outermost bar
 * is not glued to the edge. Zoom-independent on purpose — the zoom handler
 * anchors the date under the pointer, which is only exact when the range
 * does not move between zoom steps.
 */
export function computeViewRange(starts: number[], ends: number[]): {
  start: number;
  end: number;
} {
  const now = startOfDay(Date.now());
  const min = starts.length ? Math.min(...starts) : addDays(now, -14);
  const max = ends.length ? Math.max(...ends) : addDays(now, 14);
  return {
    start: startOfDay(min) - 7 * MS_PER_DAY,
    end: addDays(startOfDay(max), 7),
  };
}

// ── Projection ───────────────────────────────────────────────────────────────

export function dateToX(ms: number, viewStart: number, pxPerDay: number): number {
  return ((ms - viewStart) / MS_PER_DAY) * pxPerDay;
}

export function xToDate(x: number, viewStart: number, pxPerDay: number): number {
  return viewStart + (x / pxPerDay) * MS_PER_DAY;
}

/**
 * Snap a timestamp to the configured unit. `week` snaps to the start of the
 * week. `none` passes through (still clamped to the hour when the timeline is
 * hour-fine, i.e. pxPerDay > 120).
 */
export function snapDate(ms: number, snap: GanttSnap): number {
  switch (snap) {
    case "none":
      return ms;
    case "hour": {
      const d = new Date(ms);
      d.setMinutes(0, 0, 0);
      return d.getTime();
    }
    case "day":
      return startOfDay(ms);
    case "week":
      return startOfWeek(ms);
  }
}

// ── Time scale header levels ─────────────────────────────────────────────────

/**
 * Pick the base header unit for a zoom. Two levels are produced: a coarse
 * level (month/year/quarter) and a fine level whose columns are the grid
 * lines of the timeline.
 */
export function pickBaseUnit(pxPerDay: number): "day" | "week" | "month" | "quarter" {
  if (pxPerDay >= 24) return "day";
  if (pxPerDay >= 4) return "week";
  if (pxPerDay >= 0.8) return "month";
  return "quarter";
}

interface ColumnSeed {
  start: number;
  end: number;
}

/**
 * Build the two header levels for the visible range. Columns align to real
 * calendar boundaries and carry their true widths (a February is narrower
 * than a March).
 */
export function buildTimeScale(
  rangeStart: number,
  rangeEnd: number,
  pxPerDay: number,
  locale?: string,
): GanttTimeScaleLevel[] {
  const base = pickBaseUnit(pxPerDay);
  const levels: GanttTimeScaleLevel[] = [];

  const seed = (
    from: number,
    to: number,
    step: (ms: number) => number,
    back: (ms: number) => number,
  ): ColumnSeed[] => {
    const seeds: ColumnSeed[] = [];
    let cur = back(from);
    while (cur < to) {
      const next = step(cur);
      if (next > cur) seeds.push({ start: cur, end: next });
      cur = next;
    }
    return seeds;
  };

  const pushLevel = (
    id: string,
    seeds: ColumnSeed[],
    labelOf: (s: number) => { label: string; subLabel?: string },
  ) => {
    const columns = seeds
      .filter((s) => s.end > rangeStart && s.start < rangeEnd)
      .map((s, i) => {
        const clampedStart = Math.max(s.start, rangeStart);
        const clampedEnd = Math.min(s.end, rangeEnd);
        const text = labelOf(s.start);
        return {
          id: `${id}-${i}`,
          label: text.label,
          subLabel: text.subLabel,
          start: clampedStart,
          end: clampedEnd,
          width: ((clampedEnd - clampedStart) / MS_PER_DAY) * pxPerDay,
        };
      });
    if (columns.length > 0) levels.push({ id, columns });
  };

  if (base === "day") {
    // Fine: days. Coarse: months.
    pushLevel(
      "day",
      seed(rangeStart, rangeEnd, (m) => addDays(m, 1), startOfDay),
      (s) => {
        const d = new Date(s);
        return {
          label: formatDayNumber(s, locale),
          subLabel: d.getDay() === 1 ? formatWeekday(s, locale) : undefined,
        };
      },
    );
    pushLevel(
      "month",
      seed(rangeStart, rangeEnd, (m) => addMonths(m, 1), startOfMonth),
      (s) => ({ label: formatMonthName(s, locale), subLabel: formatYear(s, locale) }),
    );
  } else if (base === "week") {
    // Fine: weeks. Coarse: months.
    pushLevel(
      "week",
      seed(rangeStart, rangeEnd, (m) => addDays(m, 7), (m) => startOfWeek(m)),
      (s) => {
        const week = getIsoWeekNumber(s);
        return { label: `W${week}`, subLabel: formatDay(s, locale) };
      },
    );
    pushLevel(
      "month",
      seed(rangeStart, rangeEnd, (m) => addMonths(m, 1), startOfMonth),
      (s) => ({ label: formatMonthName(s, locale), subLabel: formatYear(s, locale) }),
    );
  } else if (base === "month") {
    // Fine: months. Coarse: years.
    pushLevel(
      "month",
      seed(rangeStart, rangeEnd, (m) => addMonths(m, 1), startOfMonth),
      (s) => ({ label: formatMonthName(s, locale), subLabel: formatYear(s, locale) }),
    );
    pushLevel(
      "year",
      seed(rangeStart, rangeEnd, (m) => addMonths(m, 12), startOfYear),
      (s) => ({ label: formatYear(s, locale) }),
    );
  } else {
    // Fine: quarters. Coarse: years.
    pushLevel(
      "quarter",
      seed(rangeStart, rangeEnd, (m) => addMonths(m, 3), startOfQuarter),
      (s) => ({ label: formatQuarter(s, locale), subLabel: formatYear(s, locale) }),
    );
    pushLevel(
      "year",
      seed(rangeStart, rangeEnd, (m) => addMonths(m, 12), startOfYear),
      (s) => ({ label: formatYear(s, locale) }),
    );
  }

  // Coarse first (top row), fine second — matches Gantt convention.
  levels.reverse();
  return levels;
}

/** ISO-8601 week number (used for the week header label). */
export function getIsoWeekNumber(ms: number): number {
  // Column starts are local midnights, so the local day-of-week is the true
  // weekday — keep the whole Thursday-rule computation in local time.
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  const dayNum = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
}

/**
 * Width of the visible timeline in px.
 */
export function rangeWidth(rangeStart: number, rangeEnd: number, pxPerDay: number): number {
  return ((rangeEnd - rangeStart) / MS_PER_DAY) * pxPerDay;
}
