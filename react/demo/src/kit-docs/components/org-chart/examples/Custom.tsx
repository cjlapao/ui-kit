import { OrganizationChart, type OrgChartNode } from "@cjlapao/ui-kit";

const nodes: OrgChartNode[] = [
  {
    id: "founder",
    label: "Founder & CEO",
    description: "Amy Elsner",
    children: [
      {
        id: "product",
        label: "Product Lead",
        description: "Asiya Javayant",
        children: [
          { id: "ux", label: "UX Designer", description: "Anna Fali" },
          {
            id: "pm",
            label: "Product Manager",
            description: "Bernardo Dominic",
          },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        description: "Onyama Limba",
        children: [
          {
            id: "fe",
            label: "Frontend Engineer",
            description: "Elwin Sharvill",
          },
          { id: "be", label: "Backend Engineer", description: "Stephen Shaw" },
        ],
      },
    ],
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Custom() {
  return (
    <OrganizationChart
      nodes={nodes}
      ariaLabel="Company"
      renderNode={({ node }) => (
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
            {initials(node.description ?? node.label)}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
              {node.label}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {node.description}
            </span>
          </span>
        </div>
      )}
    />
  );
}
