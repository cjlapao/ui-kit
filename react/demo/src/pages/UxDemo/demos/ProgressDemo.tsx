import React, { useEffect, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  MultiToggle,
  Panel,
  Progress,
  Select,
  Toggle,
  CONTROL_SIZES,
  PROGRESS_MOTIONS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  ProgressCorner,
  ProgressMotion,
  ProgressMotionDirection,
  ProgressMotionSpeed,
  ProgressSize,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  controlSizeOptions,
  progressCornerOptions,
  progressMotionDirectionOptions,
  progressMotionOptions,
  progressMotionSpeedOptions,
  trueColorOptions,
} from "../constants";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const ProgressDemo: React.FC = () => {
  const [value, setValue] = useState(45);
  const [size, setSize] = useState<ProgressSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [motion, setMotion] = useState<ProgressMotion>("shimmer");
  const [motionSpeed, setMotionSpeed] = useState<ProgressMotionSpeed>("normal");
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

  const shared = {
    size,
    color,
    motion,
    motionSpeed,
    motionDirection,
    corner,
  };

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <Progress
          {...shared}
          value={value}
          indeterminate={indeterminate}
          label={showLabel ? "Restoring snapshot" : undefined}
          showValue={showValue}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every motion</Caption>
        <div className="space-y-3">
          {PROGRESS_MOTIONS.map((each) => (
            <Progress
              key={each}
              {...shared}
              motion={each}
              value={value}
              label={each}
              showValue
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="space-y-3">
          {CONTROL_SIZES.map((each) => (
            <Progress key={each} {...shared} size={each} value={value} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Indeterminate — extent unknown, so no percentage</Caption>
        <div className="space-y-3">
          {CONTROL_SIZES.map((each) => (
            <Progress
              key={each}
              {...shared}
              size={each}
              indeterminate
              label={`Size ${each}`}
              showValue
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>An arbitrary range, with its own units</Caption>
        <Progress
          {...shared}
          value={640}
          min={0}
          max={1024}
          label="Disk image"
          showValue
          formatValue={(v, percent) =>
            `${v} MB of 1024 MB (${Math.round(percent)}%)`
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          {TRUE_COLORS.map((each) => (
            <Progress
              key={each}
              {...shared}
              color={each}
              value={value}
              label={each}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Progress"
      label="[Progress]"
      description="A determinate or indeterminate progress bar. Size and tone come from the shared scales; the motion overlays are driven by classes so a reduced-motion preference can switch them off."
      controls={
        <div className="space-y-5 text-sm">
          <Field label={`Value — ${value}`}>
            <input
              type="range"
              min={0}
              max={100}
              value={value}
              disabled={indeterminate}
              onChange={(event) => setValue(Number(event.target.value))}
              className="w-full accent-blue-500 disabled:opacity-50"
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(v) => setSize(v as ProgressSize)}
              />
            </Field>
            <Field label="Tone">
              <Select
                value={color}
                onChange={(event) => setColor(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Motion">
            <MultiToggle
              fullWidth
              size="sm"
              options={progressMotionOptions}
              value={motion}
              onChange={(v) => setMotion(v as ProgressMotion)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Speed">
              <MultiToggle
                fullWidth
                size="sm"
                options={progressMotionSpeedOptions}
                value={motionSpeed}
                onChange={(v) => setMotionSpeed(v as ProgressMotionSpeed)}
              />
            </Field>
            <Field label="Direction">
              <MultiToggle
                fullWidth
                size="sm"
                options={progressMotionDirectionOptions}
                value={motionDirection}
                onChange={(v) =>
                  setMotionDirection(v as ProgressMotionDirection)
                }
              />
            </Field>
            <Field label="Corner">
              <MultiToggle
                fullWidth
                size="sm"
                options={progressCornerOptions}
                value={corner}
                onChange={(v) => setCorner(v as ProgressCorner)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Indeterminate"
              checked={indeterminate}
              onChange={(event) => setIndeterminate(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Label"
              checked={showLabel}
              onChange={(event) => setShowLabel(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Show value"
              checked={showValue}
              onChange={(event) => setShowValue(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Animate the value"
              checked={running}
              onChange={(event) => setRunning(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            <strong>Indeterminate</strong> drops <code>aria-valuenow</code>{" "}
            entirely — that absence is what tells a screen reader the extent is
            unknown. A <strong>label</strong> also becomes the bar&apos;s
            accessible name; without one, <code>role=&quot;progressbar&quot;</code>{" "}
            is announced as just &ldquo;progress bar&rdquo;.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
