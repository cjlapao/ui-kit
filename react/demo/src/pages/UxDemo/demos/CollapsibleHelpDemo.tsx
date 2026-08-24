import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  CollapsibleHelpText,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  COLLAPSIBLE_HELP_VARIANTS,
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
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: CollapsibleHelpTextVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const variantOptions = COLLAPSIBLE_HELP_VARIANTS.map((value) => ({
  label: value === "card" ? "Card (alias of Outlined)" : titleCase(value),
  value,
}));

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const SHORT_COPY =
  "We encrypt your API tokens client-side using the session keys you configure here.";
const LONG_COPY =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";

export const CollapsibleHelpDemo: React.FC = () => {
  const [tone, setTone] = useState<TrueColor>("emerald");
  const [variant, setVariant] = useState<CollapsibleHelpTextVariant>("card");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [showIcon, setShowIcon] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [longCopy, setLongCopy] = useState(true);
  const [withChildren, setWithChildren] = useState(false);
  const [maxLength, setMaxLength] = useState(130);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

  const isGlass = GLASS_VARIANTS.includes(variant);

  const help = (
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
          Extra content passed as <code>children</code> — always visible,
          whether or not the summary is expanded.
        </span>
      ) : undefined}
    </CollapsibleHelpText>
  );

  return (
    <PlaygroundSection
      title="Collapsible Help Text"
      label="[CollapsibleHelpText]"
      description="Inline helper copy that truncates to a summary and expands for more context. Renders a Panel, so it takes every container surface."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(
                    event.target.value as CollapsibleHelpTextVariant,
                  )
                }
              >
                {variantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Corner">
              <Select
                value={corner}
                disabled={variant === "plain"}
                onChange={(event) =>
                  setCorner(event.target.value as PanelCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Padding">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelPaddingOptions}
                value={padding}
                onChange={(value) => setPadding(value as PanelPadding)}
              />
            </Field>
          </div>

          <Field label={`Max length — ${maxLength} characters`}>
            <input
              type="range"
              min={40}
              max={340}
              value={maxLength}
              onChange={(event) => setMaxLength(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              size="sm"
              label="Title"
              checked={showTitle}
              onChange={(event) => setShowTitle(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Icon"
              checked={showIcon}
              onChange={(event) => setShowIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Long copy"
              checked={longCopy}
              onChange={(event) => setLongCopy(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Extra children"
              checked={withChildren}
              onChange={(event) => setWithChildren(event.target.checked)}
            />
          </div>

          {isGlass && (
            <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
              <Field label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(value) =>
                    setSpecularMode(value as PanelSpecularMode)
                  }
                />
              </Field>
              <Field label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
                />
              </Field>
              <Field label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(value) => setGlassOpacity(value as GlassOpacity)}
                />
              </Field>
            </div>
          )}

          <p className="text-xs opacity-70">
            The summary only truncates when the copy is longer than{" "}
            <strong>max length</strong> — otherwise there is no toggle and no
            chevron.
          </p>
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          {help}
          {/* Dropped inside a glass Panel the app owns: with `plain` the help
              text has no card of its own and inherits that surface, including
              its copy colours. */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
              Inside a glass panel the app owns
            </p>
            <Panel variant="liquid-glass" tone={tone} padding="sm">
              {help}
            </Panel>
          </div>
        </div>
      }
    />
  );
};
