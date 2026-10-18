import { TagPicker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
];

/**
 * Every `InputVariant` the other fields offer. The trigger painted a hardcoded
 * `bg-white dark:bg-neutral-900` before, so none of these were reachable.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <TagPicker
            items={ITEMS}
            value={["prod"]}
            onChange={() => {}}
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}
