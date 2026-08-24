import { CONTROL_SIZES, DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-center gap-3">
    {CONTROL_SIZES.map((size) => (
      <DropdownButton
        key={size}
        label={size}
        options={OPTIONS}
        variant="solid"
        size={size}
      />
    ))}
  </div>
);

export default SizeLadder;
