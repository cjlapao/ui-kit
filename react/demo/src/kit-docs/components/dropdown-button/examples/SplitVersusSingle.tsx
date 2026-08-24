import { DropdownButton } from "@cjlapao/ui-kit";
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

const SplitVersusSingle = () => (
  <div className="flex w-full max-w-xs flex-col gap-5">
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Split (default)
      </span>
      <DropdownButton label="Deploy" options={OPTIONS} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Single trigger
      </span>
      <DropdownButton label="Deploy" options={OPTIONS} split={false} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Empty menu
      </span>
      <DropdownButton label="Deploy" options={[]} />
    </div>
  </div>
);

export default SplitVersusSingle;
