/**
 * Shared plumbing for the four series components.
 */
import type { ContinuousScale } from "../engine/types";
import { lerp } from "../engine/animation";
import type { useChart } from "./ChartContext";
import type { SeriesState } from "./ChartContext";

type Ctx = ReturnType<typeof useChart>;

/**
 * Find this component's SeriesState in the root's series list.
 * Resolution order:
 *  1. the root's element-identity token (authoritative — multiple series
 *     may share one data array or type),
 *  2. explicit id,
 *  3. data-array identity (auto ids).
 */
export function findSeries(
  ctx: Ctx,
  type: "line" | "bar" | "pie" | "candlestick",
  myId: string | undefined,
  data: unknown[],
  token?: object,
): SeriesState | null {
  if (token) {
    const byToken = ctx.seriesTokens.get(token);
    if (byToken) return byToken;
  }
  if (myId) {
    const byId = ctx.series.find((s) => s.descriptor.id === myId);
    if (byId) return byId;
  }
  return (
    ctx.series.find((s) => s.descriptor.type === type && s.descriptor.data === data) ??
    null
  );
}

/** The value scale a series plots on (left vs right y-axis). */
export function valueScaleFor(ctx: Ctx, d: { yFieldAxis?: "left" | "right" }): ContinuousScale | null {
  return d.yFieldAxis === "right" && ctx.rightYScale
    ? ctx.rightYScale
    : ctx.yScale;
}

/**
 * Interpolate two numeric arrays element-wise (clamped, unequal lengths).
 * Re-exported so series files share one implementation.
 */
export function lerpArray(a: number[], b: number[], t: number): number[] {
  const n = Math.max(a.length, b.length);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    out[i] = lerp(
      a.length ? a[Math.min(i, a.length - 1)] : b[Math.min(i, b.length - 1)],
      b.length ? b[Math.min(i, b.length - 1)] : a[Math.min(i, a.length - 1)],
      t,
    );
  }
  return out;
}

/** True when the global animation has settled (or is disabled). */
export function isSettled(ctx: Ctx): boolean {
  return ctx.progress >= 1 || ctx.animationsDisabled;
}
