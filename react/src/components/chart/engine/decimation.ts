/**
 * Stride decimation for high-density data.
 *
 * v1: keep every Nth point so the pixel budget (~2 points per px is the
 * caller's concern) is respected, and always keep the final point —
 * last-value badges and "end of series" markers must stay accurate.
 */
export function decimate<T>(items: T[], maxPoints: number): T[] {
  if (!Number.isFinite(maxPoints) || maxPoints <= 0) return [];
  if (items.length <= maxPoints) return items;
  const stride = Math.ceil(items.length / maxPoints);
  const out: T[] = [];
  for (let i = 0; i < items.length; i += stride) {
    out.push(items[i]);
  }
  const last = items[items.length - 1];
  if (out[out.length - 1] !== last) {
    out.push(last);
  }
  return out;
}
