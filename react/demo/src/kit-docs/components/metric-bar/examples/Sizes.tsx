import { CONTROL_SIZES, MetricBar } from "@cjlapao/ui-kit";

/** The full shared control scale. It used to be pinned to `sm`. */
export default function Sizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {CONTROL_SIZES.map((size) => (
        <MetricBar key={size} label={size} value="12 / 20 GB" percentage={60} size={size} />
      ))}
    </div>
  );
}
