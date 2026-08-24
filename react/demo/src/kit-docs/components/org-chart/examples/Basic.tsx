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

export default function Basic() {
  return (
    <OrganizationChart
      nodes={nodes}
      collapsible={false}
      ariaLabel="Company"
    />
  );
}
