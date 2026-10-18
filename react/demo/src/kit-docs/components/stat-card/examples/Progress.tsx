import { StatCard } from "@cjlapao/ui-kit";

/**
 * One `progress` feature, two renderings.
 *
 * `spinner` pins a `ProgressSpinner` to the bottom-right corner; `bar` puts a
 * labelled `Progress` across the full width at the bottom. Both accept a
 * number or `true` for indeterminate.
 *
 * `syncValueToProgress` drives the bar from the card's own `value`, so a
 * percentage metric is written once instead of twice — and a non-numeric value
 * is ignored, falling back to whatever `progress` was given.
 */
export default function Progress() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Spinner" value="72%" icon="HealthCheck" progress={72} />
      <StatCard label="Bar" value="72%" icon="Database" progress={72} progressType="bar" />
      <StatCard
        label="Synced to value"
        value={72}
        icon="Database"
        progressType="bar"
        syncValueToProgress
        progressLabel="of quota"
      />
      <StatCard label="Indeterminate" value="—" icon="HealthCheck" progress />
    </div>
  );
}
