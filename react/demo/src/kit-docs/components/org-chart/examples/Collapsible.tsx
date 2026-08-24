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

export default function Collapsible() {
  return (
    <div className="flex w-full flex-col gap-3">
      <OrganizationChart
        nodes={nodes}
        defaultExpandedIds={["founder"]}
        ariaLabel="Company"
      />
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Collapse a branch to see how many children the toggle is hiding.
      </p>
    </div>
  );
}
