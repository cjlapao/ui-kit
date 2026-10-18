import { ColorSwatches } from "@cjlapao/ui-kit";

/**
 * Twenty-one tones in four dots' worth of room: condensed into an
 * overlapping stack with the rest behind a `+17`. Click it — the strip
 * keeps its width and grows downward, dots popping in left to right.
 */
export default function Condensed() {
  return (
    <div className="w-full max-w-52 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <ColorSwatches size="lg" maxVisible={4} />
    </div>
  );
}
