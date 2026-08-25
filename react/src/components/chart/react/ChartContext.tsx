/**
 * ChartContext — everything a chart child needs, computed once per frame by
 * the root (scale/layout/theme/hover/animation).
 *
 * SVG children read it and render marks; canvas children register draw
 * functions that the root's rAF loop calls.
 */
import { createContext, useContext } from "react";

/** One pie slice with everything labels/legend need. */
export interface PieSliceLabel {
  name: string;
  value: number;
  color: string;
  /** Mid-angle (radians, y-down, 0 = 12 o'clock, clockwise). */
  labelAngle: number;
}

/** Pie geometry published by <Chart.Pie> for DataLabels and Legend. */
export interface PiePresentation {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  /** Sum of slice values. */
  total: number;
  slices: PieSliceLabel[];
}
import type {
  CategoricalScale,
  ChartArea,
  ChartLayout,
  ChartThemeTokens,
  ContinuousScale,
  HoverState,
} from "../engine/types";
import type { SeriesDescriptor } from "./props";

export type ChartRenderer = "svg" | "canvas";
export type ChartThemeMode = "light" | "dark";

/** Canvas draw callback: paint one series (or overlay) into the chart. */
export type ChartDrawFn = (
  ctx: CanvasRenderingContext2D,
  state: { progress: number; width: number; height: number },
) => void;

export interface SeriesState {
  descriptor: SeriesDescriptor;
  /** Resolved stroke hex (palette fallback applied). */
  color: string;
  /** Resolved fill hex. */
  fillColor: string;
  /** Hidden via the legend toggle. */
  hidden: boolean;
}

export interface ChartContextValue {
  renderer: ChartRenderer;
  /** Pixel size of the whole chart. */
  width: number;
  height: number;
  /** Plotted area inside margins. */
  area: ChartArea;
  layout: ChartLayout;

  /** x scale (cartesian charts; null for pie-only). */
  xScale: ContinuousScale | CategoricalScale | null;
  xIsTime: boolean;
  /** left y scale */
  yScale: ContinuousScale | null;
  /** right y scale (when a series opts in) */
  rightYScale: ContinuousScale | null;

  theme: ChartThemeTokens;
  /** Active scheme (resolved from `theme="auto"`). */
  isDark: boolean;
  /** Resolved scheme name. */
  themeName: ChartThemeMode;

  /** Global animation progress 0..1 (entrance/update). 1 = settled. */
  progress: number;
  /** Whether animations are disabled entirely. */
  animationsDisabled: boolean;

  /** All series descriptors in render order. */
  series: SeriesState[];
  /** Series ids toggled hidden by the legend. */
  hiddenIds: ReadonlySet<string>;
  /** Legend toggle handler. */
  toggleSeries: (id: string) => void;
  /** Whether any legend child is present (else hiddenIds are inert). */
  legendPresent: boolean;

  /** Current hover state (null when nothing is hovered). */
  hover: HoverState | null;
  setHover: (state: HoverState | null) => void;
  hoverEnabled: boolean;
  tooltipMode: "shared" | "follow" | "crosshair";

  /** Bumped by Chart.redraw() to force a canvas repaint. */
  redrawNonce: number;
  requestRedraw: () => void;
  /**
   * Canvas: register this id's draw function (replaces previous). `layer`
   * "back" fns (axes, grid, reference bands) run before "front" fns so the
   * grid never paints over the marks.
   */
  registerDraw: (
    id: string,
    fn: ChartDrawFn,
    layer?: "back" | "front",
  ) => void;
  unregisterDraw: (id: string) => void;

  /** Title text (for aria + tooltip fallbacks). */
  title?: string;
  /** Last visible point of each cartesian series (badges, callouts). */
  seriesEndpoints: {
    id: string;
    name?: string;
    color: string;
    value: number;
    x: number;
    y: number;
  }[];
  /**
   * Element-identity → SeriesState. The root stamps every series element
   * with `__chartSeriesToken` (its own element object) so several series
   * sharing one data array or type each resolve their own state.
   */
  seriesTokens: Map<object, SeriesState>;
  /**
   * seriesId → pie geometry (registered by <Chart.Pie> after mount so
   * DataLabels/Legend can position per-slice marks). Consumers re-render
   * via the redrawNonce bump that registration triggers.
   */
  piePresentations: Map<string, PiePresentation>;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export const ChartContextProvider = ChartContext.Provider;

/**
 * Access the chart root's computed state. Throws outside a Chart —
 * feature components must never render standalone.
 */
export function useChart(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error(
      "useChart() must be called inside <Chart.Svg> or <Chart.Canvas>.",
    );
  }
  return ctx;
}

/** Safe variant for components that may also be inspected by the root. */
export function useChartSafe(): ChartContextValue | null {
  return useContext(ChartContext);
}
