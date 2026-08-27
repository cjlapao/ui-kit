import React, { useState } from "react";
import { MultiToggle, Panel } from "@cjlapao/ui-kit";
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
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelLoaderTypeOptions,
  panelMediaPlacementOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

export const PanelPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("md");
  const [mediaPlacement, setMediaPlacement] =
    useState<PanelMediaPlacement>("top");
  const [decoration, setDecoration] = useState<PanelDecoration>("none");
  const [loaderType, setLoaderType] = useState<PanelLoaderType>("spinner");
  const [hasMedia, setHasMedia] = useState(true);
  const [hasBadge, setHasBadge] = useState(true);
  const [hasActions, setHasActions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hoverShadow, setHoverShadow] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [specularMode, setSpecularMode] = useState<PanelSpecularMode>("classic");
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
                  <SelectControl
                    label="Padding"
                    options={panelPaddingOptions}
                    value={padding}
                    onChange={(v) => setPadding(v as PanelPadding)}
                  />
                  <Control label="Media placement">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={panelMediaPlacementOptions}
                      value={mediaPlacement}
                      onChange={(v) => setMediaPlacement(v as PanelMediaPlacement)}
                    />
                  </Control>
                  <Control label="Decoration">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={panelDecorationOptions}
                      value={decoration}
                      onChange={(v) => setDecoration(v as PanelDecoration)}
                    />
                  </Control>
                </>
              ),
            },
            {
              id: "states",
              title: "States",
              controls: (
                <>
                  <Control label="Loader type">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={panelLoaderTypeOptions}
                      value={loaderType}
                      onChange={(v) => setLoaderType(v as PanelLoaderType)}
                    />
                  </Control>
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow label="Media" checked={hasMedia} onChange={setHasMedia} />
                    <ToggleRow label="Badge" checked={hasBadge} onChange={setHasBadge} />
                    <ToggleRow
                      label="Actions"
                      checked={hasActions}
                      onChange={setHasActions}
                    />
                    <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
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
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
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
                    ),
                  },
                ]
              : []),
          ]}
        />
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
                      },
                      {
                        label: "Close",
                        variant: "outline",
                        color: "rose",
                        size: "sm",
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
              disabled={disabled}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              specularMode={specularMode}
            >
              This panel uses the {variant} variant, {corner} corners and{" "}
              {padding} padding.
            </Panel>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
