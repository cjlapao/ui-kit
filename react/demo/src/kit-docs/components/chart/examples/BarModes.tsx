import { useState } from "react";
import { Chart, MultiToggle } from "@cjlapao/ui-kit";
import {
  escalationDeskLevel,
  supportDays,
  supportPeakDay,
  supportPeakTotal,
} from "../data";

type Mode = "stack" | "group" | "percent";

/**
 * Daily support load stacked by work type (the PrimeUI stacked-bar
 * reference): rounded segment pills, the dashed escalation-desk level and
 * the "Peak 24" callout.
 */
export default function BarModes() {
  const [mode, setMode] = useState<Mode>("stack");
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-4">
      <MultiToggle
        size="sm"
        options={[
          { label: "Stacked", value: "stack" },
          { label: "Grouped", value: "group" },
          { label: "Percent", value: "percent" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      <Chart.Svg height={380}>
        <Chart.Title
          title="Daily support load"
          subtitle="Stacked by work type, with self-serve deflection visible beside critical and migration pressure"
        />
        <Chart.Legend />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="critical"
          name="Critical"
          mode={mode}
          stackId="load"
          color="#f87171"
          cornerRadius={999}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="migration"
          name="Migration"
          mode={mode}
          stackId="load"
          color="#8b5cf6"
          cornerRadius={999}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="product"
          name="Product"
          mode={mode}
          stackId="load"
          color="#38bdf8"
          cornerRadius={999}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="onboarding"
          name="Onboarding"
          mode={mode}
          stackId="load"
          color="#fbbf24"
          cornerRadius={999}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="deflected"
          name="Deflected"
          mode={mode}
          stackId="load"
          color="#34d399"
          cornerRadius={999}
          segmentGap={3}
        />
        <Chart.XAxis tickCount={24} />
        <Chart.YAxis labels={false} />
        <Chart.ReferenceLine
          y={escalationDeskLevel}
          label="Escalation desk"
          labelPosition="start"
        />
        <Chart.Annotation
          x={supportPeakDay}
          y={supportPeakTotal}
          tone="#34d399"
          title="Peak 24"
          value={`${supportPeakTotal} cases`}
          placement="top"
        />
        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
