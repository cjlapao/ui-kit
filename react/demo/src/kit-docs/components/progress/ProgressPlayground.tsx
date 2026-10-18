import React, { useEffect, useState } from "react";
import { MultiToggle, Panel, Progress } from "@cjlapao/ui-kit";
import type {
  ProgressCorner,
  ProgressMotion,
  ProgressMotionDirection,
  ProgressMotionSpeed,
  ProgressSize,
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
  controlSizeOptions,
  progressCornerOptions,
  progressMotionDirectionOptions,
  progressMotionOptions,
  progressMotionSpeedOptions,
  trueColorOptions,
} from "../../shared/options";

export const ProgressPlayground: React.FC = () => {
  const [value, setValue] = useState(45);
  const [size, setSize] = useState<ProgressSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [motion, setMotion] = useState<ProgressMotion>("shimmer");
  const [motionSpeed, setMotionSpeed] =
    useState<ProgressMotionSpeed>("normal");
  const [motionDirection, setMotionDirection] =
    useState<ProgressMotionDirection>("forward");
  const [corner, setCorner] = useState<ProgressCorner>("full");
  const [indeterminate, setIndeterminate] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [showValue, setShowValue] = useState(true);
  const [running, setRunning] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  // A bar that never moves hides every timing bug in the transition.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setValue((v) => (v >= 100 ? 0 : v + 7)),
      600,
    );
    return () => window.clearInterval(id);
  }, [running]);

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
                    <Control label={`Value — ${value}`}>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        disabled={indeterminate}
                        onChange={(event) => setValue(Number(event.target.value))}
                        className="w-full accent-blue-500 disabled:opacity-50"
                        aria-label="Progress value"
                      />
                    </Control>
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as ProgressSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={color}
                      onChange={(v) => setColor(v as TrueColor)}
                    />
                    <SelectControl
                      label="Motion"
                      options={progressMotionOptions}
                      value={motion}
                      onChange={(v) => setMotion(v as ProgressMotion)}
                    />
                    <Control label="Speed">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={progressMotionSpeedOptions}
                        value={motionSpeed}
                        onChange={(v) => setMotionSpeed(v as ProgressMotionSpeed)}
                      />
                    </Control>
                    <Control label="Direction">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={progressMotionDirectionOptions}
                        value={motionDirection}
                        onChange={(v) =>
                          setMotionDirection(v as ProgressMotionDirection)
                        }
                      />
                    </Control>
                    <Control label="Corner">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={progressCornerOptions}
                        value={corner}
                        onChange={(v) => setCorner(v as ProgressCorner)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Indeterminate" checked={indeterminate} onChange={setIndeterminate} />
                    <ToggleRow label="Label" checked={showLabel} onChange={setShowLabel} />
                    <ToggleRow label="Show value" checked={showValue} onChange={setShowValue} />
                    <ToggleRow label="Animate the value" checked={running} onChange={setRunning} />
                    <ToggleRow label="On a glass panel" checked={onGlass} onChange={setOnGlass} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            <strong>Indeterminate</strong> drops <code>aria-valuenow</code>{" "}
            entirely — that absence is what tells a screen reader the extent
            is unknown. A <strong>label</strong> also becomes the bar&apos;s
            accessible name; without one, the progress bar is announced as
            just &ldquo;progress bar&rdquo;.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            <div className="flex w-full max-w-md flex-col gap-4">
              <Progress
                size={size}
                color={color}
                corner={corner}
                motion={motion}
                motionSpeed={motionSpeed}
                motionDirection={motionDirection}
                value={value}
                indeterminate={indeterminate}
                label={showLabel ? "Restoring snapshot" : undefined}
                showValue={showValue}
              />
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
