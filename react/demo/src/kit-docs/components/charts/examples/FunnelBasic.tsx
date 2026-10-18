import { Chart } from "@cjlapao/ui-kit";
import { funnelMarketing } from "../data";

const si = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : String(v);

/**
 * Single-color funnel — one `color` paints every stage; the connectors and
 * the bottom arrow are auto-derived darker versions of it.
 */
export function FunnelBasic() {
  return (
    <Chart.Svg height={420} ariaLabel="Single-color funnel">
      <Chart.Title
        title="Support pipeline"
        subtitle="One series color — darker connectors and arrow are derived automatically."
      />
      <Chart.Funnel
        data={funnelMarketing.slice(0, 5)}
        name="Support pipeline"
        color="#2f6fd0"
        valueFormat={si}
      />
      <Chart.Tooltip mode="shared" />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default FunnelBasic;
