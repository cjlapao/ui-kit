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
