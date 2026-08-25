import { useState } from "react";
import { Chart, MultiToggle } from "@cjlapao/ui-kit";
import { barQuarterly } from "../data";

type Mode = "group" | "stack" | "percent";

/** Grouped / stacked / percent modes over the same quarterly P&L. */
export default function BarModes() {
  const [mode, setMode] = useState<Mode>("group");
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4">
      <MultiToggle
        size="sm"
        options={[
          { label: "Grouped", value: "group" },
          { label: "Stacked", value: "stack" },
          { label: "Percent", value: "percent" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      <Chart.Svg height={340}>
        <Chart.Title
          title="Quarterly P&L"
          subtitle={mode === "percent" ? "Share of revenue" : "In $k"}
        />
        <Chart.Bar data={barQuarterly} name="Revenue" valueYField="revenue" mode={mode} color="violet" />
        <Chart.Bar data={barQuarterly} name="Profit" valueYField="profit" mode={mode} color="emerald" />
        <Chart.Bar data={barQuarterly} name="Cost" valueYField="cost" mode={mode} color="amber" />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
        <Chart.Legend />
        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
