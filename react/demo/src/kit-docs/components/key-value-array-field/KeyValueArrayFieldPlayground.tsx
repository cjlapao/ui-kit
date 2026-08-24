import React, { useState } from "react";
import {
  DEFAULT_SURFACE_CORNER,
  Input,
  KeyValueArrayField,
  MultiToggle,
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
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  inputVariantOptions,
  keyValueSizeOptions,
  keyValueVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: KeyValueArrayFieldVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const INITIAL: KeyValuePair[] = [
  { key: "ENV", value: "production" },
  { key: "DEBUG", value: "false" },
  { key: "host", value: "localhost" },
  { key: "port", value: "27017" },
];

export const KeyValueArrayFieldPlayground: React.FC = () => {
  const [pairs, setPairs] = useState(INITIAL);
  const [variant, setVariant] =
    useState<KeyValueArrayFieldVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] =
    useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [inputVariant, setInputVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<KeyValueArrayFieldSize>("sm");
  const [addLabel, setAddLabel] = useState("Add entry");
  const [withHint, setWithHint] = useState(true);
  const [withHelp, setWithHelp] = useState(true);
  const [withError, setWithError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [flagDuplicates, setFlagDuplicates] = useState(true);
  const [capped, setCapped] = useState(false);
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
            options={keyValueVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as KeyValueArrayFieldVariant)}
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
          <Control label="Input surface">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={inputVariant}
              onChange={(v) => setInputVariant(v as InputVariant)}
            />
          </Control>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={keyValueSizeOptions}
              value={size}
              onChange={(v) => setSize(v as KeyValueArrayFieldSize)}
            />
          </Control>
          <Control label="Add button label">
            <Input
              size="sm"
              value={addLabel}
              onChange={(event) => setAddLabel(event.target.value)}
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Hint" checked={withHint} onChange={setWithHint} />
            <ToggleRow
              label="Help text"
              checked={withHelp}
              onChange={setWithHelp}
            />
            <ToggleRow
              label="Error"
              checked={withError}
              onChange={setWithError}
            />
            <ToggleRow
              label="Disabled"
              checked={disabled}
              onChange={setDisabled}
            />
            <ToggleRow
              label="Flag duplicate keys"
              checked={flagDuplicates}
              onChange={setFlagDuplicates}
            />
            <ToggleRow
              label="Cap at 5 rows"
              checked={capped}
              onChange={setCapped}
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
            <KeyValueArrayField
              label="Metadata"
              hint={withHint ? "Store extra settings via key/value pairs" : undefined}
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
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
