import type { ReactNode } from "react";
import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[10px] uppercase tracking-wide opacity-60">{children}</span>
);

export default function Orientation() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-1.5">
        <Tabs
          items={TRIO_ITEMS}
          variant="soft"
          color="blue"
          size="sm"
          orientation="horizontal"
        />
        <Caption>horizontal</Caption>
      </div>
      <div className="flex flex-col gap-1.5">
        <Tabs
          items={TRIO_ITEMS}
          variant="soft"
          color="blue"
          size="sm"
          orientation="vertical"
        />
        <Caption>vertical</Caption>
      </div>
    </div>
  );
}
