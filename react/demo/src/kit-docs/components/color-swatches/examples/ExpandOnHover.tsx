import { ColorSwatches } from "@cjlapao/ui-kit";

/**
 * `expandOn="hover"` for places with room to grow — the strip opens as the
 * pointer enters it and folds back when it leaves, so it stays a glanceable
 * colour ribbon until someone reaches for it. The chip still works, for
 * keyboards and touch.
 */
export default function ExpandOnHover() {
  return (
    <div className="mx-auto w-full max-w-xs rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
        Theme palette — hover me
      </div>
      <ColorSwatches size="lg" maxVisible={6} expandOn="hover" showNames />
    </div>
  );
}
