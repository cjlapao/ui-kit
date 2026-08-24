import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function Glass() {
  return (
    <div className={GLASS_BACKDROP}>
      <div className="flex flex-col gap-4">
        <Tabs
          items={TRIO_ITEMS}
          variant="glass"
          color="blue"
          size="md"
          specularMode="classic"
        />
        <Tabs
          items={TRIO_ITEMS}
          variant="liquid-glass"
          color="indigo"
          size="md"
          specularMode="halo"
        />
      </div>
    </div>
  );
}
