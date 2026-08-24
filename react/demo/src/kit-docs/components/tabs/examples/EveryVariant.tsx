import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem, TabsVariant } from "@cjlapao/ui-kit";

const VARIANTS: TabsVariant[] = [
  "underline",
  "soft",
  "pill",
  "segmented",
  "minimal",
  "glass",
  "liquid-glass",
];

const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function EveryVariant() {
  return (
    <div className={GLASS_BACKDROP}>
      <div className="grid gap-4 md:grid-cols-2">
        {VARIANTS.map((each) => (
          <div key={each} className="flex flex-col gap-1.5">
            <span className="text-xs opacity-60">{each}</span>
            <Tabs items={MINI_ITEMS} variant={each} color="blue" size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
