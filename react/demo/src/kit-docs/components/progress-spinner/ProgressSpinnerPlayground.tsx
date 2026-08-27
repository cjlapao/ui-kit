import React, { useState } from "react";
import { ProgressSpinner, MultiToggle } from "@cjlapao/ui-kit";
import type { ControlSize, SpinnerThickness, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  spinnerThicknessOptions,
  trueColorOptions,
} from "../../shared/options";

const modeOptions = [
  { label: "Indeterminate", value: "indeterminate" },
  { label: "Determinate", value: "determinate" },
];
const valueOptions = [0, 25, 50, 62, 75, 100].map((n) => ({
  label: `${n}%`,
  value: String(n),
}));

export const ProgressSpinnerPlayground: React.FC = () => {
  const [mode, setMode] = useState("indeterminate");
  const [size, setSize] = useState<ControlSize>("xl");
  const [thickness, setThickness] = useState<SpinnerThickness>("normal");
  const [color, setColor] = useState<TrueColor>("blue");
  const [value, setValue] = useState(62);
  const [showValue, setShowValue] = useState(true);
  const [slow, setSlow] = useState(false);

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
                  <Control label="Mode">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={modeOptions}
                      value={mode}
                      onChange={(v) => setMode(v)}
                    />
                  </Control>
                  <Control label="Size">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                  </Control>
                  <Control label="Thickness">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={spinnerThicknessOptions}
                      value={thickness}
                      onChange={(v) => setThickness(v as SpinnerThickness)}
                    />
                  </Control>
                  <SelectControl
                    label="Color"
                    options={trueColorOptions}
                    value={color}
                    onChange={(v) => setColor(v as TrueColor)}
                  />
                  <SelectControl
                    label="Value"
                    options={valueOptions}
                    value={String(value)}
                    onChange={(v) => setValue(Number(v))}
                  />
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <>
                  <ToggleRow label="Show value" checked={showValue} onChange={setShowValue} />
                  <ToggleRow label="Slow tempo" checked={slow} onChange={setSlow} />
                </>
              ),
            },
          ]}
        />
      }
      preview={
        mode === "determinate" ? (
          <ProgressSpinner
            value={value}
            size={size}
            thickness={thickness}
            color={color}
            showValue={showValue}
            animationDuration={slow ? "4s" : "2s"}
            ariaLabel="Demo progress"
          />
        ) : (
          <ProgressSpinner
            size={size}
            thickness={thickness}
            color={color}
            animationDuration={slow ? "4s" : "2s"}
            ariaLabel="Demo progress"
          />
        )
      }
    />
  );
};

export default ProgressSpinnerPlayground;
