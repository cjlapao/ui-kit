import React, { useMemo, useState } from "react";
import {
  ColorSwatches,
  GradientBackdrop,
  MultiSelectPanel,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  InputVariant,
  MultiSelectPanelLabelAlign,
  MultiSelectPanelOption,
  PillVariant,
  SpecularMode,
  SurfaceCorner,
  SurfacePadding,
  SurfaceTone,
  SurfaceVariant,
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
import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import { HueControl } from "../../shared/HueControl";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  inputVariantOptions,
  multiSelectPanelLabelAlignOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  pillVariantOptions,
  surfaceVariantOptions,
} from "../../shared/options";

/** Card surfaces whose fill is see-through, so the glass controls apply. */
const GLASS_VARIANTS: SurfaceVariant[] = ["glass", "liquid-glass"];

const selectionModeOptions = [
  { label: "Multiple", value: "multiple" },
  { label: "Single", value: "single" },
];

const columnOptions = [1, 2, 3, 4, 5, 6].map((n) => ({
  label: String(n),
  value: String(n),
}));

const BASE_OPTIONS: (MultiSelectPanelOption & {
  icon: string;
  subtitle: string;
  labels: string[];
})[] = [
  {
    value: "text",
    title: "Text",
    subtitle: "Prompt in, prose out",
    icon: "File",
    labels: ["Text"],
  },
  {
    value: "image",
    title: "Image",
    subtitle: "Generated stills up to 4K",
    icon: "Image",
    labels: ["Beta"],
  },
  {
    value: "code",
    title: "Code",
    subtitle: "Syntax-aware completions",
    icon: "Code",
    labels: [],
  },
  {
    value: "structured",
    title: "Structured data",
    subtitle: "JSON validated against your schema",
    icon: "List",
    labels: ["Schema"],
  },
  {
    value: "transcription",
    title: "Transcription Services",
    subtitle: "Audio to text in 24 languages",
    icon: "Chat",
    labels: ["Premium"],
    disabled: true,
  },
];

export const MultiSelectPanelPlayground: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(["text"]);
  const [selectionMode, setSelectionMode] = useState<"multiple" | "single">(
    "multiple",
  );
  const [allowDeselect, setAllowDeselect] = useState(true);
  const [columns, setColumns] = useState(2);
  const [gap, setGap] = useState<ControlSize>("md");
  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<SurfaceVariant>("elevated");
  const [tone, setTone] = useState<SurfaceTone>("blue");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-sm");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  const [checkboxVariant, setCheckboxVariant] = useState<InputVariant>("flat");
  // The three hues a card may keep to itself. `undefined` is the auto answer —
  // box in the card's tone, selection in `borderColor ?? tone`, glow in the
  // selection's hue — which is how a group looks when nobody has an opinion.
  const [checkboxTone, setCheckboxTone] = useState<TrueColor | undefined>(
    undefined,
  );
  const [activeTone, setActiveTone] = useState<TrueColor | undefined>(undefined);
  const [pulseTone, setPulseTone] = useState<TrueColor | undefined>(undefined);
  const [labelTone, setLabelTone] = useState<TrueColor>("blue");
  const [labelVariant, setLabelVariant] = useState<PillVariant>("outline");
  const [labelAlign, setLabelAlign] =
    useState<MultiSelectPanelLabelAlign>("left");
  const [pulse, setPulse] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withLabel, setWithLabel] = useState(true);
  const [withDescription, setWithDescription] = useState(true);
  const [withIcons, setWithIcons] = useState(true);
  const [withSubtitles, setWithSubtitles] = useState(true);
  const [withLabels, setWithLabels] = useState(true);
  const [onGradient, setOnGradient] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");
  const [log, pushLog] = useEventLog();

  const isSingle = selectionMode === "single";
  const isGlass =
    GLASS_VARIANTS.includes(variant) ||
    (inPanel && onGradient) ||
    (onGradient && GLASS_VARIANTS.includes(variant));

  const options = useMemo<MultiSelectPanelOption[]>(
    () =>
      BASE_OPTIONS.map((option) => ({
        ...option,
        icon: withIcons ? option.icon : undefined,
        subtitle: withSubtitles ? option.subtitle : undefined,
        labels: withLabels ? option.labels : undefined,
      })),
    [withIcons, withSubtitles, withLabels],
  );

  const handleChange = (next: string[]) => {
    setSelected(next);
    pushLog(
      next.length
        ? `selected ${next.join(", ")}${isSingle ? "" : ` (${next.length})`}`
        : "cleared",
    );
  };

  const group = (
    <MultiSelectPanel
      name="modality"
      options={options}
      value={selected}
      onChange={handleChange}
      selectionMode={selectionMode}
      allowDeselect={allowDeselect}
      disabled={disabled}
      columns={columns}
      gap={gap}
      size={size}
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      checkboxVariant={checkboxVariant}
      checkboxTone={checkboxTone}
      activeTone={activeTone}
      pulseTone={pulseTone}
      labelTone={labelTone}
      labelVariant={labelVariant}
      labelAlign={labelAlign}
      pulse={pulse}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      label={withLabel ? "Input and output" : undefined}
      description={
        withLabel && withDescription
          ? "What this run accepts and what it can produce."
          : undefined
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
                    <SelectControl
                      label="Columns"
                      options={columnOptions}
                      value={String(columns)}
                      onChange={(v) => setColumns(Number(v))}
                    />
                    <SelectControl
                      label="Gap"
                      options={controlSizeOptions}
                      value={gap}
                      onChange={(v) => setGap(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Card size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Checkbox variant"
                      options={inputVariantOptions}
                      value={checkboxVariant}
                      onChange={(v) => setCheckboxVariant(v as InputVariant)}
                    />
                  </>
                ),
              },
              {
                id: "surface",
                title: "Card surface",
                controls: (
                  <>
                    <SelectControl
                      label="Variant"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)}
                    />
                    <SurfaceToneControl label="Tone" value={tone} onChange={setTone} />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Padding"
                      options={panelPaddingOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)}
                    />
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <ToggleRow
                        label="Pulse"
                        checked={pulse}
                        onChange={setPulse}
                      />
                      <ToggleRow
                        label="Disabled group"
                        checked={disabled}
                        onChange={setDisabled}
                      />
                    </div>
                  </>
                ),
              },
              {
                id: "hues",
                title: "Hues of its own",
                controls: (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Every one of these is also a per-option prop: a single
                      card may outvote the group on any of them.
                    </p>
                    <HueControl
                      label="Checkbox hue"
                      value={checkboxTone}
                      onChange={setCheckboxTone}
                      autoLabel="Auto — the card’s tone"
                    />
                    {/* Each control appears with the state it tints, so an
                        "auto" never sits there painting nothing. */}
                    {selected.length > 0 ? (
                      <HueControl
                        label="Selected hue"
                        value={activeTone}
                        onChange={setActiveTone}
                        autoLabel="Auto — borderColor, then tone"
                      />
                    ) : null}
                    {pulse ? (
                      <HueControl
                        label="Pulse hue"
                        value={pulseTone}
                        onChange={setPulseTone}
                        autoLabel="Auto — the selected hue"
                      />
                    ) : null}
                  </div>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Group label"
                      checked={withLabel}
                      onChange={setWithLabel}
                    />
                    <ToggleRow
                      label="Description"
                      checked={withDescription}
                      onChange={setWithDescription}
                    />
                    <ToggleRow
                      label="Icons"
                      checked={withIcons}
                      onChange={setWithIcons}
                    />
                    <ToggleRow
                      label="Subtitles"
                      checked={withSubtitles}
                      onChange={setWithSubtitles}
                    />
                    <ToggleRow
                      label="Label pills"
                      checked={withLabels}
                      onChange={setWithLabels}
                    />
                    {isSingle && (
                      <ToggleRow
                        label="Allow deselect"
                        checked={allowDeselect}
                        onChange={setAllowDeselect}
                      />
                    )}
                  </div>
                ),
              },
              ...(withLabels
                ? [
                    {
                      id: "labels",
                      title: "Label pills",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <Control label="Pill tone">
                            <ColorSwatches
                              selectable
                              size="sm"
                              value={labelTone}
                              onSelect={setLabelTone}
                              defaultExpanded
                            />
                          </Control>
                          <SelectControl
                            label="Pill variant"
                            options={pillVariantOptions}
                            value={labelVariant}
                            onChange={(v) => setLabelVariant(v as PillVariant)}
                          />
                          <SelectControl
                            label="Pill alignment"
                            options={multiSelectPanelLabelAlignOptions}
                            value={labelAlign}
                            onChange={(v) =>
                              setLabelAlign(v as MultiSelectPanelLabelAlign)
                            }
                          />
                        </div>
                      ),
                    },
                  ]
                : []),
              {
                id: "backdrop",
                title: "Backdrop",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="On a gradient"
                      checked={onGradient}
                      onChange={setOnGradient}
                    />
                    <ToggleRow
                      label="Inside a panel"
                      checked={inPanel}
                      onChange={setInPanel}
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
            The card is the control: click anywhere on it, or focus it and press{" "}
            <em>Space</em>. In <strong>single</strong> mode the group is one tab
            stop and the arrow keys walk and pick; in <strong>multiple</strong>{" "}
            every card is its own tab stop. <strong>Transcription
            Services</strong> is disabled per option, so it never submits.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — pick a card, or arrow through single mode."
          />
        </div>
      }
      preview={
        <div className="w-full space-y-4">
          {onGradient ? (
            <GradientBackdrop theme="fog" noise className="w-full rounded-xl p-4">
              {inPanel ? (
                <Panel corner="none" variant="simple" padding="md" scrollable={false}>
                  <div className="w-full py-2">{group}</div>
                </Panel>
              ) : (
                <div className="w-full py-2">{group}</div>
              )}
            </GradientBackdrop>
          ) : inPanel ? (
            <Panel corner="none" variant="simple" padding="md" scrollable={false}>
              <div className="w-full py-2">{group}</div>
            </Panel>
          ) : (
            <div className="w-full py-2">{group}</div>
          )}
          <div className="rounded-lg border border-black/10 px-3 py-2 font-mono text-xs break-all dark:border-white/10">
            {selected.length
              ? isSingle
                ? `modality=${selected[0]}`
                : selected.map((value) => `modality[]=${value}`).join("&")
              : "— nothing selected —"}
          </div>
        </div>
      }
    />
  );
};
