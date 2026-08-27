import { SplitView } from "@cjlapao/ui-kit";

/**
 * The active row's fill, left border, label and subtitle all come from tokens
 * generated off `TRUE_COLORS`.
 *
 * The literal map this replaced pointed **both** `neutral` and `stone` at one
 * shared object, so `stone` silently rendered neutral — and because the
 * literals were also what Tailwind scanned, `border-l-stone-600` had never
 * been emitted at all.
 */
export default function Tones() {
  const items = [
    { id: "a", label: "Selected", subtitle: "the active row", panel: <div className="p-4 text-sm">Detail</div> },
    { id: "b", label: "Another", subtitle: "not selected", panel: <div className="p-4 text-sm">Detail</div> },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["stone", "neutral", "violet", "emerald"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">{color}</span>
          <div className="h-44 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
            <SplitView items={items} color={color} />
          </div>
        </div>
      ))}
    </div>
  );
}
