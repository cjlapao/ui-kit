import { SHIMMER_TONES, Shimmer } from "@cjlapao/ui-kit";

/**
 * The full 21-tone scale. Each label sweeps in its own tone — the highlight
 * is derived from the same color, so a violet shimmer highlights violet.
 * The first row inherits the surrounding text color instead.
 */
const EveryTone = () => (
  <div className="flex flex-col items-center gap-4">
    <Shimmer className="text-sm italic">
      inherit (surrounding text color)
    </Shimmer>
    <div className="flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
      {SHIMMER_TONES.map((tone) => (
        <Shimmer key={tone} tone={tone}>
          {tone}
        </Shimmer>
      ))}
    </div>
  </div>
);

export default EveryTone;
