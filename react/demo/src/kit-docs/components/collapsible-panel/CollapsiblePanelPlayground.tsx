import React, { useState } from "react";
import {
  Button,
  CollapsiblePanel,
  DEFAULT_SURFACE_CORNER,
  MultiToggle,
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
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
  trueColorOptions,
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
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] =
    useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("md");
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
        <>
          <SelectControl
            label="Variant"
            options={surfaceVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as PanelVariant)}
          />
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          <SelectControl
            label="Corner"
            options={panelCornerOptions}
            value={corner}
            onChange={(v) => setCorner(v as PanelCorner)}
          />
          <Control label="Padding">
            <MultiToggle
              fullWidth
              size="sm"
              options={panelPaddingOptions}
              value={padding}
              onChange={(v) => setPadding(v as PanelPadding)}
            />
          </Control>
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
          {isGlass && (
            <>
              <Control label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(v) => setSpecularMode(v as PanelSpecularMode)}
                />
              </Control>
              <Control label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(v) => setVibrancy(v as GlassVibrancy)}
                />
              </Control>
              <Control label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                />
              </Control>
            </>
          )}
        </>
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
