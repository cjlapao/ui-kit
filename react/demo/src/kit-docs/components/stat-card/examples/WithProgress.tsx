import { StatCard } from "@cjlapao/ui-kit";

export const WithProgress = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard
      gradient
      tone="emerald"
      progress
      label="Game completed"
      value="100%"
    />
    <StatCard
      gradient
      tone="violet"
      progress={72}
      label="Build pipeline"
      value="3/4"
    />
    <StatCard
      tone="blue"
      progress
      label="Syncing"
      value="2,481"
    />
  </div>
);

export default WithProgress;
