import { Chart } from "@cjlapao/ui-kit";
import { comboAds } from "../data";

/**
 * Ad spend vs new customers — a scatter on numeric axes with a dashed
 * two-point reference line as the regression fit.
 */
export function ComboRegression() {
  const $ = (v: number) => `$${(v / 1000).toFixed(1)}K`;
  return (
    <Chart.Svg height={440} ariaLabel="Ad spend versus new customers with regression">
      <Chart.Title
        title="Monthly campaigns — spend vs new customers"
        subtitle="Each point is a month; the dashed line is the linear regression fit"
      />
      <Chart.Scatter
        data={comboAds}
        name="Monthly campaigns"
        xField="spend"
        yField="customers"
        minSize={7}
      />
      <Chart.ReferenceLine
        x={8500}
        y={130}
        x2={42500}
        y2={625}
        color="#94a3b8"
        dash={[6, 4]}
      />
      <Chart.XAxis
        label="Ad spend ($K)"
        tickCount={9}
        format={(t) => $(Number(t))}
      />
      <Chart.YAxis label="New customers" tickCount={8} />
      <Chart.Legend />
      <Chart.Tooltip
        rows={(item) => {
          const row = item.item as { spend?: number } | null;
          return [
            { label: "Ad spend", value: `$${(((row?.spend ?? 0) / 1000).toFixed(1))}K` },
            { label: "New customers", value: `${item.value}` },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboRegression;
