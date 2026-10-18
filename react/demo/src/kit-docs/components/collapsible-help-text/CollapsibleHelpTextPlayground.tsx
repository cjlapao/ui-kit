import React, { useState } from "react";
import {
  CollapsibleHelpText,
  ColorSwatches,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  CollapsibleHelpTextVariant,
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
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
  collapsibleHelpVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: CollapsibleHelpTextVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const SHORT_COPY =
  "We encrypt your API tokens client-side using the session keys you configure here.";
const LONG_COPY =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";

export const CollapsibleHelpTextPlayground: React.FC = () => {
  const [variant, setVariant] =
    useState<CollapsibleHelpTextVariant>("card");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] =
    useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [showIcon, setShowIcon] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [longCopy, setLongCopy] = useState(true);
  const [withChildren, setWithChildren] = useState(false);
  const [maxLength, setMaxLength] = useState(130);
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
                    options={collapsibleHelpVariantOptions}
                    value={variant}
                    onChange={(v) => setVariant(v as CollapsibleHelpTextVariant)}
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
              id: "content",
              title: "Content",
              controls: (
                <>
                  <Control label={`Max length — ${maxLength} characters`}>
                    <input
                      type="range"
                      min={40}
                      max={340}
                      value={maxLength}
                      onChange={(event) => setMaxLength(Number(event.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </Control>
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow label="Title" checked={showTitle} onChange={setShowTitle} />
                    <ToggleRow label="Icon" checked={showIcon} onChange={setShowIcon} />
                    <ToggleRow
                      label="Long copy"
                      checked={longCopy}
                      onChange={setLongCopy}
                    />
                    <ToggleRow
                      label="Extra children"
                      checked={withChildren}
                      onChange={setWithChildren}
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
            <CollapsibleHelpText
              title={
                showTitle
                  ? longCopy
                    ? "Why we ask for reviews"
                    : "Secret tokens"
                  : undefined
              }
              text={longCopy ? LONG_COPY : SHORT_COPY}
              showIcon={showIcon}
              tone={tone}
              variant={variant}
              corner={corner}
              padding={padding}
              maxLength={maxLength}
              glassOpacity={glassOpacity}
              vibrancy={vibrancy}
              specularMode={specularMode}
            >
              {withChildren ? (
                <span>
                  Extra content passed as <code>children</code> — always
                  visible, whether or not the summary is expanded.
                </span>
              ) : undefined}
            </CollapsibleHelpText>
          </div>
      }
    >
    </PlaygroundPanel>
  );
};
