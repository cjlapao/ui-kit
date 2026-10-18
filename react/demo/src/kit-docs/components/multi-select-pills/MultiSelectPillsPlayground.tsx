import React, { useMemo, useState } from "react";
import { ColorSwatches, MultiSelectPills, Panel } from "@cjlapao/ui-kit";
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
  ChoiceControl,
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  pillCornerOptions,
  pillVariantOptions,
} from "../../shared/options";

/** Variants whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: PillVariant[] = ["glass", "liquid-glass"];

const selectionModeOptions = [
  { label: "Multiple", value: "multiple" },
  { label: "Single", value: "single" },
];

const BASE_OPTIONS: (MultiSelectPillOption & { icon: string })[] = [
  {
    value: "containers",
    label: "Containers",
    icon: "Container",
    description: "42",
  },
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
  const [tone, setTone] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<PillVariant>("solid");
  const [unselectedVariant, setUnselectedVariant] =
    useState<PillVariant>("outline");
  const [size, setSize] = useState<ControlSize>("md");
  const [corner, setCorner] = useState<PillCorner>("full");
  const [gap, setGap] = useState<ControlSize>("sm");
  const [disabled, setDisabled] = useState(false);
  const [allowDeselect, setAllowDeselect] = useState(true);
  const [withIcons, setWithIcons] = useState(true);
  const [withCounts, setWithCounts] = useState(false);
  const [checkmark, setCheckmark] = useState(false);
  const [withLegend, setWithLegend] = useState(true);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");
  const [log, pushLog] = useEventLog();

  const options = useMemo<MultiSelectPillOption[]>(
    () =>
      BASE_OPTIONS.map((option) => ({
        ...option,
        icon: withIcons ? option.icon : undefined,
        description: withCounts ? option.description : undefined,
      })),
    [withIcons, withCounts],
  );

  const isSingle = selectionMode === "single";
  const isGlass =
    GLASS_VARIANTS.includes(variant) ||
    GLASS_VARIANTS.includes(unselectedVariant) ||
    (inPanel && onGlass);

  const handleChange = (next: string[]) => {
    setSelected(next);
    pushLog(
      next.length
        ? `selected ${next.join(", ")}${isSingle ? "" : ` (${next.length})`}`
        : "cleared",
    );
  };

  const group = (
    <MultiSelectPills
      name="resources"
      options={options}
      value={selected}
      onChange={handleChange}
      selectionMode={selectionMode}
      tone={tone}
      variant={variant}
      unselectedVariant={unselectedVariant}
      size={size}
      corner={corner}
      gap={gap}
      disabled={disabled}
      allowDeselect={allowDeselect}
      checkmark={checkmark}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      legend={withLegend ? "Resources to include" : undefined}
      description={
        withLegend ? "Pick what the backup job should snapshot." : undefined
      }
    />
  );

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
                      label="Selection mode"
                      options={selectionModeOptions}
                      value={selectionMode}
                      onChange={(v) =>
                        setSelectionMode(v as "multiple" | "single")
                      }
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
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
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Corner"
                      options={pillCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as PillCorner)}
                    />
                    <SelectControl
                      label="Gap"
                      options={controlSizeOptions}
                      value={gap}
                      onChange={(v) => setGap(v as ControlSize)}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Icons"
                      checked={withIcons}
                      onChange={setWithIcons}
                    />
                    <ToggleRow
                      label="Counts"
                      checked={withCounts}
                      onChange={setWithCounts}
                    />
                    <ToggleRow
                      label="Check mark"
                      checked={checkmark}
                      onChange={setCheckmark}
                    />
                    <ToggleRow
                      label="Legend"
                      checked={withLegend}
                      onChange={setWithLegend}
                    />
                    {isSingle && (
                      <ToggleRow
                        label="Allow deselect"
                        checked={allowDeselect}
                        onChange={setAllowDeselect}
                      />
                    )}
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                  </div>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="In a panel"
                      checked={inPanel}
                      onChange={setInPanel}
                    />
                    <ToggleRow
                      label="On a glass panel"
                      checked={onGlass}
                      onChange={(v) => {
                        setOnGlass(v);
                        if (v) setInPanel(true);
                      }}
                    />
                  </div>
                ),
              },
              ...(isGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <ChoiceControl
                            label="Specular"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(v) => setSpecularMode(v as SpecularMode)}
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
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs opacity-70">
            <strong>Single</strong> mode is a real radio group: one tab stop,
            arrows (and <em>Home</em>/<em>End</em>) walk and pick the options,
            and a form submits <code>resources=&hellip;</code>, not{" "}
            <code>resources[]=</code>&hellip; Turn{" "}
            <strong>Allow deselect</strong> off to make the choice required.{" "}
            <strong>Multiple</strong> mode is a checkbox group — every pill is
            its own tab stop and toggles with
            <em> Space</em>. <strong>Registry</strong> is a per-option disabled
            pill either way.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — toggle a pill, or arrow through single mode."
          />
        </div>
      }
      preview={
        <div className="w-full space-y-4">
          {inPanel ? (
            <Panel
              // Corner-free: the pills are the furniture; a rounded host
              // hugging bare controls reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              specularMode={onGlass ? specularMode : "none"}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              padding="md"
              scrollable={false}
            >
              <div className="w-full py-2">{group}</div>
            </Panel>
          ) : (
            <div className="w-full py-2">{group}</div>
          )}
          <div className="rounded-lg border border-black/10 px-3 py-2 font-mono text-xs break-all dark:border-white/10">
            {selected.length
              ? isSingle
                ? `resources=${selected[0]}`
                : selected.map((value) => `resources[]=${value}`).join("&")
              : "— nothing selected —"}
          </div>
        </div>
      }
    />
  );
};
