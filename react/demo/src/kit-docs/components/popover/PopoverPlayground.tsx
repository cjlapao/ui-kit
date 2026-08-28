import React, { useState } from "react";
import {
  Button,
  MultiToggle,
  Panel,
  Popover,
  type PopoverLoaderType,
  type PopoverPlacement,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
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
  panelLoaderTypeOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  popoverPlacementOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
    {children}
  </span>
);

/** The variants that read translucent — the only ones with glass controls. */
const GLASS_SURFACE_VARIANTS: SurfaceVariant[] = [
  "default",
  "glass",
  "liquid-glass",
];

// The pickers only offer the string presets; a bare `GlassVibrancy` /
// `GlassOpacity` would carry `| number`, which a Select value can't take.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";
type SpecularPreset = "none" | "classic" | "halo";

const MAX_WIDTHS = [
  { label: "240px", value: "240" },
  { label: "320px", value: "320" },
  { label: "400px", value: "400" },
  { label: "480px", value: "480" },
];

/**
 * The popover is a fixed overlay, so the preview is the trigger plus a hint
 * and a current-settings block. Short lists use MultiToggles; the long ones
 * — 8 variants, 21 tones, 6 corners, 6 paddings, 4 widths — are dropdowns.
 */
export const PopoverPlayground: React.FC = () => {
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  const [placement, setPlacement] = useState<PopoverPlacement>("auto");
  const [maxWidth, setMaxWidth] = useState("320");
  const [arrow, setArrow] = useState(true);
  const [dismissable, setDismissable] = useState(true);
  const [closeOnEscape, setCloseOnEscape] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<PopoverLoaderType>("spinner");
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularPreset>("classic");

  const isGlassSurface = GLASS_SURFACE_VARIANTS.includes(variant);

  return (
    <PlaygroundPanel
      previewClassName="w-full flex-col items-center"
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "surface",
                title: "Surface",
                defaultOpen: true,
                controls: (
                  <>
                    <SelectControl
                      label="Variant"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
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
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Padding"
                      options={panelPaddingOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)}
                    />
                  </>
                ),
              },
              {
                id: "placement",
                title: "Placement",
                controls: (
                  <>
                    <SelectControl
                      label="Placement"
                      options={popoverPlacementOptions}
                      value={placement}
                      onChange={(v) => setPlacement(v as PopoverPlacement)}
                    />
                    <SelectControl
                      label="Max width"
                      options={MAX_WIDTHS}
                      value={maxWidth}
                      onChange={setMaxWidth}
                    />
                    <ToggleRow
                      label="Arrow"
                      checked={arrow}
                      onChange={setArrow}
                    />
                  </>
                ),
              },
              {
                id: "behavior",
                title: "Behavior",
                controls: (
                  <>
                    <ToggleRow
                      label="Dismissable (outside click)"
                      checked={dismissable}
                      onChange={setDismissable}
                    />
                    <ToggleRow
                      label="Close on Escape"
                      checked={closeOnEscape}
                      onChange={setCloseOnEscape}
                    />
                  </>
                ),
              },
              {
                id: "loading",
                title: "Loading",
                controls: (
                  <>
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <Control label="Loader type">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={panelLoaderTypeOptions}
                        value={loaderType}
                        onChange={(v) => setLoaderType(v as PopoverLoaderType)}
                      />
                    </Control>
                  </>
                ),
              },
              ...(isGlassSurface
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <>
                          <SelectControl
                            label="Vibrancy"
                            options={glassVibrancyOptions}
                            value={vibrancy}
                            onChange={(v) => setVibrancy(v as VibrancyPreset)}
                          />
                          <SelectControl
                            label="Glass opacity"
                            options={glassOpacityOptions}
                            value={glassOpacity}
                            onChange={(v) =>
                              setGlassOpacity(v as OpacityPreset)
                            }
                          />
                          <SelectControl
                            label="Specular mode"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(v) =>
                              setSpecularMode(v as SpecularPreset)
                            }
                          />
                        </>
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs opacity-70">
            Click the trigger to open the popover — it is a fixed overlay that
            floats over the page. Turn on the background image to judge the
            glass surfaces over a real backdrop.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-10 dark:from-neutral-800 dark:to-neutral-900">
            <Popover
              trigger={<Button color={tone} size="sm">Toggle</Button>}
              variant={variant}
              tone={tone}
              corner={corner}
              padding={padding}
              placement={placement}
              maxWidth={Number(maxWidth)}
              arrow={arrow}
              dismissable={dismissable}
              closeOnEscape={closeOnEscape}
              loading={loading}
              loaderType={loaderType}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              specularMode={specularMode}
            >
              <div className="space-y-1.5">
                <p className="text-sm font-semibold">Popover content</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  This panel is a real Panel — {variant} / {tone} — with an
                  arrow that keeps pointing at the trigger.
                </p>
              </div>
            </Popover>
          </div>
          <Panel variant="outlined" padding="sm">
            <div className="flex flex-col gap-1.5">
              <Caption>Current settings</Caption>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                {variant} · {tone} · {corner} · {padding} · {placement} ·{" "}
                {maxWidth}px
                {arrow ? " · arrow" : " · no arrow"}
                {dismissable ? "" : " · non-dismissable"}
                {closeOnEscape ? "" : " · Escape ignored"}
                {loading ? ` · loading (${loaderType})` : ""}
              </p>
            </div>
          </Panel>
        </div>
      }
    />
  );
};
