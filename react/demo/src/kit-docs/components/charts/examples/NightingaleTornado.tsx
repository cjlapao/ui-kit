import { Chart } from "@cjlapao/ui-kit";
import { nightingaleTornado } from "../data";

const SEASON_COLORS = [
  "#60a5fa", // Jan quiet
  "#60a5fa", // Feb quiet
  "#f59e0b", // Mar shoulder
  "#f43f5e", // Apr peak
  "#f43f5e", // May peak
  "#f43f5e", // Jun peak
  "#f59e0b", // Jul shoulder
  "#f59e0b", // Aug shoulder
  "#f59e0b", // Mar/Aug shoulder
  "#60a5fa", // Oct quiet
  "#60a5fa", // Nov quiet
  "#60a5fa", // Dec quiet
];

/**
 * US tornado climatology (1991–2020 average by month). Nightingale mode:
 * every month gets an equal 30° wedge whose radius encodes the count — the
 * Apr–Jun peak bulges, quiet months hug the hub. Outside labels carry the
 * month name + average count.
 */
export function NightingaleTornado() {
  return (
    <Chart.Svg height={420} ariaLabel="US tornado climatology by month">
      <Chart.Title
        title="US tornado climatology — average by month"
        subtitle="Source: NOAA Storm Prediction Center · 1991–2020 climatological average · Red: peak season (Apr–Jun) · Amber: active shoulder (Mar, Jul–Aug)"
      />
      <Chart.Pie
        data={nightingaleTornado}
        name="Tornadoes"
        categoryField="name"
        valueField="value"
        nightingale
        innerRadius={0.18}
        outerRadius={0.8}
        startAngle={-Math.PI / 12}
        padAngle={0.02}
        colors={SEASON_COLORS}
      />
    </Chart.Svg>
  );
}

export default NightingaleTornado;
