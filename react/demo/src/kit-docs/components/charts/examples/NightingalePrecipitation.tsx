import { Chart } from "@cjlapao/ui-kit";
import { nightingalePrecip } from "../data";

const SEASONAL_HUES = [
  "#3b82f6", // Jan winter
  "#38bdf8", // Feb winter
  "#2dd4bf", // Mar spring
  "#2dd4bf", // Apr spring
  "#14b8a6", // May spring
  "#0ea5e9", // Jun summer
  "#0ea5e9", // Jul summer
  "#f59e0b", // Aug summer
  "#fb923c", // Sep fall
  "#f87171", // Oct fall
  "#f87171", // Nov fall
  "#3b82f6", // Dec winter
];

/** Season group arcs (inclusive slice indices, Jan-first ordering). */
const SEASON_BANDS = [
  { from: 10, to: 1, color: "#5daeea", label: "Winter" },
  { from: 2, to: 4, color: "#4ecdc4", label: "Spring" },
  { from: 5, to: 7, color: "#ffad5a", label: "Summer" },
  { from: 8, to: 9, color: "#ff7a66", label: "Fall" },
];

const ANNUAL_AVG =
  nightingalePrecip.reduce((a, m) => a + m.value, 0) /
  nightingalePrecip.length;

/**
 * US average monthly precipitation 2024. January anchors 12 o'clock,
 * per-slice ticks + four season group arcs outside the ring, the wettest
 * month marked PEAK inline, and a tooltip that shows the delta vs the
 * annual average.
 */
export function NightingalePrecipitation() {
  return (
    <Chart.Svg height={460} ariaLabel="US monthly precipitation 2024">
      <Chart.Title
        title="US average monthly precipitation 2024"
        subtitle="Source: NOAA Climate Data Online · 48 contiguous states average · 2024 data"
      />
      <Chart.Pie
        data={nightingalePrecip}
        name="Precipitation"
        categoryField="name"
        valueField="value"
        nightingale
        innerRadius={0.32}
        outerRadius={0.78}
        cornerRadius={5}
        startAngle={-Math.PI / 12}
        padAngle={0.026}
        colors={SEASONAL_HUES}
        nightingaleTicks
        nightingaleBands={SEASON_BANDS}
        peakLabel="PEAK"
      />
      <Chart.PieCenter
        title="Annual avg"
        value={`${ANNUAL_AVG.toFixed(2)}″`}
      />
      <Chart.Tooltip
        rows={(item) => {
          const row = nightingalePrecip[item.index ?? 0];
          const diff = row.value - ANNUAL_AVG;
          const up = diff >= 0;
          return [
            { label: "Precipitation", value: `${row.value.toFixed(2)}″` },
            {
              label: "vs Annual avg",
              value: `${up ? "▲" : "▼"} ${up ? "+" : ""}${diff.toFixed(2)}″`,
              color: up ? "#10a981" : "#e5484d",
            },
            { label: "Season", value: SEASON_BANDS.find((b) => {
              const idx = item.index ?? 0;
              return b.to >= b.from
                ? idx >= b.from && idx <= b.to
                : idx >= b.from || idx <= b.to;
            })?.label ?? "—" },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default NightingalePrecipitation;
