import React, { useState } from "react";
import {
  CustomColorSwatches,
  type ControlSize,
  type SwatchColor,
  type SwatchDualValue,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, ChoiceControl, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

const MODE_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "dual", label: "Dual" },
];

const PALETTE_OPTIONS = [
  { value: "all", label: "All tones" },
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
];

const PALETTES: Record<string, readonly TrueColor[] | undefined> = {
  // `undefined` lets the component's own TRUE_COLORS default stand.
  all: undefined,
  warm: ["red", "orange", "amber", "yellow", "lime", "rose"],
  cool: ["teal", "cyan", "sky", "blue", "indigo", "violet"],
};

const EXPAND_OPTIONS = [
  { value: "click", label: "Click the +N" },
  { value: "hover", label: "Hover the row" },
];

export const CustomColorSwatchesPlayground: React.FC = () => {
  const [mode, setMode] = useState<"single" | "dual">("dual");
  const [size, setSize] = useState<ControlSize>("md");
  const [palette, setPalette] = useState("all");
  const [disabled, setDisabled] = useState(false);
  const [persist, setPersist] = useState(false);
  const [withExtras, setWithExtras] = useState(false);
  const [condense, setCondense] = useState(false);
  const [expandOn, setExpandOn] = useState<"click" | "hover">("click");
  const [selected, setSelected] = useState<
    SwatchColor | SwatchDualValue | null
  >(null);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <SelectControl label="Size" options={controlSizeOptions} value={size}
                    onChange={(v) => setSize(v as ControlSize)} />
                ),
              },
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <>
                    <ChoiceControl label="Mode" options={MODE_OPTIONS} value={mode}
                      onChange={(v) => { setMode(v as "single" | "dual"); setSelected(null); }} />
                    <ChoiceControl label="Palette" options={PALETTE_OPTIONS} value={palette}
                      onChange={(v) => { setPalette(v); setSelected(null); }} />
                    <ToggleRow label="disabled" checked={disabled} onChange={setDisabled} />
                    <ToggleRow label="persist saves" checked={persist} onChange={setPersist} />
                    <ToggleRow label="load extras" checked={withExtras} onChange={setWithExtras} />
                    <ToggleRow label="condense row" checked={condense} onChange={setCondense} />
                    {condense && (
                      <ChoiceControl label="Expand on" options={EXPAND_OPTIONS} value={expandOn}
                        onChange={(v) => setExpandOn(v as "click" | "hover")} />
                    )}
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Dual pills expand for their hex on hover, focus and selection;
            click the chosen one to override its text ink. The rainbow entry
            opens the OS colour picker — and what you commit stays saved as
            its own pill: click it to select, click it again to edit, × to
            forget. “Persist saves” writes them to localStorage; “load extras”
            merges brand colours into the row; “condense row” folds the whole
            strip ColorSwatches-style behind a +N chip.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
            CustomColorSwatches
          </div>
          <CustomColorSwatches
            key={`${mode}-${palette}-${persist}-${withExtras}-${condense}-${expandOn}`}
            mode={mode}
            size={size}
            disabled={disabled}
            colors={PALETTES[palette]}
            storageKey={persist ? "playground" : undefined}
            extraColors={
              withExtras ? ["#f97316", "#7c3aed", "#0d9488"] : undefined
            }
            maxVisible={condense ? 6 : undefined}
            expandOn={expandOn}
            value={selected}
            onChange={setSelected}
          />
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            {selected
              ? JSON.stringify(selected)
              : "Nothing selected — pick a swatch."}
          </p>
        </div>
      }
    />
  );
};
