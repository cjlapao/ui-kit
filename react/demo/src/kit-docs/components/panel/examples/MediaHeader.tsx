import { Panel } from "@cjlapao/ui-kit";

export default function MediaHeader() {
  return (
    <Panel
      variant="elevated"
      corner="rounded-lg"
      badge="New"
      title="Quarterly report"
      subtitle="March – May"
      description="Revenue is up 12% against the plan, led by the API tier."
      media={
        <div className="h-32 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400" />
      }
      actions={[
        { label: "Open report", variant: "solid", color: "blue", size: "sm" },
        { label: "Export", variant: "outline", color: "neutral", size: "sm" },
      ]}
    >
      The numbers behind the chart: three months of steady growth, with the
      steepest climb in May.
    </Panel>
  );
}
