import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Badge,
  MultiToggle,
  Panel,
  Pill,
  Select,
  Toggle,
  PILL_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PillSize,
  PillTone,
  PillVariant,
  SpecularMode,
} from "@cjlapao/ui-kit";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../constants";

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

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const variantOptions = PILL_VARIANTS.map((value) => ({
  label: titleCase(value),
  value,
}));

const sizeOptions: { label: string; value: PillSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const INITIAL_TAGS = ["production", "eu-west-1", "orchestrator", "v2.14.0"];

export const PillDemo: React.FC = () => {
  const [tone, setTone] = useState<PillTone>("blue");
  const [variant, setVariant] = useState<PillVariant>("soft");
  const [size, setSize] = useState<PillSize>("md");
  const [uppercase, setUppercase] = useState(false);
  const [withIcon, setWithIcon] = useState(true);
  const [withTrailingIcon, setWithTrailingIcon] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [truncate, setTruncate] = useState(false);
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [clicked, setClicked] = useState<string | null>(null);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode | undefined>(
    undefined,
  );

  const isGlass = variant === "glass" || variant === "liquid-glass";

  const shared = {
    tone,
    variant,
    size,
    uppercase,
    disabled,
    icon: withIcon ? "Check" : undefined,
    trailingIcon: withTrailingIcon ? "ArrowRight" : undefined,
    maxWidth: truncate ? 140 : undefined,
    glassOpacity,
    vibrancy,
    specularMode,
  };

  return (
    <PlaygroundSection
      title="Pills"
      label="[Pill]"
      description="Small labels for status and metadata. Three variants, the full tone set, optional icons, a remove button, and a bare status dot."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as PillTone)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Variant">
              <MultiToggle
                fullWidth
                size="sm"
                options={variantOptions}
                value={variant}
                onChange={(value) => setVariant(value as PillVariant)}
              />
            </Field>
          </div>

          <Field label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={sizeOptions}
              value={size}
              onChange={(value) => setSize(value as PillSize)}
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Uppercase"
              checked={uppercase}
              onChange={(event) => setUppercase(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Leading icon"
              checked={withIcon}
              onChange={(event) => setWithIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Trailing icon"
              checked={withTrailingIcon}
              onChange={(event) => setWithTrailingIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Clickable"
              checked={clickable}
              onChange={(event) => setClickable(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Truncate long labels"
              checked={truncate}
              onChange={(event) => setTruncate(event.target.checked)}
            />
          </div>

          {isGlass && (
            <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
              <Field label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={
                    specularMode ??
                    (variant === "liquid-glass" ? "classic" : "none")
                  }
                  onChange={(value) => setSpecularMode(value as SpecularMode)}
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
            The <strong>glass</strong> variants drop the tone fill and take a
            translucent one instead — switch the playground background image on
            to see them properly. <strong>Clickable</strong> renders a real{" "}
            <code>&lt;button&gt;</code>
            . Removing a tag never activates the pill it sits in.
            {clicked && ` Last clicked: ${clicked}.`}
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={isGlass ? "liquid-glass" : "outlined"}
            tone={isGlass ? tone : "neutral"}
            padding="md"
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Caption>Current settings</Caption>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill
                    {...shared}
                    onClick={
                      clickable ? () => setClicked("Operational") : undefined
                    }
                  >
                    Operational
                  </Pill>
                  <Pill {...shared} onClick={clickable ? () => setClicked("A long label that runs on") : undefined}>
                    A long label that runs on
                  </Pill>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Every variant</Caption>
                <div className="flex flex-wrap items-center gap-3">
                  {PILL_VARIANTS.map((each) => (
                    <Pill key={each} {...shared} variant={each}>
                      {each}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Size ladder — pill and dot</Caption>
                <div className="flex flex-wrap items-center gap-4">
                  {sizeOptions.map(({ value }) => (
                    <span key={value} className="flex items-center gap-1.5">
                      <Pill {...shared} size={value}>
                        {value}
                      </Pill>
                      <Pill {...shared} size={value} dot label={`Status ${value}`} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>A dot lines up with a Badge dot at the same size</Caption>
                <div className="flex items-center gap-4">
                  {sizeOptions.map(({ value }) => (
                    <span key={value} className="flex items-center gap-1">
                      <Pill tone={tone} variant="solid" size={value} dot />
                      <Badge tone={tone} size={value} dot />
                      <span className="text-[10px] opacity-60">{value}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Every tone</Caption>
                <div className="flex flex-wrap gap-1.5">
                  {TRUE_COLORS.map((each) => (
                    <Pill key={each} variant={variant} size="xs" tone={each}>
                      {each}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Removable tags</Caption>
                <div className="flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <Pill
                      key={tag}
                      tone={tone}
                      variant={variant}
                      size={size}
                      icon="Key"
                      onRemove={() =>
                        setTags((previous) => previous.filter((t) => t !== tag))
                      }
                      onClick={clickable ? () => setClicked(tag) : undefined}
                    >
                      {tag}
                    </Pill>
                  ))}
                  {tags.length === 0 && (
                    <button
                      type="button"
                      className="text-xs underline opacity-70"
                      onClick={() => setTags(INITIAL_TAGS)}
                    >
                      Reset tags
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      }
    />
  );
};
