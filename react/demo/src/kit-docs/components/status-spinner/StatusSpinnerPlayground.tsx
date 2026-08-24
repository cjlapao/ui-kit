import React, { useState } from "react";
import {
  Input,
  MultiToggle,
  Panel,
  StatusSpinner,
} from "@cjlapao/ui-kit";
import type {
  StatusSpinnerSize,
  StatusSpinnerTone,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  trueColorOptions,
} from "../../shared/options";

export const StatusSpinnerPlayground: React.FC = () => {
  const [size, setSize] = useState<StatusSpinnerSize>("md");
  const [tone, setTone] = useState<StatusSpinnerTone>("blue");
  const [animated, setAnimated] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [label, setLabel] = useState("Deploying update");
  const [onGlass, setOnGlass] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(value) => setSize(value as StatusSpinnerSize)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(value) => setTone(value as StatusSpinnerTone)}
          />
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Animate"
              checked={animated}
              onChange={setAnimated}
            />
            <ToggleRow
              label="Label"
              checked={showLabel}
              onChange={setShowLabel}
            />
            <ToggleRow
              label="On a glass panel"
              checked={onGlass}
              onChange={setOnGlass}
            />
          </div>
          {showLabel && (
            <Control label="Label text">
              <Input
                size="sm"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
              />
            </Control>
          )}
          <p className="text-xs opacity-70">
            Without a label the circle announces “Loading”; with one, the
            visible text is the announcement. The ring stops spinning under{" "}
            <code>prefers-reduced-motion</code>.
          </p>
        </>
      }
      preview={
        <Panel
          variant={onGlass ? "liquid-glass" : "outlined"}
          tone={onGlass ? tone : "neutral"}
          padding="md"
        >
          <StatusSpinner
            size={size}
            tone={tone}
            animated={animated}
            label={showLabel ? label || undefined : undefined}
          />
        </Panel>
      }
    >
    </PlaygroundPanel>
  );
};
