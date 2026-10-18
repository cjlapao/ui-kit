import React, { useState } from "react";
import { ColorSwatches, MultiToggle, Panel, Toggle } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
  ToggleAlign,
  ToggleDescriptionPlacement,
  TogglePadding,
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  toggleVariantOptions,
} from "../../shared/options";

const alignOptions = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const placementOptions = [
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

// The shared surface padding scale — `sm` is the kit default the component
// stands on.
const paddingOptions = [
  { label: "None", value: "none" },
  { label: "Xs", value: "xs" },
  { label: "Sm", value: "sm" },
  { label: "Md", value: "md" },
  { label: "Lg", value: "lg" },
  { label: "Xl", value: "xl" },
];

type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const TogglePlayground: React.FC = () => {
  const [variant, setVariant] = useState<ToggleVariant>("solid");
  const [size, setSize] = useState<ToggleSize>("md");
  const [align, setAlign] = useState<ToggleAlign>("left");
  const [placement, setPlacement] =
    useState<ToggleDescriptionPlacement>("stacked");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [padding, setPadding] = useState<TogglePadding>("sm");
  const [showLabel, setShowLabel] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showIcons, setShowIcons] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [log, pushLog] = useEventLog();
  const [glassPanel, setGlassPanel] = useState(false);
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");

  const sharedToggle = {
    variant,
    size,
    tone,
    padding,
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
        <>
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
                    <div className="grid grid-cols-2 gap-3">
                      <SelectControl
                        label="Size"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as ToggleSize)}
                      />
                      <SelectControl
                        label="Padding"
                        options={paddingOptions}
                        value={padding}
                        onChange={(value) => setPadding(value as TogglePadding)}
                      />
                    </div>
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
                    {/* A colour decision — pick it from swatches, not from a
                      dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
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
                              onChange={(value) =>
                                setVibrancy(value as VibrancyPreset)
                              }
                            />
                          </Control>
                          <Control label="Fill">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassOpacityOptions}
                              value={glassOpacity}
                              onChange={(value) =>
                                setGlassOpacity(value as OpacityPreset)
                              }
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
                    <ToggleRow
                      label="Label"
                      checked={showLabel}
                      onChange={setShowLabel}
                    />
                    <ToggleRow
                      label="Description"
                      checked={showDescription}
                      onChange={setShowDescription}
                    />
                    <ToggleRow
                      label="Icons"
                      checked={showIcons}
                      onChange={setShowIcons}
                    />
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — flip a switch."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Solid</strong> in <strong>blue</strong> at <code>md</code>{" "}
            with <code>sm</code> row padding is the kit default — track, thumb
            and glyph all scale from the shared control scale, so a{" "}
            <code>md</code> toggle lines up with an <code>md</code> input and
            button. The switch itself is a native checkbox with{" "}
            <code>role="switch"</code>: uncontrolled out of the box, Space and
            arrows for free, and the whole row is its click target.
          </p>
        </>
      }
      preview={
        /*
          The settings live on a real `Panel` — `elevated`, the kit default —
          instead of a hand-painted gradient. "Glass panel" in the Content
          group swaps the host to `glass`: the question under test is the
          switch reading clearly *on a translucent surface* (pair it with the
          playground's background-image toggle to give the blur something to
          blur).
        */
        <div className="w-full">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <div className="flex flex-col gap-4">
              <Toggle
                {...sharedToggle}
                label={showLabel ? "Two-factor authentication" : undefined}
                description={
                  showDescription
                    ? "Require a code from your phone to sign in."
                    : undefined
                }
                defaultChecked
                onChange={(value) =>
                  pushLog(`Two-factor → ${value ? "on" : "off"}`)
                }
              />
              <Toggle
                {...sharedToggle}
                label={showLabel ? "Marketing emails" : undefined}
                onChange={(value) =>
                  pushLog(`Marketing → ${value ? "on" : "off"}`)
                }
              />
            </div>
          </Panel>
        </div>
      }
    />
  );
};
