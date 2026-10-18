/**
 * Funnel geometry — pure, real-time.
 *
 * A vertical conversion funnel: up to 6 stages, single series. Each stage
 * is a bright trapezoid (top width ∝ value, gentle taper); the dark
 * connectors between stages and the bottom arrow are derived darker
 * versions of the stage colors. Stage names ride dotted leaders on the
 * right; conversion percentages sit in the gaps.
 *
 * Everything is derived from the plot area + items — no cartesian scales.
 */

export interface FunnelItem {
  label: string;
  value: number;
}

export interface FunnelStage {
  /** Stage index (0 = top / largest). */
  index: number;
  label: string;
  value: number;
  /** Bright trapezoid vertices, clockwise from top-left. */
  points: [number, number][];
  /** Trapezoid top width. */
  width: number;
  /** Vertical band [yTop, yBottom]. */
  yTop: number;
  yBottom: number;
  /** Center x of the funnel column. */
  cx: number;
  /** Stage fill color (resolved). */
  color: string;
  /** Value label anchor (trapezoid center). */
  valueX: number;
  valueY: number;
}

export interface FunnelConnector {
  /** Connector between stages i and i+1. */
  index: number;
  points: [number, number][];
  color: string;
  /** Conversion v[i+1]/v[i] (0-safe). */
  conversion: number;
  /** % label anchor. */
  labelX: number;
  labelY: number;
}

export interface FunnelArrow {
  points: [number, number][];
  color: string;
}

export interface FunnelGeometry {
  stages: FunnelStage[];
  connectors: FunnelConnector[];
  arrow: FunnelArrow | null;
  cx: number;
  /** Max stage width (top of the first stage). */
  maxW: number;
  /** Stage-name label column x (text start). */
  labelX: number;
}

export interface FunnelOptions {
  /** Stage colors in data order. Defaults to a single color. */
  colors: string[];
  showLabels?: boolean;
  showValues?: boolean;
  showConversion?: boolean;
  arrow?: boolean;
  /** Min stage width as a fraction of the max. Default 0.22. */
  minWidthRatio?: number;
  /**
   * Width scale. "log" (default) compresses huge drop-offs — funnels
   * are steep by nature, so linear widths would leave the tail at
   * sliver size. "linear" keeps widths strictly proportional.
   */
  scale?: "linear" | "log";
  /** Hard cap on stages. Default 6. */
  maxStages?: number;
}

/** Hard cap on funnel stages (geometry is tuned for 1–6). */
export const FUNNEL_MAX_STAGES = 6;

const DARK_TARGET = "#0b1220";

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return [120, 120, 120];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Mix `hex` toward `target` by `t` (0..1). Non-hex input passes through. */
export function mixHex(hex: string, target: string, t: number): string {
  if (!/^#[0-9a-f]{3,8}$/i.test(hex)) return hex;
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex(
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  );
}

/** Darker version of a stage color (connectors + arrow). */
export function darkenStage(hex: string): string {
  return mixHex(hex, DARK_TARGET, 0.42);
}

export function computeFunnelGeometry(
  area: { x: number; y: number; width: number; height: number },
  items: FunnelItem[],
  opts: FunnelOptions,
): FunnelGeometry | null {
  const maxStages = opts.maxStages ?? FUNNEL_MAX_STAGES;
  const all = items.slice(0, maxStages).filter((it) => it.value > 0);
  const n = all.length;
  if (n === 0 || area.width <= 0 || area.height <= 0) return null;

  const H = area.height;
  const showLabels = opts.showLabels !== false;
  const showArrow = opts.arrow !== false;
  const minWidthRatio = opts.minWidthRatio ?? 0.22;

  const funnelMaxW = area.width * (showLabels ? 0.62 : 0.86);
  const cx = area.x + funnelMaxW / 2;

  const vMax = Math.max(...all.map((it) => it.value));
  // Default "log": funnels are steep by nature; log widths keep the
  // tail legible and distinct. "linear" is strictly proportional.
  const logMax = Math.log10(1 + vMax);
  const ratio = (v: number) =>
    opts.scale === "linear"
      ? v / vMax
      : Math.log10(1 + v) / (logMax > 0 ? logMax : 1);
  const widths = all.map((it) =>
    Math.max(funnelMaxW * ratio(it.value), funnelMaxW * minWidthRatio),
  );

  const arrowH = showArrow ? H * 0.1 : 0;
  const gap = H * 0.09;
  const stageH = (H - (n - 1) * gap - arrowH) / n;

  const stages: FunnelStage[] = [];
  for (let i = 0; i < n; i++) {
    const w = widths[i];
    const yTop = area.y + i * (stageH + gap);
    const yBottom = yTop + stageH;
    // Gentle taper on the bright block; the dark connector does the
    // steep taper down to the next stage's width (reference look).
    const bw = w * (i < n - 1 ? 0.8 : 0.6);
    stages.push({
      index: i,
      label: all[i].label,
      value: all[i].value,
      points: [
        [cx - w / 2, yTop],
        [cx + w / 2, yTop],
        [cx + bw / 2, yBottom],
        [cx - bw / 2, yBottom],
      ],
      width: w,
      yTop,
      yBottom,
      cx,
      color: opts.colors[i] ?? opts.colors[0],
      valueX: cx,
      valueY: (yTop + yBottom) / 2,
    });
  }

  const connectors: FunnelConnector[] = [];
  for (let i = 0; i < n - 1; i++) {
    const topW = stages[i].points[2][0] - stages[i].points[3][0]; // bottom width
    const botW = widths[i + 1];
    const y1 = stages[i].yBottom;
    const y2 = stages[i + 1].yTop;
    const conv =
      stages[i].value > 0 ? stages[i + 1].value / stages[i].value : 0;
    connectors.push({
      index: i,
      points: [
        [cx - topW / 2, y1],
        [cx + topW / 2, y1],
        [cx + botW / 2, y2],
        [cx - botW / 2, y2],
      ],
      color: darkenStage(stages[i].color),
      conversion: conv,
      // Anchor OUTSIDE the connector's slanted right edge at the label's
      // y (mid-gap): the edge width there is the average of the top and
      // bottom half-widths. Fixed-to-bottom-width anchors land on the
      // dark shape for steep connectors.
      labelX: cx + (topW + botW) / 4 + 10,
      labelY: (y1 + y2) / 2,
    });
  }

  let arrow: FunnelArrow | null = null;
  if (showArrow) {
    const last = stages[n - 1];
    const topW = last.points[2][0] - last.points[3][0];
    const y1 = area.y + H - arrowH;
    const y2 = area.y + H;
    arrow = {
      points: [
        [cx - topW / 2, y1],
        [cx + topW / 2, y1],
        [cx + topW * 0.09, y2],
        [cx - topW * 0.09, y2],
      ],
      color: darkenStage(last.color),
    };
  }

  return {
    stages,
    connectors,
    arrow,
    cx,
    maxW: widths[0],
    labelX: area.x + funnelMaxW + 26,
  };
}

/** Point-in-convex-polygon test (funnel stages/connectors are convex). */
export function pointInPolygon(
  px: number,
  py: number,
  poly: [number, number][],
): boolean {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
    if (cross !== 0) {
      const s = Math.sign(cross);
      if (sign === 0) sign = s;
      else if (s !== sign) return false;
    }
  }
  return true;
}
