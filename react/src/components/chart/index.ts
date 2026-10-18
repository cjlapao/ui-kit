/**
 * Chart — PrimeUI-style compound chart components for React.
 *
 * Usage:
 * ```tsx
 * import { Chart } from "@cjlapao/ui-kit";
 *
 * <Chart.Svg height={420}>
 *   <Chart.Title title="Revenue" subtitle="Jan 2024 → Jun 2025" />
 *   <Chart.Line data={arr} name="ARR" color="purple" curve="smooth" fillOpacity={0.35} />
 *   <Chart.XAxis />
 *   <Chart.YAxis domain={[50, 350]} />
 *   <Chart.Legend />
 *   <Chart.Tooltip />
 *   <Chart.Hover />
 * </Chart.Svg>
 * ```
 *
 * Engine-level APIs (scales, easing registry, layout math, …) are re-exported
 * for advanced use: `registerEasing`, `EASING_PRESETS`, …
 */
import { ChartCanvas, ChartSvg, setChartRegistry } from "./react/ChartRoot";
import { ChartGroup } from "./react/ChartGroup";
import {
  LineSeries,
} from "./react/series/LineSeries";
import { BarSeries } from "./react/series/BarSeries";
import { PieSeries } from "./react/series/PieSeries";
import { CandlestickSeries } from "./react/series/CandlestickSeries";
import { RangeAreaSeries } from "./react/series/RangeAreaSeries";
import { RadarSeries } from "./react/series/RadarSeries";
import { RadarAxis } from "./react/features/RadarAxis";
import { PolarSeries } from "./react/series/PolarSeries";
import { PolarAxis } from "./react/features/PolarAxis";
import { PolarCenter } from "./react/features/PolarCenter";
import { ScatterSeries } from "./react/series/ScatterSeries";
import { XAxis } from "./react/features/XAxis";
import { YAxis } from "./react/features/YAxis";
import { Legend } from "./react/features/Legend";
import { Tooltip } from "./react/features/Tooltip";
import { Title, Caption } from "./react/features/TitleCaption";
import { Hover } from "./react/features/Hover";
import { ReferenceLine, ReferenceBand } from "./react/features/ReferenceMarks";
import { Annotation } from "./react/features/Annotation";
import { DataLabels } from "./react/features/DataLabels";
import { PieCenter } from "./react/features/PieCenter";
import { AxisBadges } from "./react/features/AxisBadges";
import { GaugeSeries } from "./react/series/GaugeSeries";
import { WaterfallSeries } from "./react/series/WaterfallSeries";
import { HeatmapSeries } from "./react/series/HeatmapSeries";
import { TreemapSeries } from "./react/series/TreemapSeries";
import { FunnelSeries } from "./react/series/FunnelSeries";

// Register the concrete types so the root can split children without a
// circular import.
setChartRegistry({
  Line: LineSeries,
  Bar: BarSeries,
  Pie: PieSeries,
  Candlestick: CandlestickSeries,
  RangeArea: RangeAreaSeries,
  Radar: RadarSeries,
  RadarAxis,
  Polar: PolarSeries,
  PolarAxis,
  PolarCenter,
  Scatter: ScatterSeries,
  Gauge: GaugeSeries,
  Waterfall: WaterfallSeries,
  Heatmap: HeatmapSeries,
  Treemap: TreemapSeries,
  Funnel: FunnelSeries,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Hover,
  Title,
  Caption,
  ReferenceLine,
  ReferenceBand,
  Annotation,
  DataLabels,
  PieCenter,
  AxisBadges,
});

export const Chart = {
  Svg: ChartSvg,
  Canvas: ChartCanvas,
  Group: ChartGroup,
  Line: LineSeries,
  Bar: BarSeries,
  Pie: PieSeries,
  Candlestick: CandlestickSeries,
  RangeArea: RangeAreaSeries,
  Radar: RadarSeries,
  RadarAxis,
  Polar: PolarSeries,
  PolarAxis,
  PolarCenter,
  Scatter: ScatterSeries,
  Gauge: GaugeSeries,
  Waterfall: WaterfallSeries,
  Heatmap: HeatmapSeries,
  Treemap: TreemapSeries,
  Funnel: FunnelSeries,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Hover,
  Title,
  Caption,
  ReferenceLine,
  ReferenceBand,
  Annotation,
  DataLabels,
  PieCenter,
  AxisBadges,
};

export default Chart;

// ── Re-exports ───────────────────────────────────────────────────────────────

export * from "./engine/index";
export type {
  ChartHandle,
  ChartRootProps,
  LineSeriesProps,
  BarSeriesProps,
  PieSeriesProps,
  CandlestickSeriesProps,
  CandlestickVariant,
  RangeAreaSeriesProps,
  RadarSeriesProps,
  RadarAxisProps,
  PolarSeriesProps,
  PolarAxisProps,
  PolarCenterProps,
  ScatterSeriesProps,
  GaugeSeriesProps,
  WaterfallSeriesProps,
  HeatmapSeriesProps,
  HeatmapAnnotation,
  TreemapSeriesProps,
  FunnelSeriesProps,
  XAxisProps,
  YAxisProps,
  TooltipProps,
  TooltipMode,
  HoverProps,
  LegendProps,
  DataLabelsProps,
  DataLabelPosition,
  AxisBadgesProps,
  PieCenterProps,
  TitleProps,
  CaptionProps,
  ReferenceLineProps,
  ReferenceBandProps,
  AnnotationProps,
} from "./react/props";
export { useChart } from "./react/ChartContext";
