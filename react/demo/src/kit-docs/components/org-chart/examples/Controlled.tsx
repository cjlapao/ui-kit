import { useState } from "react";
import { Button, OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

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

const collectExpandable = (list: OrgChartNode[]): string[] => {
  const ids: string[] = [];
  for (const node of list) {
    if (node.children?.length) {
      ids.push(node.id);
      ids.push(...collectExpandable(node.children));
    }
  }
  return ids;
};

export default function Controlled() {
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    collectExpandable(nodes),
  );

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIds(collectExpandable(nodes))}
        >
          Expand all
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setExpandedIds([])}
        >
          Collapse all
        </Button>
      </div>
      <OrganizationChart
        nodes={nodes}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        ariaLabel="Company"
      />
    </div>
  );
}
