import React, { useState } from "react";
import { Hero } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  HeroTitleElement,
  HeroVariant,
  PanelDecoration,
  SurfaceCorner,
  SurfacePadding,
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
  glowIntensityOptions,
  heroTitleElementOptions,
  heroVariantOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelPaddingOptions,
  trueColorOptions,
} from "../../shared/options";

export const HeroPlayground: React.FC = () => {
  const [variant, setVariant] = useState<HeroVariant>("gradient");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [titleSize, setTitleSize] = useState<ControlSize>("sm");
  const [subtitleSize, setSubtitleSize] = useState<ControlSize>("xs");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-xl");
  const [decoration, setDecoration] = useState<PanelDecoration>("both");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [titleAs, setTitleAs] = useState<HeroTitleElement>("p");

  const [withIcon, setWithIcon] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);

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
                    <SelectControl
                      label="Variant"
                      options={heroVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as HeroVariant)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <SelectControl
                      label="Title size"
                      options={controlSizeOptions}
                      value={titleSize}
                      onChange={(v) => setTitleSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Subtitle size"
                      options={controlSizeOptions}
                      value={subtitleSize}
                      onChange={(v) => setSubtitleSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Padding"
                      options={panelPaddingOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Decoration"
                      options={panelDecorationOptions}
                      value={decoration}
                      onChange={(v) => setDecoration(v as PanelDecoration)}
                    />
                    <SelectControl
                      label="Glow"
                      options={glowIntensityOptions}
                      value={glowIntensity}
                      onChange={(v) => setGlowIntensity(v as GlowIntensity)}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <SelectControl
                      label="Title element"
                      options={heroTitleElementOptions}
                      value={titleAs}
                      onChange={(v) => setTitleAs(v as HeroTitleElement)}
                    />
                    <Control label="Content">
                      <div className="space-y-1.5">
                        <ToggleRow
                          label="Icon"
                          checked={withIcon}
                          onChange={setWithIcon}
                        />
                        <ToggleRow
                          label="Subtitle"
                          checked={withSubtitle}
                          onChange={setWithSubtitle}
                        />
                      </div>
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The gradient runs between the tone's own <strong>700</strong> and{" "}
            <strong>800</strong> shades — white copy measures 4.93:1 at worst
            there, against 2.94:1 on the <code>-400</code> stop the old
            hand-written table used. Every other variant is a{" "}
            <code>Panel</code>, and takes its copy colour from the surface
            instead of being forced to white.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-2xl">
          <Hero
            variant={variant}
            tone={tone}
            titleSize={titleSize}
            subtitleSize={subtitleSize}
            padding={padding}
            corner={corner}
            decoration={decoration}
            glowIntensity={glowIntensity}
            titleAs={titleAs}
            icon={withIcon ? "Rocket" : undefined}
            title="Release Canary version"
            subtitle={withSubtitle ? "on: workflow_dispatch" : undefined}
          />
        </div>
      }
    />
  );
};
