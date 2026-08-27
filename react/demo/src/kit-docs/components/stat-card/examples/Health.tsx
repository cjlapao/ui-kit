import { StatHealthCard } from "@cjlapao/ui-kit";

/**
 * The ECG strip is no longer a prop on `StatCard`. `StatHealthCard` is that
 * same card with the monitor mounted as its body, so every StatCard prop —
 * variant, tone, size, corner, trend, icon — still applies.
 */
export const Health = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatHealthCard
      label="Service health"
      state="healthy"
      bpm={72}
      trend={{ value: "all systems", direction: "neutral" }}
    />
    <StatHealthCard label="Latency" state="warning" bpm={96} />
    <StatHealthCard label="Error budget" state="unhealthy" bpm={128} />
  </div>
);

export default Health;
