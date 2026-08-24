import { CONTROL_SIZES, StatusSpinner } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-end gap-5">
    {CONTROL_SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-2">
        <StatusSpinner size={size} tone="blue" />
        <span className="text-[11px] opacity-60">{size}</span>
      </div>
    ))}
  </div>
);

export default SizeLadder;
