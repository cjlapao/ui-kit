import {
  StatCard,
  StatChartTile,
  StatCountTile,
  StatGoalTile,
  StatGraphTile,
  StatHealthCard,
} from "@cjlapao/ui-kit";

/**
 * The whole family, driven by the same base props.
 *
 * Every one of these inherits `StatCardProps`, so `variant`, `tone`, `size`,
 * `padding`, `corner`, `decoration`, `trend`, `loaderType` and the rest mean
 * the same thing on all of them. Each adds one thing: a breakdown, rings, a
 * donut, a chart, an ECG trace.
 *
 * `StatTile` is not shown because it is `StatCard` under the older prop names
 * and renders identically.
 */
const shared = { variant: "elevated", size: "md", corner: "rounded-lg" } as const;

export default function Family() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <StatCard
        {...shared}
        label="Active capsules"
        value={128}
        icon="Rocket"
        tone="blue"
        trend={{ value: "+12%", direction: "up" }}
      />
      <StatCountTile
        {...shared}
        label="Total"
        value={412}
        tone="violet"
        icon="Database"
        breakdown={[
          { label: "Running", value: 128, color: "emerald" },
          { label: "Stopped", value: 284, color: "rose" },
        ]}
      />
      <StatGoalTile
        {...shared}
        label="Goals"
        tone="emerald"
        goals={[
          { value: 72, label: "Uptime", icon: "HealthCheck" },
          { value: 45, label: "Coverage", icon: "Check" },
        ]}
      />
      <StatChartTile
        {...shared}
        label="Distribution"
        tone="amber"
        data={[
          {
            id: 1,
            label: "By state",
            centerLabel: "capsules",
            items: [
              { label: "Running", value: 12 },
              { label: "Paused", value: 5 },
              { label: "Failed", value: 3 },
            ],
          },
        ]}
      />
      <StatGraphTile
        {...shared}
        label="Throughput"
        value="66/s"
        tone="cyan"
        chartType="bar"
        series={[{ key: "requests", label: "Requests" }]}
        data={[
          { name: "Mon", requests: 42 },
          { name: "Tue", requests: 58 },
          { name: "Wed", requests: 51 },
          { name: "Thu", requests: 73 },
          { name: "Fri", requests: 66 },
        ]}
      />
      <StatHealthCard
        {...shared}
        label="Service health"
        value="99.98%"
        tone="rose"
        icon="HealthCheck"
        state="healthy"
        bpm={72}
      />
    </div>
  );
}
