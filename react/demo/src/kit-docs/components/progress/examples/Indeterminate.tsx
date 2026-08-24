import { CONTROL_SIZES, Progress } from "@cjlapao/ui-kit";

const Indeterminate = () => (
  <div className="flex w-full max-w-md flex-col gap-4">
    {CONTROL_SIZES.map((size) => (
      <Progress
        key={size}
        size={size}
        indeterminate
        label={`Size ${size}`}
        showValue
      />
    ))}
  </div>
);

export default Indeterminate;
