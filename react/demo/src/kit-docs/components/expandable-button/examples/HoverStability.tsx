import { ExpandableButton } from "@cjlapao/ui-kit";

/** Expansion wraps the button, giving the pointer a 500ms window to follow it. */
export default function HoverStability() {
  return (
    <div className="space-y-3">
      <p className="text-sm opacity-70">
        Hover over Follow me, then move down with the button when it wraps.
        It stays open for 500 ms after the pointer leaves. The invisible
        rectangular hover area includes the rounded corners.
      </p>
      <div className="flex w-64 flex-wrap items-center justify-end gap-3 rounded-xl border border-neutral-300 p-3 dark:border-neutral-700">
        <span className="w-40 text-sm">Limited toolbar space</span>
        <ExpandableButton
          icon="ArrowRight"
          label="Follow me"
          srLabel="Follow me"
          variant="soft"
          collapseDelay={500}
        />
      </div>
    </div>
  );
}
