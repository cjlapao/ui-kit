import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
import type { TimelinePanelItem } from "@cjlapao/ui-kit";

const items: TimelinePanelItem[] = [
  {
    id: "deploy-1",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    iconBackground: true,
    title: "Production deploy",
    subtitle: "1 day ago · build #482",
    actions: [
      { label: "Rollback", variant: "outline", color: "blue", size: "sm" },
      { label: "View Logs", variant: "ghost", color: "neutral", size: "sm" },
    ],
  },
  {
    id: "deploy-2",
    icon: <CustomIcon icon="Database" customSize={16} />,
    iconBackground: true,
    title: "Database migration",
    subtitle: "23 hours ago · schema v18",
    depth: 1,
  },
  {
    id: "current",
    icon: <CustomIcon icon="CheckCircle" customSize={16} />,
    title: "v2.4.0 — Live",
    subtitle: "All systems operational",
    isCurrent: true,
  },
];

export default function DeploymentHistory() {
  return (
    <div className="w-full">
      <TimelinePanel
        title="Deployment History"
        headerAction={
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
            Last 24 hours
          </span>
        }
        items={items}
        tone="blue"
        showTrunkDots
      />
    </div>
  );
}
