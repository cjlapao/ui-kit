import { BreakdownCard } from "@cjlapao/ui-kit";

/**
 * Marketing leads by source — where `displayValue` earns its keep: the
 * values feed the donut, the formatted strings feed the rows.
 */
export default function LeadsBySource() {
  return (
    <div className="mx-auto w-full max-w-md">
      <BreakdownCard
        title="Leads by source"
        caption="rolling 30 days"
        items={[
          { id: "organic", label: "Organic search", value: 1240, tone: "emerald" },
          { id: "referral", label: "Referrals", value: 731, tone: "lime" },
          { id: "social", label: "Social", value: 402, displayValue: "402 ✨", tone: "violet" },
          { id: "paid", label: "Paid", value: 265, tone: "amber" },
        ]}
        stats={[{ label: "Best week", value: "Aug 12" }]}
      />
    </div>
  );
}
