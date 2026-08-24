import React, { useState } from "react";
import {
  AppDivider,
  MultiToggle,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  AppDividerLabelPosition,
  AppDividerOrientation,
  AppDividerVariant,
  ControlSize,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  appDividerSpacingOptions,
  appDividerVariantOptions,
  controlSizeOptions,
  trueColorOptions,
} from "../../shared/options";

const ORIENTATION_OPTIONS = [
  { label: "Vertical", value: "vertical" },
  { label: "Horizontal", value: "horizontal" },
];

const LABEL_POSITION_OPTIONS = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
];

export const AppDividerPlayground: React.FC = () => {
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
    <PlaygroundPanel
      controls={
        <>
          <Control label="Orientation">
            <MultiToggle
              fullWidth
              size="sm"
              options={ORIENTATION_OPTIONS}
              value={orientation}
              onChange={(v) => setOrientation(v as AppDividerOrientation)}
            />
          </Control>
          <Control label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={appDividerVariantOptions}
              value={variant}
              onChange={(v) => setVariant(v as AppDividerVariant)}
            />
          </Control>
          <Control label="Thickness">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(v) => setSize(v as ControlSize)}
            />
          </Control>
          <Control label="Spacing">
            <MultiToggle
              fullWidth
              size="sm"
              options={appDividerSpacingOptions}
              value={spacing}
              onChange={(v) => setSpacing(v as "none" | ControlSize)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          <Control label="Label position">
            <MultiToggle
              fullWidth
              size="sm"
              options={LABEL_POSITION_OPTIONS}
              value={labelPosition}
              onChange={(v) =>
                setLabelPosition(v as AppDividerLabelPosition)
              }
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Use tone"
              checked={useTone}
              onChange={setUseTone}
            />
            <ToggleRow
              label="Label"
              checked={withLabel}
              onChange={setWithLabel}
            />
            <ToggleRow
              label="On a glass panel"
              checked={onGlass}
              onChange={setOnGlass}
            />
          </div>
          <p className="text-xs opacity-70">
            With <strong>Use tone</strong> off, the rule reads the surrounding
            surface's divider colour — switch <strong>On a glass panel</strong>{" "}
            on to see it adapt. A labelled divider is announced as a{" "}
            <code>separator</code>; an unlabelled one is decoration and hidden
            from assistive tech.
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <Panel
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone="neutral"
              padding="md"
            >
              {sample}
            </Panel>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
