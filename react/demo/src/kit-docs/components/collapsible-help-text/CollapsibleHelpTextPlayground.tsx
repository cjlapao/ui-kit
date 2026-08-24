import React, { useState } from "react";
import {
  CollapsibleHelpText,
  DEFAULT_SURFACE_CORNER,
  MultiToggle,
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
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  collapsibleHelpVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  trueColorOptions,
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
  const [tone, setTone] = useState<TrueColor>("emerald");
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
        <>
          <SelectControl
            label="Variant"
            options={collapsibleHelpVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as CollapsibleHelpTextVariant)}
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
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
