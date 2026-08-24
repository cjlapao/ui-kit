import React, { useState } from "react";
import {
  MultiToggle,
  Panel,
  Select,
  Spinner,
  Toggle,
  CONTROL_SIZES,
  SPINNER_THICKNESSES,
  SPINNER_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  SpinnerSize,
  SpinnerThickness,
  SpinnerVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  controlSizeOptions,
  spinnerThicknessOptions,
  spinnerVariantOptions,
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

export const SpinnerDemo: React.FC = () => {
  const [size, setSize] = useState<SpinnerSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<SpinnerVariant>("solid");
  const [thickness, setThickness] = useState<SpinnerThickness>("normal");
  const [showLabel, setShowLabel] = useState(true);
  const [onGlass, setOnGlass] = useState(false);

  const shared = { size, color, variant, thickness };

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <Spinner
          {...shared}
          label={showLabel ? "Deploying update" : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="flex flex-wrap items-end gap-4">
          {CONTROL_SIZES.map((each) => (
            <div key={each} className="flex flex-col items-center gap-2">
              <Spinner {...shared} size={each} />
              <span className="text-[11px] opacity-60">{each}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every variant and thickness</Caption>
        <div className="space-y-3">
          {SPINNER_VARIANTS.map((eachVariant) => (
            <div key={eachVariant} className="space-y-2">
              <span className="text-[11px] opacity-60">{eachVariant}</span>
              <div className="flex flex-wrap items-center gap-4">
                {SPINNER_THICKNESSES.map((eachThickness) => (
                  <Spinner
                    key={eachThickness}
                    {...shared}
                    variant={eachVariant}
                    thickness={eachThickness}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          {TRUE_COLORS.map((each) => (
            <div key={each} className="flex items-center gap-3">
              <Spinner {...shared} color={each} />
              <span className="text-xs opacity-70">{each}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Spinner"
      label="[Spinner]"
      description="An indeterminate ring. Size comes from the shared control scale so it lines up with the Button beside it; the label is announced once and takes its copy colour from the surface it sits on."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(v) => setSize(v as SpinnerSize)}
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

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <MultiToggle
                fullWidth
                size="sm"
                options={spinnerVariantOptions}
                value={variant}
                onChange={(v) => setVariant(v as SpinnerVariant)}
              />
            </Field>
            <Field label="Thickness">
              <MultiToggle
                fullWidth
                size="sm"
                options={spinnerThicknessOptions}
                value={thickness}
                onChange={(v) => setThickness(v as SpinnerThickness)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
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
            Without a label the ring announces &ldquo;Loading&rdquo;; with one,
            the visible text is the announcement — the old sr-only copy would
            have said it twice. The ring stops spinning under{" "}
            <code>prefers-reduced-motion</code>.
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
