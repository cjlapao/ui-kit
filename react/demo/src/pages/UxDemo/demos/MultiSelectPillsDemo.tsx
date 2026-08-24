import React, { useMemo, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { MultiSelectPills, MultiToggle, Panel, Select, Toggle } from "@cjlapao/ui-kit";
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
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  pillCornerOptions,
  pillVariantOptions,
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

export const MultiSelectPillsDemo: React.FC = () => {
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
    GLASS_VARIANTS.includes(variant) ||
    GLASS_VARIANTS.includes(unselectedVariant);

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

  const preview = (
    <div className="space-y-6">
      <MultiSelectPills
        {...shared}
        name="resources"
        value={selected}
        onChange={setSelected}
        legend={withLegend ? "Resources to include" : undefined}
        description={
          withLegend ? "Pick what the backup job should snapshot." : undefined
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

      <div className="flex flex-col gap-2">
        <Caption>Uncontrolled — it keeps its own state</Caption>
        <MultiSelectPills
          {...shared}
          name="uncontrolled"
          defaultValue={["volumes"]}
        />
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Multi Select Pills"
      label="[MultiSelectPills]"
      description="A row of pills used as a checkbox or radio group. It renders the kit's Pill, so it inherits every variant, tone, size and corner — including the glass pair."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Selection mode">
              <MultiToggle
                fullWidth
                size="sm"
                options={selectionModeOptions}
                value={selectionMode}
                onChange={(value) =>
                  setSelectionMode(value as "multiple" | "single")
                }
              />
            </Field>
            <Field label="Tone">
              <Select
                value={color}
                onChange={(event) => setColor(event.target.value as TrueColor)}
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
            <Field label="Selected variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as PillVariant)
                }
              >
                {pillVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Unselected variant">
              <Select
                value={unselectedVariant}
                onChange={(event) =>
                  setUnselectedVariant(event.target.value as PillVariant)
                }
              >
                {pillVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(value) => setSize(value as ControlSize)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Corner">
              <MultiToggle
                fullWidth
                size="sm"
                options={pillCornerOptions}
                value={rounded}
                onChange={(value) => setRounded(value as PillCorner)}
              />
            </Field>
            <Field label="Gap">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={gap}
                onChange={(value) => setGap(value as ControlSize)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Icons"
              checked={withIcons}
              onChange={(event) => setWithIcons(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Counts"
              checked={withCounts}
              onChange={(event) => setWithCounts(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Check mark"
              checked={checkmark}
              onChange={(event) => setCheckmark(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Legend"
              checked={withLegend}
              onChange={(event) => setWithLegend(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Allow deselect"
              checked={allowDeselect}
              onChange={(event) => setAllowDeselect(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
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
            <strong>Single</strong> mode behaves like a radio group; turn{" "}
            <strong>Allow deselect</strong> off to make the choice required.
            <strong> Registry</strong> is a per-option disabled pill — it stays
            unclickable even when the group is enabled. <strong>Check mark</strong>{" "}
            swaps a selected pill's icon for a tick, so the state is not carried
            by colour alone. Each pill carries{" "}
            <code>aria-pressed</code>; the hidden checkbox beside it exists only
            to carry the value to a form submit.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
