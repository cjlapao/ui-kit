import { Chart } from "@cjlapao/ui-kit";
import { comboCloud } from "../data";

/**
 * Cloud spend by service — three stacked bars per quarter with the quarterly
 * total drawn as a line overlay on top of the stack.
 */
export function ComboCloud() {
  const totals = comboCloud.map((r) => ({
    quarter: r.quarter,
    total: r.compute + r.storage + r.network,
  }));
  const k = (v: number) => `$${(v / 1000).toFixed(0)}K`;
  return (
    <Chart.Svg height={440} ariaLabel="Cloud spend by service with total">
      <Chart.Title
        title="Cloud spend by service"
        subtitle="Stacked services per quarter; the orange line tracks the quarterly total"
      />
      <Chart.Bar
        data={comboCloud}
        name="Compute"
        categoryXField="quarter"
        valueYField="compute"
        mode="stack"
        stackId="cloud"
      />
      <Chart.Bar
        data={comboCloud}
        name="Storage"
        categoryXField="quarter"
        valueYField="storage"
        mode="stack"
        stackId="cloud"
      />
      <Chart.Bar
        data={comboCloud}
        name="Network"
        categoryXField="quarter"
        valueYField="network"
        mode="stack"
        stackId="cloud"
        color="emerald"
      />
      <Chart.Line
        data={totals}
        name="Total"
        categoryXField="quarter"
        valueYField="total"
        color="orange"
        showMarkers
        lineStrokeWidth={2.5}
      />
      <Chart.XAxis />
      <Chart.YAxis tickCount={9} format={k} />
      <Chart.Legend />
      <Chart.Tooltip itemFormat={(v) => k(v)} />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboCloud;
