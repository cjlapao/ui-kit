import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  KeyValueArrayField,
  MultiToggle,
  Select,
  Toggle,
  Input,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  InputVariant,
  KeyValuePair,
  KeyValueArrayFieldSize,
  KeyValueArrayFieldVariant,
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
  panelVariantOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: KeyValueArrayFieldVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const variantOptions = [
  { label: "Plain", value: "plain" },
  ...panelVariantOptions,
];

const inputVariantOptions: { label: string; value: InputVariant }[] = [
  { label: "Flat", value: "flat" },
  { label: "Elevated", value: "elevated" },
  { label: "Ghost", value: "ghost" },
  { label: "Underline", value: "underline" },
  { label: "Glass", value: "glass" },
];

const sizeOptions: { label: string; value: KeyValueArrayFieldSize }[] = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
];

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

const INITIAL: KeyValuePair[] = [
  { key: "ENV", value: "production" },
  { key: "DEBUG", value: "false" },
  { key: "host", value: "localhost" },
  { key: "port", value: "27017" },
];

export const KeyValueFieldDemo: React.FC = () => {
  const [pairs, setPairs] = useState<KeyValuePair[]>(INITIAL);
  const [variant, setVariant] =
    useState<KeyValueArrayFieldVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [inputVariant, setInputVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<KeyValueArrayFieldSize>("sm");
  const [addLabel, setAddLabel] = useState("Add entry");
  const [withHelp, setWithHelp] = useState(true);
  const [withHint, setWithHint] = useState(true);
  const [withError, setWithError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [flagDuplicates, setFlagDuplicates] = useState(true);
  const [capped, setCapped] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundSection
      title="Key/Value Array"
      label="[KeyValueArrayField]"
      description="Collect arbitrary metadata pairs. Renders a Panel, so it takes every container surface, and its inputs take every input surface."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as KeyValueArrayFieldVariant)
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

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Input surface">
              <MultiToggle
                fullWidth
                size="sm"
                options={inputVariantOptions}
                value={inputVariant}
                onChange={(value) => setInputVariant(value as InputVariant)}
              />
            </Field>
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={size}
                onChange={(value) =>
                  setSize(value as KeyValueArrayFieldSize)
                }
              />
            </Field>
          </div>

          <Field label="Add button label">
            <Input
              size="sm"
              value={addLabel}
              onChange={(event) => setAddLabel(event.target.value)}
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Hint"
              checked={withHint}
              onChange={(event) => setWithHint(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Help text"
              checked={withHelp}
              onChange={(event) => setWithHelp(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Error"
              checked={withError}
              onChange={(event) => setWithError(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Flag duplicate keys"
              checked={flagDuplicates}
              onChange={(event) => setFlagDuplicates(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Cap at 5 rows"
              checked={capped}
              onChange={(event) => setCapped(event.target.checked)}
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
            Set two rows to the same key to see the duplicate flag. Clearing all
            rows shows the empty state. Pair the <strong>glass</strong> input
            surface with a see-through variant.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <KeyValueArrayField
            label="Metadata"
            hint={
              withHint ? "Store extra settings via key/value pairs" : undefined
            }
            help={
              withHelp
                ? "Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised."
                : undefined
            }
            error={withError ? "At least one entry is required." : undefined}
            value={pairs}
            onChange={setPairs}
            addLabel={addLabel}
            variant={variant}
            tone={tone}
            corner={corner}
            padding={padding}
            inputVariant={inputVariant}
            size={size}
            disabled={disabled}
            flagDuplicateKeys={flagDuplicates}
            maxRows={capped ? 5 : undefined}
            glassOpacity={glassOpacity}
            vibrancy={vibrancy}
            specularMode={specularMode}
          />
        </div>
      }
    />
  );
};
