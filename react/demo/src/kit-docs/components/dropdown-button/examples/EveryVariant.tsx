import { BUTTON_VARIANTS, DropdownButton } from "@cjlapao/ui-kit";
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
  {
    label: "Advanced…",
    value: "advanced",
    description: "Pick a specific version or channel",
  },
];

const EveryVariant = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2">
    {BUTTON_VARIANTS.map((variant) => (
      <DropdownButton
        key={variant}
        label={variant}
        options={OPTIONS}
        variant={variant}
      />
    ))}
  </div>
);

export default EveryVariant;
