import React, { useState } from "react";
import { ColorSwatches, PanelHero } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  PanelHeroTitleElement,
  PanelHeroVariant,
  PanelDecoration,
  SurfaceCorner,
  SurfacePadding,
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
  glowIntensityOptions,
  panelHeroTitleElementOptions,
  panelHeroVariantOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelPaddingOptions,
} from "../../shared/options";

export const PanelHeroPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelHeroVariant>("gradient");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [titleSize, setTitleSize] = useState<ControlSize>("sm");
  const [subtitleSize, setSubtitleSize] = useState<ControlSize>("xs");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [decoration, setDecoration] = useState<PanelDecoration>("both");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [titleAs, setTitleAs] = useState<PanelHeroTitleElement>("p");

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
                    <ChoiceControl
                      label="Variant"
                      options={panelHeroVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as PanelHeroVariant)}
                    />
                    {/* Tone is a colour decision — pick it from colour
                        swatches, not from a dropdown of words. */}
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
                      label="Title size"
                      options={controlSizeOptions}
                      value={titleSize}
                      onChange={(v) => setTitleSize(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Subtitle size"
                      options={controlSizeOptions}
                      value={subtitleSize}
                      onChange={(v) => setSubtitleSize(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Padding"
                      options={panelPaddingOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)}
                    />
                    <ChoiceControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <ChoiceControl
                      label="Decoration"
                      options={panelDecorationOptions}
                      value={decoration}
                      onChange={(v) => setDecoration(v as PanelDecoration)}
                    />
                    <ChoiceControl
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
                    <ChoiceControl
                      label="Title element"
                      options={panelHeroTitleElementOptions}
                      value={titleAs}
                      onChange={(v) => setTitleAs(v as PanelHeroTitleElement)}
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
            hand-written table used. Every other variant is a <code>Panel</code>
            , and takes its copy colour from the surface instead of being forced
            to white.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-2xl">
          <PanelHero
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
