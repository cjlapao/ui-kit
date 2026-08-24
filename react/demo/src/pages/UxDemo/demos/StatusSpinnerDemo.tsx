import React, { useState } from "react";
import {
  CONTROL_SIZES,
  MultiToggle,
  Panel,
  Select,
  StatusSpinner,
  Toggle,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  StatusSpinnerSize,
  StatusSpinnerTone,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { controlSizeOptions, trueColorOptions } from "../constants";

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

export const StatusSpinnerDemo: React.FC = () => {
  const [size, setSize] = useState<StatusSpinnerSize>("md");
  const [tone, setTone] = useState<StatusSpinnerTone>("blue");
  const [animated, setAnimated] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [onGlass, setOnGlass] = useState(false);

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <StatusSpinner
          size={size}
          tone={tone}
          animated={animated}
          label={showLabel ? "Deploying update" : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="flex flex-wrap items-end gap-4">
          {CONTROL_SIZES.map((each) => (
            <div key={each} className="flex flex-col items-center gap-2">
              <StatusSpinner size={each} tone={tone} animated={animated} />
              <span className="text-[11px] opacity-60">{each}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>States</Caption>
        <div className="flex flex-wrap items-center gap-6">
          <StatusSpinner size="md" tone={tone} animated label="Working" />
          <StatusSpinner size="md" tone={tone} animated={false} label="Idle" />
          <StatusSpinner size="md" tone="emerald" label="Healthy" />
          <StatusSpinner size="md" tone="amber" label="Pending" />
          <StatusSpinner size="md" tone="rose" animated={false} label="Failed" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          {TRUE_COLORS.map((each) => (
            <div key={each} className="flex items-center gap-3">
              <StatusSpinner size={size} tone={each} animated={animated} />
              <span className="text-xs opacity-70">{each}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Status Spinner"
      label="[StatusSpinner]"
      description="A spinner with a glowing centre dot for async states. The circle is the same size as the Spinner and Button beside it at each control size; the tone is one of the 21 true colours and the label is announced once, in the surface's own copy colour."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(v) => setSize(v as StatusSpinnerSize)}
              />
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Animate"
              checked={animated}
              onChange={(event) => setAnimated(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Label"
              checked={showLabel}
              onChange={(event) => setShowLabel(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            Without a label the circle announces &ldquo;Loading&rdquo;; with
            one, the visible text is the announcement — the old sr-only copy
            would have said it twice. The ring stops spinning under{" "}
            <code>prefers-reduced-motion</code>.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
