import { CollapsibleHelpText } from "@cjlapao/ui-kit";
import type { CollapsibleHelpTextVariant } from "@cjlapao/ui-kit";

const VARIANTS: CollapsibleHelpTextVariant[] = [
  "card",
  "elevated",
  "outlined",
  "subtle",
  "tonal",
  "default",
  "glass",
  "liquid-glass",
  "simple",
  "plain",
];

const COPY =
  "We encrypt your API tokens client-side using the session keys you configure here. Keys never leave your browser in clear text.";

export default function Surfaces() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            {variant}
          </span>
          <CollapsibleHelpText
            text={COPY}
            tone="emerald"
            variant={variant}
            padding="sm"
          />
        </div>
      ))}
    </div>
  );
}
