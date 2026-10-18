import React, { useState } from "react";
import { ColorSwatches, MultiToggle, Panel } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  MultiToggleIndicator,
  MultiToggleShape,
  MultiToggleVariant,
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

const MULTI_TOGGLE_INDICATOR_OPTIONS = [
  { label: "solid", value: "solid" },
  { label: "soft", value: "soft" },
  { label: "tonal", value: "tonal" },
];

const CORNER_OPTIONS = ["none", "xs", "sm", "md", "lg", "xl", "full"].map(
  (value) => ({ label: value, value }),
);

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export const MultiTogglePlayground: React.FC = () => {
  const [value, setValue] = useState("week");
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<MultiToggleVariant>("subtle");
  const [indicator, setIndicator] = useState<MultiToggleIndicator>("solid");
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [rounded, setRounded] = useState<MultiToggleShape>("lg");
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withIcons, setWithIcons] = useState(false);
  const [log, pushLog] = useEventLog();

  const toggle = (
    <MultiToggle
      options={
        withIcons
          ? OPTIONS.map((o, i) => ({
              ...o,
              icon: ["Calendar", "ChartLine", "Clock"][i],
            }))
          : OPTIONS
      }
      value={value}
      onChange={(v) => {
        setValue(v);
        pushLog(`change → ${v}`);
      }}
      size={size}
      tone={tone}
      variant={variant}
      indicator={indicator}
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
                      onChange={(v) => setVariant(v as MultiToggleVariant)}
                    />
                    <ChoiceControl
                      label="Indicator"
                      options={MULTI_TOGGLE_INDICATOR_OPTIONS}
                      value={indicator}
                      onChange={(v) => setIndicator(v as MultiToggleIndicator)}
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
                    <ChoiceControl
                      label="Corner"
                      options={CORNER_OPTIONS}
                      value={rounded}
                      onChange={(v) => setRounded(v as MultiToggleShape)}
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
                      label="Icons"
                      checked={withIcons}
                      onChange={setWithIcons}
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
            Focus a segment and use the <strong>arrow keys</strong>, Home and
            End. The track is a surface from the Panel family — switch{" "}
            <strong>Track variant</strong> to <code>glass</code> and the ladder
            below stops being a demo trick; the indicator is the separate knob
            the old <code>variant</code> union actually described.
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
              // The track takes the same family as this host — a toggle
              // "on a panel" is where the surface matching pays off.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="flex justify-center">{toggle}</div>
            </Panel>
          ) : (
            <div className="flex justify-center">{toggle}</div>
          )}
        </div>
      }
    />
  );
};
