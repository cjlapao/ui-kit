import { Chart } from "@cjlapao/ui-kit";
import { comboMonthly } from "../data";

/**
 * Revenue vs budget — bars with a dashed target line on the shared axis.
 * The combo pattern in its simplest form: two series, one scale.
 */
export function ComboRevenue() {
  const k = (v: number) => `$${(v / 1000).toFixed(0)}K`;
  return (
    <Chart.Svg height={440} ariaLabel="Revenue versus budget by month">
      <Chart.Title
        title="Monthly revenue against budget"
        subtitle="Bars are actual revenue; the dashed line is the committed budget path"
      />
      <Chart.Bar
        data={comboMonthly}
        name="Revenue"
        categoryXField="month"
        valueYField="revenue"
        cornerRadius={3}
      />
      <Chart.Line
        data={comboMonthly}
        name="Budget"
        categoryXField="month"
        valueYField="budget"
        lineStyle="dashed"
        showMarkers={false}
      />
      <Chart.XAxis />
      <Chart.YAxis tickCount={6} format={k} />
      <Chart.Legend />
      <Chart.Tooltip itemFormat={(v, name) => (name === "Budget" ? k(v) : k(v))} />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboRevenue;
