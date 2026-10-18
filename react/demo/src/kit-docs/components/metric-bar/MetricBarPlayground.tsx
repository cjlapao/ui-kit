import React, { useState } from "react";
import { MetricBar } from "@cjlapao/ui-kit";
import type { ControlSize, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

export const MetricBarPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("sm");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [percentage, setPercentage] = useState(62);
  const [withReading, setWithReading] = useState(true);

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
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <Control label="Fill">
                      <input type="range" min={0} max={100} value={percentage} className="w-full"
                        onChange={(e) => setPercentage(Number(e.target.value))} />
                    </Control>
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Content">
                    <ToggleRow label="Free-form reading" checked={withReading} onChange={setWithReading} />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The caption is the bar's accessible name. This component renders{" "}
            <code>Progress</code> rather than drawing its own header — the
            hand-rolled one published no name, so the{" "}
            <code>role="progressbar"</code> under it was announced as just
            "progress bar".
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-md">
          <MetricBar
            label="Disk usage"
            value={withReading ? `${Math.round(percentage * 0.2)} / 20 GB` : undefined}
            percentage={percentage}
            size={size}
            tone={tone}
          />
        </div>
      }
    />
  );
};
