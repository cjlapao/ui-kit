import React, { useMemo, useState } from "react";
import {
  MultiSelectPills,
  MultiToggle,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  MultiSelectPillOption,
  PillCorner,
  PillVariant,
  SpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  pillCornerOptions,
  pillVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PillVariant[] = ["glass", "liquid-glass"];

const selectionModeOptions = [
  { label: "Multiple", value: "multiple" },
  { label: "Single", value: "single" },
];

const BASE_OPTIONS: (MultiSelectPillOption & { icon: string })[] = [
  { value: "containers", label: "Containers", icon: "Container", description: "42" },
  { value: "images", label: "Images", icon: "Docker", description: "17" },
  { value: "volumes", label: "Volumes", icon: "Save", description: "8" },
  { value: "networks", label: "Networks", icon: "Globe", description: "3" },
  { value: "secrets", label: "Secrets", icon: "Key", description: "0" },
  { value: "registry", label: "Registry", icon: "Cache", disabled: true },
];

export const MultiSelectPillsPlayground: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(["containers", "images"]);
  const [selectionMode, setSelectionMode] = useState<"multiple" | "single">(
    "multiple",
  );
  const [color, setColor] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<PillVariant>("solid");
  const [unselectedVariant, setUnselectedVariant] =
    useState<PillVariant>("outline");
  const [size, setSize] = useState<ControlSize>("sm");
  const [rounded, setRounded] = useState<PillCorner>("full");
  const [gap, setGap] = useState<ControlSize>("sm");
  const [disabled, setDisabled] = useState(false);
  const [allowDeselect, setAllowDeselect] = useState(true);
  const [withIcons, setWithIcons] = useState(true);
  const [withCounts, setWithCounts] = useState(false);
  const [checkmark, setCheckmark] = useState(false);
  const [withLegend, setWithLegend] = useState(true);
  const [onGlass, setOnGlass] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");

  const options = useMemo<MultiSelectPillOption[]>(
    () =>
      BASE_OPTIONS.map((option) => ({
        ...option,
        icon: withIcons ? option.icon : undefined,
        description: withCounts ? option.description : undefined,
      })),
    [withIcons, withCounts],
  );

  const isGlass =
    GLASS_VARIANTS.includes(variant) || GLASS_VARIANTS.includes(unselectedVariant);

  const shared = {
    options,
    selectionMode,
    color,
    variant,
    unselectedVariant,
    size,
    rounded,
    gap,
    disabled,
    allowDeselect,
    checkmark,
    glassOpacity,
    vibrancy,
    specularMode,
  };

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Selection mode">
            <MultiToggle
              fullWidth
              size="sm"
              options={selectionModeOptions}
              value={selectionMode}
              onChange={(v) => setSelectionMode(v as "multiple" | "single")}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={color}
            onChange={(v) => setColor(v as TrueColor)}
          />
          <SelectControl
            label="Selected variant"
            options={pillVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as PillVariant)}
          />
          <SelectControl
            label="Unselected variant"
            options={pillVariantOptions}
            value={unselectedVariant}
            onChange={(v) => setUnselectedVariant(v as PillVariant)}
          />
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(v) => setSize(v as ControlSize)}
            />
          </Control>
          <Control label="Corner">
            <MultiToggle
              fullWidth
              size="sm"
              options={pillCornerOptions}
              value={rounded}
              onChange={(v) => setRounded(v as PillCorner)}
            />
          </Control>
          <Control label="Gap">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={gap}
              onChange={(v) => setGap(v as ControlSize)}
            />
          </Control>
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Icons" checked={withIcons} onChange={setWithIcons} />
            <ToggleRow label="Counts" checked={withCounts} onChange={setWithCounts} />
            <ToggleRow label="Check mark" checked={checkmark} onChange={setCheckmark} />
            <ToggleRow label="Legend" checked={withLegend} onChange={setWithLegend} />
            <ToggleRow
              label="Allow deselect"
              checked={allowDeselect}
              onChange={setAllowDeselect}
            />
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
            <ToggleRow label="On a glass panel" checked={onGlass} onChange={setOnGlass} />
          </div>
          {isGlass && (
            <div className="flex flex-col gap-3">
              <Control label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(v) => setSpecularMode(v as SpecularMode)}
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
            </div>
          )}
          <p className="text-xs opacity-70">
            <strong>Single</strong> mode behaves like a radio group; turn{" "}
            <strong>Allow deselect</strong> off to make the choice required.{" "}
            <strong>Registry</strong> is a per-option disabled pill. Each pill
            carries <code>aria-pressed</code>.
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            <div className="flex flex-col gap-5">
              <MultiSelectPills
                {...shared}
                name="resources"
                value={selected}
                onChange={setSelected}
                legend={withLegend ? "Resources to include" : undefined}
                description={
                  withLegend
                    ? "Pick what the backup job should snapshot."
                    : undefined
                }
              />
              <div className="flex flex-col gap-2">
                <Caption>What a form submit would carry</Caption>
                <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
                  {selected.length
                    ? selected.map((value) => `resources[]=${value}`).join("&")
                    : "— nothing selected —"}
                </code>
              </div>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
