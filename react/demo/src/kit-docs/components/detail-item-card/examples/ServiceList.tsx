import { DetailItemCard, Panel, Pill } from "@cjlapao/ui-kit";

const ROWS = [
  {
    title: "orchestrator-api",
    subtitle: "Deployed 12 minutes ago",
    description: "Handles capsule lifecycle and scheduling.",
    icon: "Container",
  },
  {
    title: "reverse-proxy",
    subtitle: "Deployed 2 hours ago",
    description: "Terminates TLS and routes to each service.",
    icon: "ReverseProxy",
  },
  {
    title: "postgres",
    subtitle: "Deployed 3 days ago",
    description: "Primary datastore with nightly snapshots.",
    icon: "Database",
  },
];

const badges = (
  <>
    <Pill tone="emerald" size="xs">
      Healthy
    </Pill>
    <Pill tone="amber" size="xs">
      2 warnings
    </Pill>
  </>
);

export default function ServiceList() {
  return (
    <Panel variant="outlined" tone="neutral" padding="sm">
      <div className="divide-y divide-black/5 dark:divide-white/10">
        {ROWS.map((row, index) => (
          <div key={row.title} className="py-2 first:pt-0 last:pb-0">
            <DetailItemCard
              variant="plain"
              title={row.title}
              subtitle={row.subtitle}
              description={row.description}
              icon={row.icon}
              badges={badges}
              defaultExpanded={index === 0}
            >
              <p className="font-mono text-xs opacity-70">
                image: ghcr.io/acme/{row.title}:2.14.0
              </p>
            </DetailItemCard>
          </div>
        ))}
      </div>
    </Panel>
  );
}
