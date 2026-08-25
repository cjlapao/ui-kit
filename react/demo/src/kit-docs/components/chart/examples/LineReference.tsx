import { Chart } from "@cjlapao/ui-kit";
import {
  betaEnd,
  betaStart,
  crosshairDate,
  lineMetrics,
  pricingEnd,
  pricingStart,
  rolloutEnd,
  rolloutStart,
} from "../data";

/**
 * The flagship demo — a close reading of the PrimeUI LINE reference:
 * four indexed series over 17 months, three phase windows, an indexed
 * baseline, a pricing-lift crosshair, two callout annotations and the
 * four end-of-series value badges in the left margin.
 */
export default function LineReference() {
  return (
    <div className="w-full max-w-5xl">
      <Chart.Svg height={460} ariaLabel="Growth metrics, indexed Jan 2024 to Jun 2025">
        <Chart.Title
          title="Growth metrics"
          subtitle="Indexed to 100 at launch · Jan 2024 → Jun 2025"
        />
        <Chart.Legend orientation="horizontal" />

        <Chart.Line
          id="arr"
          data={lineMetrics}
          name="Expansion ARR"
          valueYField="arr"
          color="violet"
          curve="smooth"
          fillOpacity={0.35}
          lineStrokeWidth={2.5}
        />
        <Chart.Line
          id="activation"
          data={lineMetrics}
          name="Activation rate"
          valueYField="activation"
          color="sky"
          curve="smooth"
          showMarkers
          markerShape="circle"
          markerSize={2.5}
          maxDataPoints={18}
        />
        <Chart.Line
          id="retention"
          data={lineMetrics}
          name="Week 8 retention"
          valueYField="retention"
          color="emerald"
          curve="smooth"
          lineStyle="dashed"
        />
        <Chart.Line
          id="risk"
          data={lineMetrics}
          name="Support risk"
          valueYField="risk"
          color="red"
          curve="smooth"
          lineStyle="dotted"
        />

        <Chart.XAxis />
        <Chart.YAxis domain={[50, 350]} tickCount={7} />

        <Chart.ReferenceBand
          x1={betaStart}
          x2={betaEnd}
          color="teal"
          label="Public beta"
        />
        <Chart.ReferenceBand
          x1={pricingStart}
          x2={pricingEnd}
          color="violet"
          label="Usage pricing"
        />
        <Chart.ReferenceBand
          x1={rolloutStart}
          x2={rolloutEnd}
          color="blue"
          label="Enterprise rollout"
        />

        <Chart.ReferenceLine y={100} label="Indexed baseline" />
        <Chart.ReferenceLine x={crosshairDate} label="Friday, Nov 1, 2024" />

        <Chart.Annotation
          x={crosshairDate}
          y={205}
          tone="violet"
          title="Pricing lift"
          value="+105 pts"
        />
        <Chart.Annotation
          x={new Date(Date.UTC(2025, 0, 31))}
          y={99}
          tone="red"
          title="Risk burn cooling"
          value="99 index"
          placement="right"
        />

        <Chart.DataLabels
          position="last"
          anchor="margin-left"
          render={({ color, value }) => (
            <span
              className="rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums dark:bg-neutral-400/15"
              style={{ color }}
            >
              {Math.round(value)}
            </span>
          )}
        />

        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
