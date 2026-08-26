import { Chart } from "@cjlapao/ui-kit";
import { comboMonthly, comboOrdersAvg } from "../data";

/**
 * Fulfilled orders with the 3-month moving average on top. Hovering one
 * series dims the other; the line's soft area fill keeps it secondary.
 */
export function ComboOrders() {
  const k = (v: number) => `${(v / 1000).toFixed(1)}K`;
  return (
    <Chart.Svg height={440} ariaLabel="Fulfilled orders with 3-month average">
      <Chart.Title
        title="Fulfilled orders"
        subtitle="Monthly volume with a trailing 3-month moving average"
      />
      <Chart.Bar
        data={comboMonthly}
        name="Fulfilled orders"
        categoryXField="month"
        valueYField="orders"
        cornerRadius={3}
      />
      <Chart.Line
        data={comboOrdersAvg}
        name="3-month avg"
        categoryXField="month"
        valueYField="value"
        color="orange"
        curve="smooth"
        fillOpacity={0.16}
        showMarkers
        lineStrokeWidth={2.5}
      />
      <Chart.XAxis />
      <Chart.YAxis tickCount={8} format={k} />
      <Chart.Legend />
      <Chart.Tooltip itemFormat={(v) => `${k(v)} orders`} />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboOrders;
