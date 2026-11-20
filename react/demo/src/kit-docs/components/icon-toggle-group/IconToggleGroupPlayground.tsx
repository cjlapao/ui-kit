import React, { useState } from "react";
import {
  ColorSwatches,
  IconToggleGroup,
  Panel,
  ICON_TOGGLE_GROUP_ROUNDED,
} from "@cjlapao/ui-kit";
import type {
  ButtonVariant,
  ControlSize,
  IconToggleGroupShape,
  IconToggleGroupVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  surfaceVariantOptions,
} from "../../shared/options";

const CORNER_OPTIONS = ICON_TOGGLE_GROUP_ROUNDED.map((value) => ({
  label: value,
  value,
}));

// The resting variants worth offering, flat-first. `glass` is left out
// because IconButton documents that glass ignores `active` — no honest
// on-state to show; `link`/`clear` have no box at all; `solid` is left out
// because the selected option always wears the solid tone tile, so a solid
// resting row and the selection would wear the same fill.
const BUTTON_VARIANT_OPTIONS: { label: string; value: string }[] = [
  "ghost",
  "icon",
  "soft",
  "outline",
].map((value) => ({ label: value, value }));

const OPTIONS = [
  { value: "grid", icon: "ViewGrid", label: "Grid" },
  { value: "rows", icon: "ViewRows", label: "Rows" },
  { value: "board", icon: "Dashboard", label: "Board" },
];

export const IconToggleGroupPlayground: React.FC = () => {
  const [value, setValue] = useState("rows");
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [accent, setAccent] = useState<TrueColor | undefined>(undefined);
  const [variant, setVariant] = useState<IconToggleGroupVariant>("subtle");
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("ghost");
  const [rounded, setRounded] = useState<IconToggleGroupShape>("lg");
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disableOne, setDisableOne] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [log, pushLog] = useEventLog();

  const group = (
    <IconToggleGroup
      options={
        disableOne
          ? OPTIONS.map((o) => (o.value === "board" ? { ...o, disabled: true } : o))
          : OPTIONS
      }
      value={value}
      onChange={(v) => {
        setValue(v);
        pushLog(`change → ${v}`);
      }}
      size={size}
      tone={tone}
      accentTone={accent}
      variant={variant}
      buttonVariant={buttonVariant}
      rounded={rounded}
      fullWidth={fullWidth}
      disabled={disabled}
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
                      label="Track variant"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as IconToggleGroupVariant)}
                    />
                    <ChoiceControl
                      label="Button variant"
                      options={BUTTON_VARIANT_OPTIONS}
                      value={buttonVariant}
                      onChange={(v) => setButtonVariant(v as ButtonVariant)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={(c) => {
                          setTone(c);
                          pushLog(`tone → ${c}`);
                        }}
                        defaultExpanded
                      />
                    </Control>
                    <Control label="Accent">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={accent ?? tone}
                        onSelect={(c) =>
                          setAccent(c === accent ? undefined : c)
                        }
                      />
                    </Control>
                    <ChoiceControl
                      label="Corner"
                      options={CORNER_OPTIONS}
                      value={rounded}
                      onChange={(v) => setRounded(v as IconToggleGroupShape)}
                    />
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
                    <ToggleRow
                      label="Disable Board"
                      checked={disableOne}
                      onChange={setDisableOne}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
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
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Focus an option and use the <strong>arrow keys</strong>, Home and
            End. There is no indicator to tune — the selected{" "}
            <strong>IconButton</strong> paints its own <code>active</code>{" "}
            state, and the track is just a surface from the Panel family
            (set it to <code>none</code> and there is nothing but buttons).
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — the selected value reports through here."
          />
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // The track takes the same family as this host — a group
              // "on a panel" is where the surface matching pays off.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="flex justify-center">{group}</div>
            </Panel>
          ) : (
            <div className="flex justify-center">{group}</div>
          )}
        </div>
      }
    />
  );
};
