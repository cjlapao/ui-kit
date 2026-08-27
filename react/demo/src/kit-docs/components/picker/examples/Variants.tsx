import { Picker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [{ id: "a", title: "api-gateway", subtitle: "eu-west-1" }];

/**
 * Every `InputVariant` the other fields offer. The trigger used to paint a
 * hardcoded `bg-white dark:bg-neutral-900` with a `border-neutral-300`, so
 * none of these were reachable — a Picker could not be glass, ghost,
 * underlined, elevated or gradient while every sibling field could.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <Picker items={ITEMS} selectedId="a" variant={variant} />
        </div>
      ))}
    </div>
  );
}
