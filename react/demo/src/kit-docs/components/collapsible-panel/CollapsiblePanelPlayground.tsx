import React, { useState } from "react";
import {
  Button,
  CollapsiblePanel,
  ColorSwatches,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
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
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

const LOG_LINES = Array.from(
  { length: 14 },
  (_, index) =>
    `[12:0${index % 10}:31] step ${index + 1} — pulling layer sha256:${(
      index * 7919
    )
      .toString(16)
      .padStart(6, "0")}`,
);

export const CollapsiblePanelPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] =
    useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [expanded, setExpanded] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [withActions, setWithActions] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);
  const [longContent, setLongContent] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

  const isGlass = GLASS_VARIANTS.includes(variant);

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
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <div className="grid grid-cols-1 gap-2">
                  <ToggleRow label="Expanded" checked={expanded} onChange={setExpanded} />
                  <ToggleRow
                    label="Disabled"
                    checked={disabled}
                    onChange={setDisabled}
                  />
                  <ToggleRow
                    label="Header action"
                    checked={withActions}
                    onChange={setWithActions}
                  />
                  <ToggleRow
                    label="Subtitle"
                    checked={withSubtitle}
                    onChange={setWithSubtitle}
                  />
                  <ToggleRow
                    label="Long content"
                    checked={longContent}
                    onChange={setLongContent}
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
                          onChange={(v) => setSpecularMode(v as PanelSpecularMode)}
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
          <CollapsiblePanel
            title="Deployment logs"
            subtitle={withSubtitle ? "Last updated 5 minutes ago" : undefined}
            actions={
              withActions ? (
                <Button size="xs" variant="ghost" color={tone}>
                  Refresh
                </Button>
              ) : undefined
            }
            expanded={expanded}
            onToggle={setExpanded}
            disabled={disabled}
            variant={variant}
            tone={tone}
            corner={corner}
            padding={padding}
            glassOpacity={glassOpacity}
            vibrancy={vibrancy}
            specularMode={specularMode}
          >
            {longContent ? (
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {LOG_LINES.join("\n")}
              </pre>
            ) : (
              <p>
                Showing the latest deployment output. Errors and status logs
                appear here while we run automated checks against the new
                release.
              </p>
            )}
          </CollapsiblePanel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
