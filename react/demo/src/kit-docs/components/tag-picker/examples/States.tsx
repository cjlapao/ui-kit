import { TagPicker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
];

/**
 * `loading` disables the trigger as well as showing the spinner: there is
 * nothing to pick yet, and opening onto an empty list reads as "no results"
 * rather than "not ready". It takes a wait cursor rather than the disabled
 * dim, because the spinner already says why the control is inert.
 *
 * `readOnly` dims instead of repainting the surface — a neutral fill here was
 * a same-specificity fight with the variant's own, and turned a glass or
 * underline trigger into an opaque grey slab.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Loading (trigger disabled)</span>
        <TagPicker items={[]} value={[]} onChange={() => {}} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Disabled</span>
        <TagPicker items={ITEMS} value={["prod"]} onChange={() => {}} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Read-only</span>
        <TagPicker items={ITEMS} value={["prod", "gpu"]} onChange={() => {}} readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Error</span>
        <TagPicker items={ITEMS} value={[]} onChange={() => {}} validationStatus="error" />
      </div>
    </div>
  );
}
