import { useState } from "react";
import { ColorSwatches, type TrueColor } from "@cjlapao/ui-kit";

/**
 * The strip as a tone picker: `selectable` turns the dots into buttons, the
 * chosen one carries a ring, and `onSelect` reports the tone — a picker that
 * shows the palette instead of hiding it behind a dropdown.
 */
export default function Selectable() {
  const [tone, setTone] = useState<TrueColor>("blue");
  return (
    <div className="flex w-full flex-col gap-3">
      <ColorSwatches selectable value={tone} onSelect={setTone} />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Selected: <code className="font-mono">{tone}</code>
      </p>
    </div>
  );
}
