import { Tabs, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

export default function EveryTone() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {TRUE_COLORS.map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Tabs
            items={MINI_ITEMS}
            variant="underline"
            color={each}
            size="sm"
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
