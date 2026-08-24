import { CustomIcon, TimelinePanel } from "@cjlapao/ui-kit";
import type { TimelinePanelItem } from "@cjlapao/ui-kit";

const items: TimelinePanelItem[] = [
  {
    id: "snap-1",
    icon: <CustomIcon icon="Save" customSize={16} />,
    iconBackground: true,
    title: "Initial snapshot",
    subtitle: "2 days ago · 128 MB",
    isRoot: true,
  },
  {
    id: "current",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    title: "Live environment",
    subtitle: "Running · v2.4.1",
    isCurrent: true,
  },
];

export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <TimelinePanel
        title="Empty"
        items={[]}
        tone="blue"
        emptyState="No snapshots yet — create one."
      />
      <TimelinePanel
        title="Skeleton"
        items={items}
        tone="blue"
        loading
        loaderType="skeleton"
        skeletonRows={3}
      />
      <TimelinePanel
        title="Refreshing"
        items={items}
        tone="blue"
        loading
        loaderType="spinner"
        loaderProps={{ title: "Syncing…" }}
      />
    </div>
  );
}
