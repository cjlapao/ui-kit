import React, { useState } from "react";
import {
  Accordion,
  Button,
  ColorSwatches,
  useAccordion,
} from "@cjlapao/ui-kit";
import { DEFAULT_CONTROL_CORNER } from "@cjlapao/ui-kit";
import type {
  AccordionIndicator,
  AccordionIndicatorPlacement,
  ControlSize,
  PanelLoaderType,
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
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
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelLoaderTypeOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

const INDICATOR_OPTIONS: { label: string; value: AccordionIndicator }[] = [
  { label: "Chevron", value: "chevron" },
  { label: "Plus/Minus", value: "plus-minus" },
  { label: "None", value: "none" },
];

const PLACEMENT_OPTIONS: {
  label: string;
  value: AccordionIndicatorPlacement;
}[] = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const REGIONS = [
  {
    id: "region-us",
    title: "United States",
    subtitle: "us-east-1 · N. Virginia",
    description: "Low latency for east coast workloads.",
    badge: "Primary",
    content:
      "Availability zones: 3 — average latency 22 ms. GPU instances and spot capacity are available.",
  },
  {
    id: "region-eu",
    title: "Europe",
    subtitle: "eu-central-1 · Frankfurt",
    description: "Ideal for GDPR-compliant workloads.",
    badge: "High demand",
    content:
      "Availability zones: 2 — average latency 39 ms. Maintenance window Sundays 02:00–04:00 CET.",
  },
  {
    id: "region-apac",
    title: "Asia Pacific",
    subtitle: "ap-southeast-1 · Singapore",
    description: "Great for APAC users and low-latency APIs.",
    badge: "New",
    content:
      "Availability zones: 3 — average latency 55 ms. Dedicated bare-metal hosts available on request.",
  },
];

export const AccordionPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_CONTROL_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [size, setSize] = useState<ControlSize>("md");
  const [indicator, setIndicator] = useState<AccordionIndicator>("chevron");
  const [indicatorPlacement, setIndicatorPlacement] =
    useState<AccordionIndicatorPlacement>("right");
  const [multiple, setMultiple] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [withIcons, setWithIcons] = useState(true);
  const [withActions, setWithActions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<PanelLoaderType>("skeleton");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

  const accordion = useAccordion({
    defaultOpenIds: ["region-us"],
    multiple,
  });

  const isGlass = GLASS_VARIANTS.includes(variant);

  const items = REGIONS.map((region) => ({
    id: region.id,
    title: region.title,
    subtitle: region.subtitle,
    description: region.description,
    icon: withIcons ? "Globe" : undefined,
    badge: withIcons ? region.badge : undefined,
    content: <p>{region.content}</p>,
    actions:
      withActions && region.id === "region-us" ? (
        <Button
          size="xs"
          variant="ghost"
          color={tone}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1200);
          }}
        >
          Refresh
        </Button>
      ) : undefined,
  }));

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
                  <ChoiceControl
                    label="Variant"
                    options={surfaceVariantOptions}
                    value={variant}
                    onChange={(v) => setVariant(v as PanelVariant)}
                  />
                  {/* Tone is a colour decision — pick it from colour swatches,
                      not from a dropdown of words. */}
                  <Control label="Tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={tone}
                      onSelect={setTone}
                      defaultExpanded
                    />
                  </Control>
                  <ChoiceControl
                    label="Corner"
                    options={panelCornerOptions}
                    value={corner}
                    onChange={(v) => setCorner(v as PanelCorner)}
                  />
                  <ChoiceControl
                    label="Padding"
                    options={panelPaddingOptions}
                    value={padding}
                    onChange={(v) => setPadding(v as PanelPadding)}
                  />
                  <ChoiceControl
                    label="Size"
                    options={controlSizeOptions}
                    value={size}
                    onChange={(v) => setSize(v as ControlSize)}
                  />
                  <ChoiceControl
                    label="Indicator"
                    options={INDICATOR_OPTIONS}
                    value={indicator}
                    onChange={(v) => setIndicator(v as AccordionIndicator)}
                  />
                  <ChoiceControl
                    label="Indicator placement"
                    options={PLACEMENT_OPTIONS}
                    value={indicatorPlacement}
                    onChange={(v) =>
                      setIndicatorPlacement(v as AccordionIndicatorPlacement)
                    }
                  />
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <div className="grid grid-cols-1 gap-2">
                  <ToggleRow
                    label="Multiple open"
                    checked={multiple}
                    onChange={setMultiple}
                  />
                  <ToggleRow
                    label="Animated"
                    checked={animated}
                    onChange={setAnimated}
                  />
                  <ToggleRow
                    label="Disabled"
                    checked={disabled}
                    onChange={setDisabled}
                  />
                  <ToggleRow
                    label="Icons and badges"
                    checked={withIcons}
                    onChange={setWithIcons}
                  />
                  <ToggleRow
                    label="Header action"
                    checked={withActions}
                    onChange={setWithActions}
                  />
                  <ToggleRow
                    label="Loading"
                    checked={loading}
                    onChange={setLoading}
                  />
                  <ChoiceControl
                    label="Loader type"
                    options={panelLoaderTypeOptions}
                    value={loaderType}
                    onChange={(v) => setLoaderType(v as PanelLoaderType)}
                  />
                </div>
              ),
            },
            ...(isGlass
              ? [
                  {
                    id: "glass",
                    title: "Glass",
                    controls: (
                      <>
                        <ChoiceControl
                          label="Specular"
                          options={panelSpecularOptions}
                          value={specularMode}
                          onChange={(v) =>
                            setSpecularMode(v as PanelSpecularMode)
                          }
                        />
                        <ChoiceControl
                          label="Vibrancy"
                          options={glassVibrancyOptions}
                          value={vibrancy as string}
                          onChange={(v) => setVibrancy(v as GlassVibrancy)}
                        />
                        <ChoiceControl
                          label="Glass opacity"
                          options={glassOpacityOptions}
                          value={glassOpacity as string}
                          onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                        />
                      </>
                    ),
                  },
                ]
              : []),
          ]}
        />
      }
      preview={
        <div className="w-full">
          <Accordion
            items={items}
            variant={variant}
            tone={tone}
            corner={corner}
            padding={padding}
            size={size}
            indicator={indicator}
            indicatorPlacement={indicatorPlacement}
            multiple={multiple}
            animated={animated}
            disabled={disabled}
            loading={loading}
            loaderType={loaderType}
            openIds={accordion.openIds}
            onChange={accordion.setOpenIds}
            glassOpacity={glassOpacity}
            vibrancy={vibrancy}
            specularMode={specularMode}
            ariaLabel="Cloud regions"
          />
        </div>
      }
    ></PlaygroundPanel>
  );
};
