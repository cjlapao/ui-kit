import React, { useState } from "react";
import { SmartGridLayout, SMART_GRID_VARIANTS } from "@cjlapao/ui-kit";
import type { ControlSize, SmartGridVariant, TrueColor } from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";
import { DASHBOARD_ITEMS, PLAYGROUND_LAYOUT } from "./shared";

const columnOptions = [4, 6, 8, 12].map((n) => ({
  label: String(n),
  value: String(n),
}));

export const SmartGridLayoutPlayground: React.FC = () => {
  const [variant, setVariant] = useState<SmartGridVariant>("plain");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [surfaceTone, setSurfaceTone] = useState<TrueColor>("neutral");
  const [size, setSize] = useState<ControlSize>("md");
  const [maxColumns, setMaxColumns] = useState("12");
  const [persist, setPersist] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [responsive, setResponsive] = useState(false);

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
                      label="Variant"
                      options={SMART_GRID_VARIANTS.map((v) => ({ label: v, value: v }))}
                      value={variant}
                      onChange={(v) => setVariant(v as SmartGridVariant)}
                    />
                    <ChoiceControl label="Edit accent" options={trueColorOptions}
                      value={tone} onChange={(v) => setTone(v as TrueColor)} />
                    <ChoiceControl label="Surface tone" options={trueColorOptions}
                      value={surfaceTone} onChange={(v) => setSurfaceTone(v as TrueColor)} />
                    <ChoiceControl label="Size" options={controlSizeOptions}
                      value={size} onChange={(v) => setSize(v as ControlSize)} />
                    <ChoiceControl label="Columns" options={columnOptions}
                      value={maxColumns} onChange={setMaxColumns} />
                  </>
                ),
              },
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <Control label="Behaviour">
                    <div className="space-y-1.5">
                      <ToggleRow label="Edit mode" checked={editMode} onChange={setEditMode} />
                      <ToggleRow label="Persist to localStorage" checked={persist} onChange={setPersist} />
                      <ToggleRow label="Read-only" checked={readOnly} onChange={setReadOnly} />
                      <ToggleRow label="Responsive columns" checked={responsive} onChange={setResponsive} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Turn on <strong>Edit mode</strong> and drag a tile, or focus a
            resize handle and use the left and right arrows — the handles were
            mouse-only before. <strong>Persist</strong> adds a{" "}
            <code>storageKey</code>, which is the entire opt-in: the layout is
            restored on mount and saved after every change, exactly as{" "}
            <code>Table</code> does it. <strong>Edit accent</strong> is
            separate from <strong>surface tone</strong> so the accent has
            something to stand out against.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <SmartGridLayout
            key={`${persist}`}
            items={DASHBOARD_ITEMS}
            defaultLayout={PLAYGROUND_LAYOUT}
            variant={variant}
            tone={tone}
            surfaceTone={surfaceTone}
            size={size}
            maxColumns={
              responsive
                ? { base: 4, md: 8, lg: Number(maxColumns) }
                : Number(maxColumns)
            }
            readOnly={readOnly}
            isEditMode={editMode}
            onEditModeChange={setEditMode}
            storageKey={persist ? "playground-dashboard" : undefined}
          />
        </div>
      }
    />
  );
};
