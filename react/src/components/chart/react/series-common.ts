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
  type:
    | "line"
    | "bar"
    | "pie"
    | "candlestick"
    | "rangeArea"
    | "radar"
    | "polar"
    | "scatter",
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
  // Transposed cartesian (horizontal waterfall): values ride the x scale.
  if (ctx.transposed) {
    const xs = ctx.xScale;
    return xs && !("bandWidth" in xs) ? (xs as ContinuousScale) : null;
  }
  return d.yFieldAxis === "right" && ctx.rightYScale
    ? ctx.rightYScale
    : (ctx.yScale as ContinuousScale | null);
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


/**
 * Dim opacity for a series group while another series is hovered (the
 * root's `hoverDim` prop; 1 = off). A series whose own mark is under the
 * pointer keeps full opacity; the others fade to hoverDim.
 */
/**
 * Dim opacity for a series group while another series is hovered (the
 * root's `hoverDim` prop; 1 = off). A series whose own mark is under the
 * pointer keeps full opacity; the others fade to hoverDim.
 */
export function seriesDimStyle(
  hover: { items: { seriesId: string }[] } | null,
  seriesId: string,
  hoverDim: number,
): number {
  if (!hover || hoverDim >= 1) return 1;
  if (hover.items.some((i) => i.seriesId === seriesId)) return 1;
  return hoverDim;
}

/**
 * Dim opacity for polar (rose) series: the hover state carries one row per
 * series of the hovered category (index = that category's data row). A
 * series whose own segment at that row was hit (its row is present) keeps
 * full opacity; the others fade to hoverDim.
 */
export function polarSeriesDimStyle(
  hover: { items: { seriesId: string; index?: number }[] } | null,
  seriesId: string,
  hoverDim: number,
): number {
  if (!hover || hoverDim >= 1) return 1;
  // The root tags the pointer-hit series with its real id and prefixes the
  // others ("polar-dim:…") — so an un-prefixed row for this series means
  // the pointer is on this series' segment.
  if (hover.items.some((i) => i.seriesId === seriesId)) return 1;
  return hoverDim;
}
