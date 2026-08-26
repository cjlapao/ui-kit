import { Chart } from "@cjlapao/ui-kit";
import { nightingalePrecip } from "../data";

const SEASONAL_HUES = [
  "#3b82f6", // Jan
  "#38bdf8", // Feb
  "#2dd4bf", // Mar
  "#2dd4bf", // Apr
  "#14b8a6", // May
  "#0ea5e9", // Jun
  "#0ea5e9", // Jul
  "#f59e0b", // Aug
  "#fb923c", // Sep
  "#f87171", // Oct
  "#f87171", // Nov
  "#3b82f6", // Dec
];

/**
 * US average monthly precipitation 2024. January anchors 12 o'clock
 * (startAngle −π/12), each petal's depth maps the month's inches, and the
 * peak month (May) is marked inline. Center shows the annual average.
 */
export function NightingalePrecipitation() {
  const avg =
    nightingalePrecip.reduce((a, m) => a + m.value, 0) /
    nightingalePrecip.length;
  const peak = nightingalePrecip.reduce(
    (a, m) => (m.value > a.value ? m : a),
    nightingalePrecip[0],
  );
  return (
    <Chart.Svg height={440} ariaLabel="US monthly precipitation 2024">
      <Chart.Title
        title="US average monthly precipitation 2024"
        subtitle={`Source: NOAA Climate Data Online · 48 contiguous states average · 2024 data · Peak: ${peak.name} (${peak.value}″)`}
      />
      <Chart.Pie
        data={nightingalePrecip}
        name="Precipitation"
        categoryField="name"
        valueField="value"
        nightingale
        innerRadius={0.3}
        startAngle={-Math.PI / 12}
        padAngle={0.015}
        colors={SEASONAL_HUES}
      />
      <Chart.PieCenter
        title="Annual avg"
        value={`${avg.toFixed(2)}″`}
      />
    </Chart.Svg>
  );
}

export default NightingalePrecipitation;
