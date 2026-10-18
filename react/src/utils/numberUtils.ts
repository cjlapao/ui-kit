/**
 * Compact number formatting — "87047" → "87k", "3572680" → "3.5m".
 *
 * Rules:
 * - under 1,000: the number as-is (780 → "780")
 * - k / m / b / t: **truncated** (not rounded) so values never roll
 *   over their unit (999_999 → "999k", 9_999_999 → "9.9m")
 * - k is an integer; m / b / t keep one decimal
 * - negative values keep their sign; non-finite values pass through
 *   as strings ("NaN", "Infinity")
 *
 * Framework-agnostic: usable from any part of the kit (stats, tiles,
 * badges) and exported from the package root.
 */

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (abs < 1_000) return `${sign}${Math.round(abs)}`;
  if (abs < 1_000_000) return `${sign}${Math.trunc(abs / 1_000)}k`;
  if (abs < 1_000_000_000) return `${sign}${trunc1(abs / 1_000_000)}m`;
  if (abs < 1_000_000_000_000) return `${sign}${trunc1(abs / 1_000_000_000)}b`;
  return `${sign}${trunc1(abs / 1_000_000_000_000)}t`;
}

/** One decimal place, truncated toward zero (3.572 → "3.5", 4.0 → "4"). */
function trunc1(n: number): string {
  const s = Math.trunc(n * 10) / 10;
  return Number.isInteger(s) ? String(s) : s.toFixed(1);
}

import {
  DataSizeUnit,
  normalizeDataSizeUnit,
} from "../../../common/utils/bytesUtils";

const UNIT_SUFFIX: Record<DataSizeUnit, string> = {
  B: "b",
  KB: "kb",
  MB: "mb",
  GB: "gb",
  TB: "tb",
};
const UNIT_EXPONENT: Record<DataSizeUnit, number> = {
  B: 0,
  KB: 1,
  MB: 2,
  GB: 3,
  TB: 4,
};

export interface FormatCompactBytesOptions {
  /**
   * Target display unit (case-insensitive — "gb", "GB" or "gigabytes" via
   * the shared normalizer). Default "auto": the largest unit in which the
   * value is at least 1 (24_739_898 → "24.7mb"). Force one for fixed
   * layouts, e.g. a disk "free space" stat:
   * `formatCompactBytes(2_500_000_000, { unit: "gb" })` → "2.5gb".
   */
  unit?: "auto" | DataSizeUnit | Lowercase<DataSizeUnit>;
  /**
   * Step size. Default 1000 (how disks report "GB"); 1024 for strict
   * memory math.
   */
  base?: 1000 | 1024;
}

/**
 * Compact byte-size formatting — 24_739_898 bytes → "24.7mb".
 *
 * The compact-style sibling of the existing formatBytes (uppercase,
 * rounded, "1.43 MB"): same contract as formatCompact — truncated
 * (never rolls over a unit), one decimal for kb–tb, lowercase units,
 * sign preserved, non-finite values pass through. The value is always
 * in bytes; `unit` picks the display unit, `base` picks the step.
 *
 * @example formatCompactBytes(24_739_898)                  → "24.7mb"
 * @example formatCompactBytes(2_500_000_000, { unit: "gb" }) → "2.5gb"
 * @example formatCompactBytes(2_048_000, { unit: "mb" })    → "2mb"
 */
export function formatCompactBytes(
  value: number,
  opts: FormatCompactBytesOptions = {},
): string {
  if (!Number.isFinite(value)) return String(value);
  const base = opts.base ?? 1000;
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  const unit =
    opts.unit && opts.unit !== "auto"
      ? normalizeDataSizeUnit(opts.unit)
      : abs >= Math.pow(base, 4)
        ? "TB"
        : abs >= Math.pow(base, 3)
          ? "GB"
          : abs >= Math.pow(base, 2)
            ? "MB"
            : abs >= base
              ? "KB"
              : "B";

  const scaled = abs / Math.pow(base, UNIT_EXPONENT[unit]);
  const num = unit === "B" ? Math.round(scaled) : trunc1(scaled);
  return `${sign}${num}${UNIT_SUFFIX[unit]}`;
}

