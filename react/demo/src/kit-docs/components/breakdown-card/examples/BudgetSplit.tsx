import { BreakdownCard, type BreakdownItem } from "@cjlapao/ui-kit";

const items: BreakdownItem[] = [
  { id: "compute", label: "Compute", value: 42_800, displayValue: "$42.8k", tone: "blue" },
  { id: "storage", label: "Storage", value: 18_400, displayValue: "$18.4k", tone: "sky" },
  { id: "network", label: "Network", value: 9_100, displayValue: "$9.1k", tone: "teal" },
  { id: "support", label: "Support", value: 4_600, displayValue: "$4.6k", tone: "cyan" },
  { id: "other", label: "Other", value: 2_100, displayValue: "$2.1k", tone: "slate" },
];

/**
 * A quarter of cloud spend, sliced by what it bought: the donut for the
 * shape of it, the rows for the detail, the strip for the totals that
 * outlive the filter.
 */
export default function BudgetSplit() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <BreakdownCard
        title="Cloud spend by service"
        caption="Q3 — all regions"
        items={items}
        stats={[
          { label: "Total", value: "$77.0k" },
          { label: "Budget", value: "$80.0k" },
          { label: "Trend", value: "+6.2%" },
        ]}
        ctaLabel="Open cost explorer"
      />
    </div>
  );
}
