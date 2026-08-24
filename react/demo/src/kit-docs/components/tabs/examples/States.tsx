import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const STATE_ITEMS: TabItem[] = [
  {
    id: "a",
    label: "Deploy",
    icon: "Run",
    description: "Active rings",
    badge: "Live",
    actions: [
      { id: "create", icon: "Add", label: "Create release", active: true },
      { id: "sync", icon: "Reset", label: "Sync status" },
    ],
  },
  { id: "b", label: "Analytics", icon: "ViewGrid", description: "Usage" },
  { id: "c", label: "Locked", icon: "Key", disabled: true, badge: "3" },
];

export default function States() {
  return (
    <Tabs items={STATE_ITEMS} variant="soft" color="blue" size="md" />
  );
}
