import React, { useState } from "react";
import { ColorSwatches, type ControlSize, type SurfacePadding, type TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, ChoiceControl, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, panelPaddingOptions } from "../../shared/options";

const EXPAND_ON_OPTIONS = [
  { value: "click", label: "Click" },
  { value: "hover", label: "Hover" },
];

const MAX_VISIBLE_OPTIONS = [
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "8", label: "8" },
];

export const ColorSwatchesPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("lg");
  const [padding, setPadding] = useState<SurfacePadding>("none");
  const [expandOn, setExpandOn] = useState<"click" | "hover">("click");
  const [maxVisible, setMaxVisible] = useState(5);
  const [showNames, setShowNames] = useState(false);
  const [defaultExpanded, setDefaultExpanded] = useState(false);
  const [selectable, setSelectable] = useState(false);
  const [selected, setSelected] = useState<TrueColor>("blue");

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
                  <>
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Padding" options={panelPaddingOptions} value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)} />
                  </>
                ),
              },
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <>
                    <ChoiceControl label="Expand on" options={EXPAND_ON_OPTIONS} value={expandOn}
                      onChange={(v) => setExpandOn(v as "click" | "hover")} />
                    <ChoiceControl label="Max visible" options={MAX_VISIBLE_OPTIONS}
                      value={String(maxVisible)} onChange={(v) => setMaxVisible(Number(v))} />
                    <ToggleRow label="showNames" checked={showNames} onChange={setShowNames} />
                    <ToggleRow label="defaultExpanded" checked={defaultExpanded} onChange={setDefaultExpanded} />
                    <ToggleRow label="selectable" checked={selectable} onChange={setSelectable} />
                    {selectable && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Chosen: <code>{selected}</code>
                      </p>
                    )}
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Twenty-one tones in one row would shout; condensed, they overlap
            behind a <code>+N</code> and expand on demand. Resize the window —
            a strip too narrow for its dots condenses on its own.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
            TrueColors
          </div>
          <ColorSwatches
            key={`${expandOn}-${defaultExpanded}`}
            size={size}
            padding={padding}
            expandOn={expandOn}
            maxVisible={maxVisible}
            showNames={showNames}
            defaultExpanded={defaultExpanded}
            selectable={selectable}
            value={selected}
            onSelect={setSelected}
          />
        </div>
      }
    />
  );
};
