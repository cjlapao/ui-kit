import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem, TabsSize } from "@cjlapao/ui-kit";

const SIZES: TabsSize[] = ["sm", "md", "lg"];

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

export default function SizeLadder() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {SIZES.map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Tabs
            items={TRIO_ITEMS}
            variant="underline"
            color="blue"
            size={each}
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
