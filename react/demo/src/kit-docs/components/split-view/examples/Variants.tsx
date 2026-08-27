import { SplitView, SPLIT_VIEW_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", label: "api-gateway", subtitle: "eu-west-1", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Gateway detail</div> },
  { id: "b", label: "worker-pool", subtitle: "us-east-1", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Worker detail</div> },
];

/**
 * The surface family, shared with `Panel`.
 *
 * The list pane is differentiated by a *translucent tint* rather than a fill,
 * so it composites over whatever the variant paints — a glass SplitView keeps
 * its backdrop on both halves. It used to be a hardcoded
 * `bg-gray-50/80 dark:bg-gray-900/80` list beside a `bg-white` detail pane, the
 * latter with no dark-mode partner at all.
 *
 * The built-in search follows the surface: glass on glass, ghost on subtle,
 * elevated on elevated. `searchVariant` overrides it.
 *
 * `tone` is the *accent* — the active row, the resizer, the search field.
 * `surfaceTone` tints the panes and stays `neutral` unless you ask, because an
 * accent that matches its own background has nothing to stand out against.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {SPLIT_VIEW_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <div className="h-56 overflow-hidden rounded-lg">
            <SplitView items={ITEMS} variant={variant} tone="blue" listTitle="Capsules" />
          </div>
        </div>
      ))}
    </div>
  );
}
