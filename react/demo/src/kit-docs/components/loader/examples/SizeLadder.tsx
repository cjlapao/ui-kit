import { CONTROL_SIZES, Loader } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-end gap-6">
    {CONTROL_SIZES.map((size) => (
      <Loader key={size} size={size} label={size} />
    ))}
  </div>
);

export default SizeLadder;
