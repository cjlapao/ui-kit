import { StatCountTile, StatGoalTile, StatCard } from "@cjlapao/ui-kit";

/**
 * Loading, error and progress are the base card's, so they look and behave the
 * same on every member of the family — including the ones whose body is a
 * chart. The loader shapes the card and keeps the grid's layout; the error's
 * retry is a real `Button`, where it used to be a bare `<button
 * className="text-blue-600 …">` with a hardcoded blue and no dark-mode
 * partner; the bar is a real `Progress` with an accessible name, where it used
 * to be two nested divs with no role.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatGoalTile
        label="Loading"
        icon="Rocket"
        loading
        goals={[{ value: 72, label: "Uptime", icon: "HealthCheck" }]}
      />
      <StatCountTile
        label="Failed"
        size="md"
        value={0}
        icon="Rocket"
        error={{ message: "Registry unreachable", onRetry: () => {} }}
      />
      <StatCard
        label="Quota"
        value="64%"
        icon="Database"
        progress={64}
        progressType="bar"
        progressLabel="Used"
      />
    </div>
  );
}
