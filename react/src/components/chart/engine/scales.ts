/**
 * Scale factories wrapping d3-scale.
 *
 * This is the only engine module that imports d3 — everything else consumes
 * the narrow {@link ContinuousScale} / {@link CategoricalScale} interfaces,
 * so d3 stays an implementation detail.
 */
import { scaleBand, scaleLinear, scalePoint, scaleTime } from "d3-scale";
import type {
  AnyScale,
  CategoricalScale,
  ContinuousScale,
} from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MS_DAY = 24 * 60 * 60 * 1000;

// ── Domain detection ─────────────────────────────────────────────────────────

/**
 * Heuristic: is this x-value list a time series? True when at least half of
 * the non-empty values are Dates or ISO-like date strings. Mixed garbage
 * falls back to the category axis (documented behavior).
 */
export function isTimeDomain(values: unknown[]): boolean {
  const meaningful = values.filter(
    (v) => v !== null && v !== undefined && v !== "",
  );
  if (meaningful.length === 0) return false;
  let timeLike = 0;
  for (const v of meaningful) {
    if (v instanceof Date && !Number.isNaN(v.getTime())) {
      timeLike += 1;
      continue;
    }
    if (typeof v === "string" && parseDateValue(v)) {
      timeLike += 1;
    }
  }
  return timeLike / meaningful.length >= 0.5;
}

/** Parse a date-ish value (Date, number epoch, ISO string) to a Date. */
export function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value);
  }
  if (typeof value === "string") {
    const parsed = parseDateValue(value);
    if (parsed) return parsed;
    // Last resort: let the Date constructor try (handles "Nov 1, 2024" etc.)
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function parseDateValue(value: string): Date | null {
  // ISO 8601 (date or datetime) — the common data shape.
  const iso =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(
      value,
    );
  if (iso) {
    const d = new Date(
      Number(iso[1]),
      Number(iso[2]) - 1,
      Number(iso[3]),
      Number(iso[4] ?? 0),
      Number(iso[5] ?? 0),
      Number(iso[6] ?? 0),
    );
    // Reject impossible dates (2024-13-40 parses to a Date but is wrong).
    if (d.getFullYear() !== Number(iso[1])) return null;
    return d;
  }
  return null;
}

// ── Formatting ───────────────────────────────────────────────────────────────

/**
 * Adaptive time tick label.
 *
 * - sub-day spans: clock time ("9:30 AM")
 * - ticks on Jan 1 render as the year alone ("2024")
 * - otherwise "Mon yyyy" ("Mar 2024") when the visible span is ≥ 60 days
 * - otherwise "d Mon" ("5 Nov") for short spans
 */
export function formatTimeTick(date: Date, spanMs: number): string {
  const isJan1 = date.getMonth() === 0 && date.getDate() === 1;
  const year = date.getFullYear();
  if (spanMs < 2 * MS_DAY) {
    const h = date.getHours();
    const m = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }
  if (isJan1 && spanMs >= 60 * MS_DAY) return String(year);
  if (spanMs >= 60 * MS_DAY) {
    return `${MONTHS[date.getMonth()]} ${year}`;
  }
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** Full date header for the tooltip ("Friday, Nov 1, 2024"). */
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function formatFullDate(value: number | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Compact number format for linear axes and tooltips (1.2k, 3.4M). */
export function formatSI(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${trimZero(value / 1_000_000_000)}B`;
  if (abs >= 1_000_000) return `${trimZero(value / 1_000_000)}M`;
  if (abs >= 10_000) return `${trimZero(value / 1_000)}k`;
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 100) / 100);
}

function trimZero(n: number): string {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

// ── Scale factories ──────────────────────────────────────────────────────────

export interface LinearScaleOptions {
  domain: [number, number];
  range: [number, number];
  /** Extend the domain to nice round bounds. Defaults to true. */
  nice?: boolean;
}

export function createLinearScale(options: LinearScaleOptions): ContinuousScale {
  const { domain, range } = options;
  const nice = options.nice ?? true;
  const inner = scaleLinear().domain(domain).range(range);
  if (nice) inner.nice();

  return {
    type: "linear",
    domain: inner.domain() as [number, number],
    range: inner.range() as [number, number],
    map: (value: number | Date) =>
      inner(typeof value === "number" ? value : new Date(value).getTime()),
    invert: (pixel: number) => inner.invert(pixel),
    ticks: (count = 6) => inner.ticks(count),
  };
}

export interface TimeScaleOptions {
  domain: [Date, Date];
  range: [number, number];
  /** Approximate number of ticks. Defaults to 8. */
  tickCount?: number;
}

export function createTimeScale(options: TimeScaleOptions): ContinuousScale {
  const { domain } = options;
  const tickCount = options.tickCount ?? 8;
  const inner = scaleTime().domain(domain).range(options.range);

  return {
    type: "time",
    domain: inner.domain() as [Date, Date],
    range: inner.range() as [number, number],
    map: (value: number | Date) => {
      const d = value instanceof Date ? value : new Date(value);
      return inner(d);
    },
    invert: (pixel: number) => inner.invert(pixel),
    ticks: (count = tickCount) => timeTicks(inner.domain()[0], inner.domain()[1], count),
  };
}

/**
 * Pick the step (from a candidate list) that brings the tick count closest
 * to `target`.
 */
function pickStep(steps: number[], span: number, target: number): number {
  let best = steps[0];
  let bestErr = Infinity;
  for (const s of steps) {
    const err = Math.abs(span / s - target) / target;
    if (err < bestErr) {
      bestErr = err;
      best = s;
    }
  }
  return best;
}

const DAY_STEPS = [1, 2, 7, 14, 21, 30];
const MONTH_STEPS = [1, 2, 3, 4, 6, 12];
const YEAR_STEPS = [1, 2, 5, 10, 20, 50];

/**
 * Adaptive time ticks, aligned to stable calendar anchors:
 *
 * - **≥ 3 years** — years, aligned to years divisible by the step
 * - **~half a year – 3 years** — month starts, aligned to absolute month
 *   indices divisible by the step (Jan-anchored for step 2: Jan, Mar, May, …)
 * - **3 days – ~half a year** — days, stepped from the first day boundary
 * - **< 3 days** — delegated to d3 (hour granularity)
 *
 * The absolute alignment means ticks don't shift when the visible domain
 * changes slightly (no label flicker on resize/hover).
 */
export function timeTicks(start: Date, end: Date, target = 8): Date[] {
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
    return Number.isNaN(startMs) ? [] : [new Date(startMs)];
  }
  const spanDays = (endMs - startMs) / MS_DAY;

  // Sub-week: let d3 pick hour/day intervals.
  if (spanDays < 3) {
    return scaleTime().domain([new Date(startMs), new Date(endMs)]).ticks(target);
  }

  const ticks: Date[] = [];

  if (spanDays < 180) {
    // Day-level (up to ~half a year): step from the first day boundary.
    const step = pickStep(DAY_STEPS, spanDays, target);
    const cursor = new Date(startMs);
    cursor.setHours(0, 0, 0, 0);
    if (cursor.getTime() < startMs) cursor.setDate(cursor.getDate() + 1);
    while (cursor.getTime() <= endMs) {
      ticks.push(new Date(cursor.getTime()));
      cursor.setDate(cursor.getDate() + step);
    }
    return ticks;
  }

  const spanYears = spanDays / 365.25;
  if (spanYears >= 3) {
    const step = pickStep(YEAR_STEPS, spanYears, target);
    const firstYear = start.getFullYear();
    for (let y = Math.ceil(firstYear / step) * step; y <= end.getFullYear(); y += step) {
      ticks.push(new Date(y, 0, 1));
    }
    return ticks;
  }

  // Month-level: absolute month index (Jan 1970 = 0) divisible by step.
  const spanMonths = spanDays / 30.4375;
  const step = pickStep(MONTH_STEPS, spanMonths, target);
  const sy = start.getFullYear();
  const sm = start.getMonth();
  let idx = sy * 12 + sm;
  if (idx % step !== 0) idx += step - (idx % step);
  while (true) {
    const d = new Date(Math.floor(idx / 12), idx % 12, 1);
    if (d.getTime() > endMs) break;
    if (d.getTime() >= startMs) ticks.push(d);
    idx += step;
  }
  return ticks;
}

/**
 * Attach an adaptive formatter to a time scale. Exported separately so the
 * axis and tooltip can share it without the scale carrying format state.
 */
export function timeTickFormat(
  scale: ContinuousScale,
): (tick: number | Date) => string {
  const [a, b] = scale.domain as [Date, Date];
  const spanMs = Math.max(1, b.getTime() - a.getTime());
  return (tick) => formatTimeTick(tick instanceof Date ? tick : new Date(tick), spanMs);
}

export interface BandScaleOptions {
  categories: string[];
  range: [number, number];
  /** 0–1 fraction of each band gap between neighbors. Default 0.15. */
  paddingInner?: number;
  /** 0–1 fraction of a band gap at the range edges. Default 0.15. */
  paddingOuter?: number;
}

export function createBandScale(options: BandScaleOptions): CategoricalScale {
  const { categories, range } = options;
  const inner = scaleBand<string>()
    .domain(categories)
    .range(range)
    .paddingInner(options.paddingInner ?? 0.15)
    .paddingOuter(options.paddingOuter ?? 0.15);
  const bw = inner.bandwidth();

  return {
    type: "band",
    domain: categories,
    range: inner.range() as [number, number],
    bandWidth: bw,
    map: (category: string) => inner(category) ?? 0,
    center: (category: string) => (inner(category) ?? 0) + bw / 2,
  };
}

export interface PointScaleOptions {
  categories: string[];
  range: [number, number];
}

export function createPointScale(options: PointScaleOptions): CategoricalScale {
  const { categories, range } = options;
  const inner = scalePoint<string>().domain(categories).range(range);

  return {
    type: "point",
    domain: categories,
    range: inner.range() as [number, number],
    bandWidth: 0,
    map: (category: string) => inner(category) ?? 0,
    center: (category: string) => inner(category) ?? 0,
  };
}

/** Pick a scale for an x-axis given detected domain kind. */
export function createXScale(opts: {
  domain: (number | Date | string)[];
  range: [number, number];
  isTime: boolean;
}): AnyScale {
  if (opts.isTime) {
    const dates = opts.domain.map((d) =>
      d instanceof Date ? d : toDate(String(d)) ?? new Date(0),
    );
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return createTimeScale({ domain: [min, max], range: opts.range });
  }
  if (opts.domain.every((d) => typeof d === "string")) {
    // De-dupe, keep first-seen order.
    const seen = new Set<string>();
    const categories = opts.domain
      .filter((d) => {
        const s = String(d);
        if (seen.has(s)) return false;
        seen.add(s);
        return true;
      })
      .map(String);
    return createBandScale({ categories, range: opts.range });
  }
  const nums = opts.domain.map((d) => Number(d));
  return createLinearScale({
    domain: [Math.min(...nums), Math.max(...nums)],
    range: opts.range,
  });
}
