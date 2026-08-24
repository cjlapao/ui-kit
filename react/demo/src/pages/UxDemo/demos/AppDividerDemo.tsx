import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  AppDivider,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  APP_DIVIDER_VARIANTS,
} from "@cjlapao/ui-kit";
import type {
  AppDividerLabelPosition,
  AppDividerOrientation,
  AppDividerVariant,
  ControlSize,
  TrueColor,
} from "@cjlapao/ui-kit";
import { trueColorOptions } from "../constants";

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

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const variantOptions = APP_DIVIDER_VARIANTS.map((value) => ({
  label: titleCase(value),
  value,
}));

const sizeOptions: { label: string; value: ControlSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const spacingOptions = [{ label: "None", value: "none" }, ...sizeOptions];

export const AppDividerDemo: React.FC = () => {
  const [orientation, setOrientation] =
    useState<AppDividerOrientation>("vertical");
  const [variant, setVariant] = useState<AppDividerVariant>("solid");
  const [useTone, setUseTone] = useState(false);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("xs");
  const [spacing, setSpacing] = useState<"none" | ControlSize>("sm");
  const [withLabel, setWithLabel] = useState(false);
  const [labelPosition, setLabelPosition] =
    useState<AppDividerLabelPosition>("center");
  const [onGlass, setOnGlass] = useState(false);

  const divider = (
    <AppDivider
      orientation={orientation}
      variant={variant}
      tone={useTone ? tone : undefined}
      size={size}
      spacing={spacing}
      label={withLabel ? "OR" : undefined}
      labelPosition={labelPosition}
    />
  );

  const sample =
    orientation === "vertical" ? (
      <div className="flex h-16 items-center">
        <span>Item 1</span>
        {divider}
        <span>Item 2</span>
        {divider}
        <span>Item 3</span>
      </div>
    ) : (
      <div className="w-full">
        <p>Sign in with your work account.</p>
        {divider}
        <p>Continue with a single-use link instead.</p>
      </div>
    );

  return (
    <PlaygroundSection
      title="App Divider"
      label="[AppDivider]"
      description="A rule between sections — vertical or horizontal, optionally labelled. Takes the surrounding surface's divider colour unless given a tone."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Orientation">
              <MultiToggle
                fullWidth
                size="sm"
                options={[
                  { label: "Vertical", value: "vertical" },
                  { label: "Horizontal", value: "horizontal" },
                ]}
                value={orientation}
                onChange={(value) =>
                  setOrientation(value as AppDividerOrientation)
                }
              />
            </Field>
            <Field label="Variant">
              <MultiToggle
                fullWidth
                size="sm"
                options={variantOptions}
                value={variant}
                onChange={(value) => setVariant(value as AppDividerVariant)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Thickness">
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={size}
                onChange={(value) => setSize(value as ControlSize)}
              />
            </Field>
            <Field label="Spacing">
              <MultiToggle
                fullWidth
                size="sm"
                options={spacingOptions}
                value={spacing}
                onChange={(value) =>
                  setSpacing(value as "none" | ControlSize)
                }
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Tone">
              <Select
                value={tone}
                disabled={!useTone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Label position">
              <MultiToggle
                fullWidth
                size="sm"
                options={[
                  { label: "Start", value: "start" },
                  { label: "Center", value: "center" },
                  { label: "End", value: "end" },
                ]}
                value={labelPosition}
                onChange={(value) =>
                  setLabelPosition(value as AppDividerLabelPosition)
                }
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Toggle
              size="sm"
              label="Use tone"
              checked={useTone}
              onChange={(event) => setUseTone(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Label"
              checked={withLabel}
              onChange={(event) => setWithLabel(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            With <strong>Use tone</strong> off, the rule reads the surrounding
            surface's divider colour — switch <strong>On a glass panel</strong>{" "}
            on to see it adapt. A labelled divider is announced as a{" "}
            <code>separator</code>; an unlabelled one is decoration and hidden
            from assistive tech.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          {onGlass ? (
            <Panel variant="liquid-glass" tone={useTone ? tone : "neutral"} padding="md">
              {sample}
            </Panel>
          ) : (
            <Panel variant="outlined" tone="neutral" padding="md">
              {sample}
            </Panel>
          )}
        </div>
      }
    />
  );
};
