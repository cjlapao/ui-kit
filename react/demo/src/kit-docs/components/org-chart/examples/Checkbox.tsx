import { useState } from "react";
import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        icon: "Users",
        children: [
          { id: "ux", label: "UX/UI Designer", icon: "Image" },
          { id: "pm", label: "Product Manager", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        icon: "Users",
        children: [
          { id: "frontend", label: "Frontend Developer", icon: "Script" },
          { id: "backend", label: "Backend Developer", icon: "Log" },
        ],
      },
    ],
  },
];

export default function Checkbox() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["ux"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <OrganizationChart
        nodes={nodes}
        selectionMode="checkbox"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        ariaLabel="Company"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Checked{" "}
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          {selectedIds.length}
        </span>{" "}
        node{selectedIds.length === 1 ? "" : "s"} — checking a lead cascades to
        the whole branch, and ancestors show the partial state.
      </p>
    </div>
  );
}
