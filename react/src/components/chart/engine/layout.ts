/**
 * Layout math: turn a container size plus the set of enabled chrome
 * (title, legend, axes, caption) into the plot rectangle every mark draws
 * inside. Pure function — no DOM.
 */
import type {
  ChartArea,
  ChartLayout,
  ChartMargins,
  ResolvedMargins,
} from "./types";

/** Reserved pixel heights/widths for chrome. v1: fixed estimates. */
export const LAYOUT_SIZES = {
  title: 22,
  subtitle: 18,
  legend: 30,
  xAxis: 36,
  yAxis: 52,
  rightYAxis: 52,
  caption: 22,
  /** Default margins around the whole chart. */
  defaultMargin: { top: 8, right: 12, bottom: 8, left: 8 },
} as const;

export interface LayoutRequest {
  width: number;
  height: number;
  margin?: ChartMargins;
  hasTitle?: boolean;
  hasSubtitle?: boolean;
  hasLegend?: boolean;
  hasCaption?: boolean;
  hasXAxis?: boolean;
  hasYAxis?: boolean;
  /** A second y-axis on the right edge. */
  hasRightYAxis?: boolean;
  /** Where a horizontal legend sits. "bottom" reserves the legend strip
   * under the x-axis instead of under the title block. */
  legendPosition?: "top" | "bottom";
}

export function resolveMargins(margin: ChartMargins | undefined): ResolvedMargins {
  const d = LAYOUT_SIZES.defaultMargin;
  return {
    top: margin?.top ?? d.top,
    right: margin?.right ?? d.right,
    bottom: margin?.bottom ?? d.bottom,
    left: margin?.left ?? d.left,
  };
}

/**
 * Compute the chart layout.
 *
 * Vertical reservation order (top → bottom): margin.top, title, subtitle,
 * legend, [chartArea], xAxis, caption, margin.bottom.
 * Horizontal: margin.left, yAxis, [chartArea], rightYAxis, margin.right.
 */
export function computeLayout(req: LayoutRequest): ChartLayout {
  const width = Math.max(0, req.width);
  const height = Math.max(0, req.height);
  const margin = resolveMargins(req.margin);

  const titleHeight = req.hasTitle ? LAYOUT_SIZES.title : 0;
  const subtitleHeight = req.hasSubtitle ? LAYOUT_SIZES.subtitle : 0;
  const legendHeight = req.hasLegend ? LAYOUT_SIZES.legend : 0;
  const captionHeight = req.hasCaption ? LAYOUT_SIZES.caption : 0;

  const yAxisWidth = req.hasYAxis ? LAYOUT_SIZES.yAxis : 0;
  const rightYAxisWidth = req.hasRightYAxis ? LAYOUT_SIZES.rightYAxis : 0;
  const xAxisHeight = req.hasXAxis ? LAYOUT_SIZES.xAxis : 0;

  // A bottom legend reserves its strip under the x-axis, so the plot keeps
  // the top edge (no strip under the title) but still loses the legend
  // height from the bottom.
  const topLegendHeight =
    req.hasLegend && req.legendPosition === "bottom" ? 0 : legendHeight;

  const chartArea: ChartArea = {
    x: margin.left + yAxisWidth,
    y: margin.top + titleHeight + subtitleHeight + topLegendHeight,
    width: Math.max(
      0,
      width - margin.left - margin.right - yAxisWidth - rightYAxisWidth,
    ),
    height: Math.max(
      0,
      height -
        margin.top -
        margin.bottom -
        titleHeight -
        subtitleHeight -
        legendHeight -
        captionHeight -
        xAxisHeight,
    ),
  };

  return {
    width,
    height,
    margin,
    chartArea,
    titleHeight: titleHeight + subtitleHeight,
    legendHeight,
    captionHeight,
  };
}
