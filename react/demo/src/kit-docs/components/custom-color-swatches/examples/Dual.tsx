import { useState } from "react";
import {
  CustomColorSwatches,
  type SwatchDualValue,
} from "@cjlapao/ui-kit";

/**
 * Dual colour: each swatch is a pill painted with its colour, labelled with
 * the hex — in an ink the kit picks for contrast — that slides out as the
 * pill expands under the pointer or when selected. Clicking the selected pill
 * opens the popover where the ink can be overridden by tone or by a colour of
 * its own; `Auto` hands it back to the kit.
 */
export default function Dual() {
  const [selected, setSelected] = useState<SwatchDualValue | null>(null);
  return (
    <div className="flex w-full flex-col gap-3">
      <CustomColorSwatches
        mode="dual"
        value={selected}
        onChange={(v) => setSelected(v && "border" in v ? v : null)}
      />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {selected ? (
          <>
            Border <code className="font-mono">{selected.border.hex}</code>{" "}
            · text{" "}
            {selected.text.mode === "auto" ? (
              <>
                <code>auto</code> — the kit picked the ink
              </>
            ) : (
              <>
                overridden with <code className="font-mono">{selected.text.hex}</code>
              </>
            )}
          </>
        ) : (
          "Pick a pill, then click it again to override the text colour."
        )}
      </p>
    </div>
  );
}
