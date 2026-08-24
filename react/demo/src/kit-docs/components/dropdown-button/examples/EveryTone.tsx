import { DropdownButton, TRUE_COLORS } from "@cjlapao/ui-kit";
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

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((color) => (
      <DropdownButton
        key={color}
        label={color}
        options={OPTIONS}
        variant="solid"
        color={color}
      />
    ))}
  </div>
);

export default EveryTone;
