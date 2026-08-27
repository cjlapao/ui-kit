import React, { useState } from "react";
import { MultiToggle, Toggle } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
  ToggleAlign,
  ToggleDescriptionPlacement,
  ToggleSize,
  ToggleVariant,
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
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  toggleVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const alignOptions = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const placementOptions = [
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const TogglePlayground: React.FC = () => {
  const [variant, setVariant] = useState<ToggleVariant>("solid");
  const [size, setSize] = useState<ToggleSize>("md");
  const [align, setAlign] = useState<ToggleAlign>("left");
  const [placement, setPlacement] = useState<ToggleDescriptionPlacement>("stacked");
  const [color, setColor] = useState<TrueColor>("blue");
  const [showLabel, setShowLabel] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showIcons, setShowIcons] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");

  const sharedToggle = {
    variant,
    size,
    color,
    alignLabel: align,
    descriptionPlacement: placement,
    fullWidth,
    vibrancy: vibrancy as GlassVibrancy,
    glassOpacity: glassOpacity as GlassOpacity,
    specularMode,
    iconOn: showIcons ? "Sun" : undefined,
    iconOff: showIcons ? "Moon" : undefined,
    disabled,
  };

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
                  <SelectControl
                    label="Variant"
                    options={toggleVariantOptions}
                    value={variant}
                    onChange={(value) => setVariant(value as ToggleVariant)}
                  />
                  <Control label="Size">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(value) => setSize(value as ToggleSize)}
                    />
                  </Control>
                  <div className="grid grid-cols-2 gap-3">
                    <Control label="Label alignment">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={alignOptions}
                        value={align}
                        onChange={(value) => setAlign(value as ToggleAlign)}
                      />
                    </Control>
                    <Control label="Description">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={placementOptions}
                        value={placement}
                        onChange={(value) =>
                          setPlacement(value as ToggleDescriptionPlacement)
                        }
                      />
                    </Control>
                  </div>
                  <SelectControl
                    label="Color"
                    options={trueColorOptions}
                    value={color}
                    onChange={(value) => setColor(value as TrueColor)}
                  />
                </>
              ),
            },
            ...(variant === "glass"
              ? [
                  {
                    id: "glass",
                    title: "Glass",
                    controls: (
                      <div className="flex flex-col gap-3">
                        <Control label="Vibrancy">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={glassVibrancyOptions}
                            value={vibrancy}
                            onChange={(value) => setVibrancy(value as VibrancyPreset)}
                          />
                        </Control>
                        <Control label="Fill">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={glassOpacityOptions}
                            value={glassOpacity}
                            onChange={(value) => setGlassOpacity(value as OpacityPreset)}
                          />
                        </Control>
                        <Control label="Specular">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(value) =>
                              setSpecularMode(value as SpecularMode)
                            }
                          />
                        </Control>
                      </div>
                    ),
                  },
                ]
              : []),
            {
              id: "content",
              title: "Content",
              controls: (
                <div className="grid grid-cols-2 gap-2">
                  <ToggleRow label="Label" checked={showLabel} onChange={setShowLabel} />
                  <ToggleRow
                    label="Description"
                    checked={showDescription}
                    onChange={setShowDescription}
                  />
                  <ToggleRow label="Icons" checked={showIcons} onChange={setShowIcons} />
                  <ToggleRow
                    label="Full width"
                    checked={fullWidth}
                    onChange={setFullWidth}
                  />
                  <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                </div>
              ),
            },
          ]}
        />
      }
      preview={
        <div className="w-full">
          {/* The gradient surface stands in for real page content, so the
              translucent ghost and glass reads the way it will in the wild. */}
          <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <Toggle
              {...sharedToggle}
              label={showLabel ? "Two-factor authentication" : undefined}
              description={
                showDescription ? "Require a code from your phone to sign in." : undefined
              }
              defaultChecked
            />
            <Toggle
              {...sharedToggle}
              label={showLabel ? "Marketing emails" : undefined}
            />
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
