import React, { useRef, useState } from "react";
import {
  ColorSwatches,
  Input,
  KeyValueArrayField,
  Panel,
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
  inputVariantOptions,
  keyValueVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
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
  const [variant, setVariant] = useState<KeyValueArrayFieldVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>("auto");
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [inputVariant, setInputVariant] = useState<"auto" | InputVariant>(
    "auto",
  );
  const [size, setSize] = useState<KeyValueArrayFieldSize>("sm");
  const [addLabel, setAddLabel] = useState("");
  const [withHint, setWithHint] = useState(true);
  const [withHelp, setWithHelp] = useState(true);
  const [withError, setWithError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [flagDuplicates, setFlagDuplicates] = useState(true);
  const [capped, setCapped] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

  const isGlass = GLASS_VARIANTS.includes(variant);

  const [log, pushLog] = useEventLog();
  const prev = useRef(pairs);
  const handleChange = (next: KeyValuePair[]) => {
    const before = prev.current;
    if (next.length > before.length) pushLog("row added — onChange fired");
    else if (next.length < before.length) {
      const removed = before.find((p) => !next.includes(p));
      pushLog(
        `row removed${removed?.key ? ` — \`${removed.key}\`` : ""} — onChange fired`,
      );
    } else {
      const touched = next.findIndex((p, i) => p !== before[i]);
      if (touched >= 0) {
        const changedKey = next[touched].key !== before[touched].key;
        pushLog(
          `${changedKey ? "key" : "value"} edited on row ${touched + 1} — onChange fired`,
        );
      }
    }
    prev.current = next;
    setPairs(next);
  };

  const field = (
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
      onChange={handleChange}
      addLabel={addLabel || undefined}
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
                    <SelectControl
                      label="Variant"
                      options={keyValueVariantOptions}
                      value={variant}
                      onChange={(v) =>
                        setVariant(v as KeyValueArrayFieldVariant)
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
                      label="Controls variant"
                      options={[
                        { label: "Auto (follow variant)", value: "auto" },
                        ...inputVariantOptions,
                      ]}
                      value={inputVariant}
                      onChange={(v) =>
                        setInputVariant(v as "auto" | InputVariant)
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <SelectControl
                        label="Corner"
                        options={panelCornerOptions}
                        value={corner}
                        onChange={(v) => setCorner(v as PanelCorner)}
                      />
                      <SelectControl
                        label="Padding"
                        options={panelPaddingOptions}
                        value={padding}
                        onChange={(v) => setPadding(v as PanelPadding)}
                      />
                    </div>
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as KeyValueArrayFieldSize)}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <Control label="Add button label">
                      <Input
                        size="sm"
                        placeholder="Add entry (translated)"
                        value={addLabel}
                        onChange={(event) => setAddLabel(event.target.value)}
                      />
                    </Control>
                    <div className="grid grid-cols-1 gap-2">
                      <ToggleRow
                        label="Hint"
                        checked={withHint}
                        onChange={setWithHint}
                      />
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
                  </>
                ),
              },
              ...(isGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <>
                          <ChoiceControl
                            label="Specular"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(v) =>
                              setSpecularMode(v as PanelSpecularMode)
                            }
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
                        </>
                      ),
                    },
                  ]
                : []),
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <ToggleRow
                      label="In a panel"
                      checked={inPanel}
                      onChange={setInPanel}
                    />
                    {inPanel && (
                      <ToggleRow
                        label="On a glass panel"
                        checked={onGlass}
                        onChange={setOnGlass}
                      />
                    )}
                  </>
                ),
              },
            ]}
          />
          <EventLogControl log={log} emptyText="No events yet — edit a row." />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Every change — a keystroke, a row added or removed — arrives through
            the same <code>onChange</code> as the whole array; the log reads the
            delta it carried. With a <code>plain</code> card surface the field
            is bare furniture, meant to sit inside a card you already have — the
            toggles above show exactly that. The add button follows the
            inputs&rsquo; variant (a glass card wins), and every string, down to
            a row&rsquo;s <em>Remove key 1</em>, rides the catalog.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the field is the furniture; a rounded host
              // hugging a plain card reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="w-full py-2">{field}</div>
            </Panel>
          ) : (
            <div className="w-full py-2">{field}</div>
          )}
        </div>
      }
    />
  );
};
