import { SHIMMER_SPEEDS, Shimmer } from "@cjlapao/ui-kit";

/**
 * The three sweep periods side by side — slow 3.2s, normal 2s, fast 1.2s —
 * so the pace difference reads at a glance.
 */
const Speeds = () => (
  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
    {SHIMMER_SPEEDS.map((speed) => (
      <Shimmer key={speed} speed={speed} className="text-lg font-medium">
        {speed}
      </Shimmer>
    ))}
  </div>
);

export default Speeds;
