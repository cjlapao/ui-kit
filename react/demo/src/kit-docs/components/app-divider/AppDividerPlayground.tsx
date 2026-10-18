import React, { useState } from "react";
import { AppDivider, ColorSwatches, Panel } from "@cjlapao/ui-kit";
import type {
  AppDividerLabelPosition,
  AppDividerOrientation,
  AppDividerVariant,
  ControlSize,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  appDividerSpacingOptions,
  appDividerVariantOptions,
  controlSizeOptions,
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
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <ChoiceControl
                      label="Orientation"
                      options={ORIENTATION_OPTIONS}
                      value={orientation}
                      onChange={(v) =>
                        setOrientation(v as AppDividerOrientation)
                      }
                    />
                    <ChoiceControl
                      label="Variant"
                      options={appDividerVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as AppDividerVariant)}
                    />
                    <ChoiceControl
                      label="Thickness"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Spacing"
                      options={appDividerSpacingOptions}
                      value={spacing}
                      onChange={(v) => setSpacing(v as "none" | ControlSize)}
                    />
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <ChoiceControl
                      label="Label position"
                      options={LABEL_POSITION_OPTIONS}
                      value={labelPosition}
                      onChange={(v) =>
                        setLabelPosition(v as AppDividerLabelPosition)
                      }
                    />
                    <div className="grid grid-cols-1 gap-2">
                      <ToggleRow
                        label="Use tone"
                        checked={useTone}
                        onChange={setUseTone}
                      />
                      {/* Tone is a colour decision — pick it from colour
                          swatches, not from a dropdown of words. Off means
                          the rule follows the surface's divider token. */}
                      {useTone && (
                        <Control label="Tone">
                          <ColorSwatches
                            selectable
                            size="sm"
                            value={tone}
                            onSelect={setTone}
                            defaultExpanded
                          />
                        </Control>
                      )}
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
                  </>
                ),
              },
            ]}
          />
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
        <div className="w-full">
          <Panel
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone="neutral"
          >
            {sample}
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
