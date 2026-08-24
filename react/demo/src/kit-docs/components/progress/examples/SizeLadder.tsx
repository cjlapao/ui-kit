import { CONTROL_SIZES, Progress } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {CONTROL_SIZES.map((size) => (
      <Progress key={size} size={size} value={45} />
    ))}
  </div>
);

export default SizeLadder;
