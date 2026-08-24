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
    actions: [
      { label: "Revert", variant: "outline", color: "blue", size: "sm" },
      {
        label: "Delete",
        variant: "ghost",
        color: "rose",
        size: "sm",
        disabled: true,
      },
    ],
    overflowActions: [
      { label: "Export", value: "export" },
      { label: "Rename", value: "rename" },
      { label: "Delete…", value: "delete", danger: true },
    ],
  },
  {
    id: "snap-2",
    icon: <CustomIcon icon="Image" customSize={16} />,
    iconBackground: true,
    title: "Post-migration",
    subtitle: "28 hours ago · 134 MB",
    depth: 1,
  },
  {
    id: "snap-3",
    icon: <CustomIcon icon="Docker" customSize={16} />,
    iconBackground: true,
    title: "Container baseline",
    subtitle: "27 hours ago · 96 MB",
    depth: 2,
    actions: [
      { label: "Restore", variant: "outline", color: "blue", size: "sm" },
    ],
  },
  {
    id: "current",
    icon: <CustomIcon icon="Rocket" customSize={16} />,
    title: "Live environment",
    subtitle: "Running · v2.4.1",
    isCurrent: true,
    actions: [
      { label: "Snapshot", variant: "solid", color: "blue", size: "sm" },
    ],
  },
];

export default function Snapshots() {
  return (
    <div className="w-full">
      <TimelinePanel
        title="Snapshots"
        headerAction={{
          label: "New Snapshot",
          variant: "solid",
          color: "blue",
          size: "sm",
          leadingIcon: <CustomIcon icon="Save" customSize={14} />,
        }}
        items={items}
        tone="blue"
        variant="elevated"
      />
    </div>
  );
}
