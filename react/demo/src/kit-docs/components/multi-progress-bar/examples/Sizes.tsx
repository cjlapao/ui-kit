import { CONTROL_SIZES, MultiProgressBar } from "@cjlapao/ui-kit";

/** The full shared control scale — the bar had no size prop at all before. */
export default function Sizes() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      {CONTROL_SIZES.map((size) => (
        <MultiProgressBar
          key={size}
          label={size}
          total={10}
          size={size}
          hideLegend
          series={[
            { key: "a", label: "A", value: 5 },
            { key: "b", label: "B", value: 3 },
            { key: "c", label: "C", value: 2 },
          ]}
        />
      ))}
    </div>
  );
}
