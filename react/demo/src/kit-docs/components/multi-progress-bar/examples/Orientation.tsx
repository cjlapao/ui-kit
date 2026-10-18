import { MultiProgressBar } from "@cjlapao/ui-kit";

const SERIES = [
  { key: "a", label: "Running", value: 12 },
  { key: "b", label: "Paused", value: 5 },
  { key: "c", label: "Failed", value: 3 },
];

/**
 * Horizontal or vertical, with the legend before or after the bar. A vertical
 * bar puts its legend to the side; `height` sets the track length and
 * `barSize` its thickness.
 *
 * These came from `MeterGroup`, which this component absorbed.
 */
export default function Orientation() {
  return (
    <div className="flex w-full flex-wrap items-start gap-10">
      <div className="w-64">
        <MultiProgressBar label="Horizontal" max={20} series={SERIES} showPercent />
      </div>
      <div className="w-64">
        <MultiProgressBar
          label="Legend first"
          max={20}
          series={SERIES}
          labelPosition="start"
        />
      </div>
      <MultiProgressBar
        label="Vertical"
        max={20}
        series={SERIES}
        orientation="vertical"
        height={160}
        barSize={14}
        labelOrientation="vertical"
        showPercent
      />
    </div>
  );
}
