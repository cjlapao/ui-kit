import { useState } from "react";
import { CustomColorSwatches, type SwatchColor } from "@cjlapao/ui-kit";

/**
 * Single colour: dots for the palette tones plus a rainbow `+` that opens the
 * OS picker. Whatever lands — tone or custom hex — is what `onChange` reports,
 * and the chosen dot wears the ring. The pick is revocable: clicking the
 * chosen dot again — or pressing anywhere off the row — reports `null`.
 */
export default function Single() {
  const [selected, setSelected] = useState<SwatchColor | null>(null);
  return (
    <div className="flex w-full flex-col gap-3">
      <CustomColorSwatches
        value={selected}
        onChange={(v) => setSelected(v && "tone" in v ? v : null)}
      />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {selected
          ? (
            <>
              Selected: <code className="font-mono">{selected.hex}</code>
              {selected.tone !== "custom" && (
                <>
                  {" "}
                  (<code>{selected.tone}</code>)
                </>
              )}
            </>
          )
          : "Nothing chosen yet — pick a dot or the rainbow."}
      </p>
    </div>
  );
}
