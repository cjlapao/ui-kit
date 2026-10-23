import React, { useState } from "react";
import { ColorSwatches, Panel } from "@cjlapao/ui-kit";
import { DEFAULT_SURFACE_CORNER } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelDecoration,
  PanelLoaderType,
  PanelMediaPlacement,
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelClickableOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelLoaderTypeOptions,
  panelMediaPlacementOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

export const PanelPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [mediaPlacement, setMediaPlacement] =
    useState<PanelMediaPlacement>("top");
  const [decoration, setDecoration] = useState<PanelDecoration>("none");
  const [loaderType, setLoaderType] = useState<PanelLoaderType>("skeleton");
  const [hasMedia, setHasMedia] = useState(true);
  const [hasBadge, setHasBadge] = useState(true);
  const [hasActions, setHasActions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hoverShadow, setHoverShadow] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  // `auto` leaves the prop undefined, which is the interesting state: the
  // card becomes a button because it has an `onClick`.
  const [clickableMode, setClickableMode] = useState<string>("auto");
  const [log, pushLog] = useEventLog();
  const [disabled, setDisabled] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

  const isGlass = GLASS_VARIANTS.includes(variant);

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
                      label="Media placement"
                      options={panelMediaPlacementOptions}
                      value={mediaPlacement}
                      onChange={(v) =>
                        setMediaPlacement(v as PanelMediaPlacement)
                      }
                    />
                    <ChoiceControl
                      label="Decoration"
                      options={panelDecorationOptions}
                      value={decoration}
                      onChange={(v) => setDecoration(v as PanelDecoration)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <ChoiceControl
                      label="Loader type"
                      options={panelLoaderTypeOptions}
                      value={loaderType}
                      onChange={(v) => setLoaderType(v as PanelLoaderType)}
                    />
                    <div className="grid grid-cols-1 gap-2">
                      <ToggleRow
                        label="Media"
                        checked={hasMedia}
                        onChange={setHasMedia}
                      />
                      <ToggleRow
                        label="Badge"
                        checked={hasBadge}
                        onChange={setHasBadge}
                      />
                      <ToggleRow
                        label="Actions"
                        checked={hasActions}
                        onChange={setHasActions}
                      />
                      <ToggleRow
                        label="Loading"
                        checked={loading}
                        onChange={setLoading}
                      />
                      <ToggleRow
                        label="Hover shadow"
                        checked={hoverShadow}
                        onChange={setHoverShadow}
                      />
                      <ToggleRow
                        label="Hoverable"
                        checked={hoverable}
                        onChange={setHoverable}
                      />
                      <ChoiceControl
                        label="Clickable"
                        options={panelClickableOptions}
                        value={clickableMode}
                        onChange={setClickableMode}
                      />
                      <ToggleRow
                        label="Disabled"
                        checked={disabled}
                        onChange={setDisabled}
                      />
                    </div>
                  </>
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
          <EventLogControl
            log={log}
            emptyText="No events yet — click the card, or Open inside it."
          />
        </>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={variant}
            tone={tone}
            corner={corner}
            padding={padding}
            decoration={decoration}
            media={
              hasMedia ? (
                <div
                  className={
                    mediaPlacement === "overlay"
                      ? "h-full min-h-40 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"
                      : "h-28 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"
                  }
                />
              ) : undefined
            }
            mediaPlacement={mediaPlacement}
            badge={hasBadge ? "New" : undefined}
            title="Panel title"
            subtitle="A subtitle"
            description="A description, which uses the surface's muted tone."
            actions={
              hasActions
                ? [
                    {
                      label: "Open",
                      variant: "solid",
                      color: "blue",
                      size: "sm",
                      onClick: () => pushLog("Open pressed"),
                    },
                    {
                      label: "Close",
                      variant: "outline",
                      color: "rose",
                      size: "sm",
                      onClick: () => pushLog("Close pressed"),
                    },
                  ]
                : undefined
            }
            loading={loading}
            loaderType={loaderType}
            loaderProgress={30}
            loaderTitle="Loading…"
            loaderMessage="Getting things ready…"
            hoverShadow={hoverShadow}
            hoverable={hoverable}
            // Always given, so `auto` is genuinely "follows onClick" rather
            // than "nothing is wired up".
            onClick={() => pushLog("Card activated")}
            clickable={
              clickableMode === "auto"
                ? undefined
                : clickableMode === "on"
                  ? true
                  : false
            }
            disabled={disabled}
            vibrancy={vibrancy}
            glassOpacity={glassOpacity}
            specularMode={specularMode}
          >
            This panel uses the {variant} variant, {corner} corners and{" "}
            {padding} padding.
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
