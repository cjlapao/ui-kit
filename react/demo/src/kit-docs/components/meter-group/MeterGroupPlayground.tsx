import React, { useState } from "react";
import { MeterGroup, MultiToggle } from "@cjlapao/ui-kit";
import type {
  MeterGroupLabelPosition,
  MeterGroupOrientation,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  meterGroupOrientationOptions,
  trueColorOptions,
} from "../../shared/options";

const labelPositionOptions = [
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
];
const labelOrientationOptions = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];
const maxOptions = [50, 100, 200].map((n) => ({ label: String(n), value: String(n) }));

const DEMO_ITEMS = [
  { label: "Apps", value: 16, color: "emerald" as const },
  { label: "Messages", value: 8, color: "amber" as const },
  { label: "Media", value: 24 },
  { label: "System", value: 10, color: "violet" as const },
];

export const MeterGroupPlayground: React.FC = () => {
  const [orientation, setOrientation] = useState<MeterGroupOrientation>("horizontal");
  const [labelPosition, setLabelPosition] = useState<MeterGroupLabelPosition>("end");
  const [labelOrientation, setLabelOrientation] =
    useState<MeterGroupOrientation>("horizontal");
  const [color, setColor] = useState<TrueColor>("blue");
  const [max, setMax] = useState(100);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  <Control label="Orientation">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={meterGroupOrientationOptions}
                      value={orientation}
                      onChange={(v) => setOrientation(v as MeterGroupOrientation)}
                    />
                  </Control>
                  <Control label="Label position">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={labelPositionOptions}
                      value={labelPosition}
                      onChange={(v) => setLabelPosition(v as MeterGroupLabelPosition)}
                    />
                  </Control>
                  <Control label="Label list">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={labelOrientationOptions}
                      value={labelOrientation}
                      onChange={(v) => setLabelOrientation(v as MeterGroupOrientation)}
                    />
                  </Control>
                  <Control label="Max">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={maxOptions}
                      value={String(max)}
                      onChange={(v) => setMax(Number(v))}
                    />
                  </Control>
                  <SelectControl
                    label="Color"
                    options={trueColorOptions}
                    value={color}
                    onChange={(v) => setColor(v as TrueColor)}
                  />
                </>
              ),
            },
            {
              id: "options",
              title: "Options",
              controls: (
                <ToggleRow label="Show labels" checked={showLabels} onChange={setShowLabels} />
              ),
            },
          ]}
        />
      }
      preview={
        <MeterGroup
          items={DEMO_ITEMS}
          orientation={orientation}
          labelPosition={labelPosition}
          labelOrientation={labelOrientation}
          color={color}
          max={max}
          showLabels={showLabels}
          height={orientation === "vertical" ? "220px" : undefined}
          ariaLabel="Storage usage"
        />
      }
    />
  );
};

export default MeterGroupPlayground;
