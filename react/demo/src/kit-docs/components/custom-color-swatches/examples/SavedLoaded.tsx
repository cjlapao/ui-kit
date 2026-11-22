import { useState } from "react";
import { CustomColorSwatches } from "@cjlapao/ui-kit";

/**
 * The user's own colours, kept: commits from the rainbow `+` pin themselves as
 * pills that survive other picks (and, with `storageKey`, survive a refresh —
 * check the row after reloading this page). Click a saved pill to select it,
 * click it again to re-edit its colour, × — or right-click — to forget it.
 * The three brand swatches are the consumer's `extraColors`: loaded into the
 * row, deduped against the palette, never persisted.
 */
export default function SavedLoaded() {
  const [savedCount, setSavedCount] = useState<number | null>(null);
  return (
    <div className="flex w-full flex-col gap-3">
      <CustomColorSwatches
        mode="dual"
        storageKey="demo-brand"
        extraColors={["#f97316", "#7c3aed", "#0d9488"]}
        onCustomColorsChange={(hexes) => setSavedCount(hexes.length)}
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {savedCount === null
          ? "No custom colours saved yet — open the rainbow pill and commit one."
          : `${savedCount} saved ${savedCount === 1 ? "colour" : "colours"} under ui-kit:swatches:demo-brand.`}
      </p>
    </div>
  );
}
