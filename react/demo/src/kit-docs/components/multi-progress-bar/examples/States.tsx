import { MultiProgressBar } from "@cjlapao/ui-kit";

const SERIES = [
  { key: "a", label: "Running", value: 12 },
  { key: "b", label: "Failed", value: 3 },
];

/**
 * Loading, error and empty — all three came from `MeterGroup`. The skeleton is
 * shaped like the bar and its legend, so the block does not change height when
 * the data lands.
 */
export default function States() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <MultiProgressBar label="Loading" max={20} series={SERIES} loading />
      <MultiProgressBar
        label="Failed"
        max={20}
        series={SERIES}
        error="Could not reach the registry"
      />
      <MultiProgressBar label="Empty" max={20} series={[]} />
    </div>
  );
}
