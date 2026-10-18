import React, { useState } from "react";
import { MultiProgressBar } from "@cjlapao/ui-kit";
import type { ControlSize, Orientation } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

const orientationOptions = ["horizontal", "vertical"].map((v) => ({ label: v, value: v }));
const labelPositionOptions = ["end", "start"].map((v) => ({ label: v, value: v }));

const SERIES = [
  { key: "running", label: "Running", value: 12 },
  { key: "paused", label: "Paused", value: 4 },
  { key: "stopped", label: "Stopped", value: 3 },
  { key: "failed", label: "Failed", value: 1 },
];

export const MultiProgressBarPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [hideLegend, setHideLegend] = useState(false);
  const [withTotal, setWithTotal] = useState(true);
  const [withSecondary, setWithSecondary] = useState(true);
  const [toned, setToned] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [labelPosition, setLabelPosition] = useState<"start" | "end">("end");
  const [labelOrientation, setLabelOrientation] = useState<Orientation>("horizontal");
  const [showPercent, setShowPercent] = useState(false);
  const [withIcons, setWithIcons] = useState(false);
  const [state, setState] = useState<"normal" | "loading" | "error" | "empty">("normal");

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Orientation" options={orientationOptions} value={orientation}
                      onChange={(v) => setOrientation(v as Orientation)} />
                    <SelectControl label="Legend position" options={labelPositionOptions} value={labelPosition}
                      onChange={(v) => setLabelPosition(v as "start" | "end")} />
                    <SelectControl label="Legend layout" options={orientationOptions} value={labelOrientation}
                      onChange={(v) => setLabelOrientation(v as Orientation)} />
                    <SelectControl label="State"
                      options={["normal", "loading", "error", "empty"].map((v) => ({ label: v, value: v }))}
                      value={state} onChange={(v) => setState(v as "normal")} />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Content">
                    <div className="space-y-1.5">
                      <ToggleRow label="Legend" checked={!hideLegend} onChange={(v) => setHideLegend(!v)} />
                      <ToggleRow label="Total label" checked={withTotal} onChange={setWithTotal} />
                      <ToggleRow label="Secondary label" checked={withSecondary} onChange={setWithSecondary} />
                      <ToggleRow label="Explicit tones" checked={toned} onChange={setToned} />
                      <ToggleRow label="Percentages" checked={showPercent} onChange={setShowPercent} />
                      <ToggleRow label="Legend icons" checked={withIcons} onChange={setWithIcons} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Hover a segment for its value. The bar itself is{" "}
            <code>role="img"</code> with a text alternative naming every slice —
            it used to have no role and no label, so the whole chart was
            invisible to a screen reader and its numbers lived only in that
            hover tooltip.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            This component absorbed <code>MeterGroup</code>: the orientation,
            legend placement, icons, percentages and the loading / error /
            empty states all came from it. <code>MeterGroup</code> is
            deprecated and no longer in the demo.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-lg">
          <MultiProgressBar
            label="Capsules"
            secondaryLabel={withSecondary ? "across 3 regions" : undefined}
            totalLabel={withTotal ? "20 total" : undefined}
            max={20}
            size={size}
            orientation={orientation}
            height={200}
            labelPosition={labelPosition}
            labelOrientation={labelOrientation}
            showPercent={showPercent}
            showLabels={!hideLegend}
            loading={state === "loading"}
            error={state === "error" ? "Could not reach the registry" : undefined}
            series={
              state === "empty"
                ? []
                : withIcons
                ? SERIES.map((s, i) => ({
                    ...s,
                    icon: ["Rocket", "Clock", "Database", "Error"][i],
                  }))
                : toned
                ? [
                    { ...SERIES[0], tone: "emerald" },
                    { ...SERIES[1], tone: "amber" },
                    { ...SERIES[2], tone: "slate" },
                    { ...SERIES[3], tone: "rose" },
                  ]
                : SERIES
            }
          />
        </div>
      }
    />
  );
};
