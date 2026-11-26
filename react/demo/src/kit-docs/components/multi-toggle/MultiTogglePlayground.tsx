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

type SegmentFlags = { hidden: boolean; disabled: boolean };
const NO_FLAGS: SegmentFlags = { hidden: false, disabled: false };

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
  const [background, setBackground] = useState(true);
  const [gap, setGap] = useState(0);
  const [withSeparators, setWithSeparators] = useState(false);
  const [separatorPadding, setSeparatorPadding] = useState(8);
  // Per-segment presence: `hidden` takes a segment out of the track outright
  // (the pill *jumps* out when it is the selected one), while `disabled`
  // keeps it in place, dimmed and inert.
  const [segmentFlags, setSegmentFlags] = useState<
    Record<string, SegmentFlags>
  >({});
  const [log, pushLog] = useEventLog();

  const setFlag = (optionValue: string, flag: keyof SegmentFlags, on: boolean) =>
    setSegmentFlags((previous) => ({
      ...previous,
      [optionValue]: { ...NO_FLAGS, ...previous[optionValue], [flag]: on },
    }));

  const baseOptions = OPTIONS.map((o, i) => ({
    ...o,
    ...(withIcons ? { icon: ["Calendar", "ChartLine", "Clock"][i] } : undefined),
    hidden: segmentFlags[o.value]?.hidden || undefined,
    disabled: segmentFlags[o.value]?.disabled || undefined,
  }));

  // The grouped filter-bar pattern: a rule between the segments and the
  // "All" entry, spaced only by the rule's own padding.
  const previewOptions = withSeparators
    ? [...baseOptions, { type: "separator" as const }, { value: "all", label: "All" }]
    : baseOptions;

  const toggle = (
    <MultiToggle
      options={previewOptions}
      value={value}
      onChange={(v) => {
        setValue(v);
        pushLog(`change → ${v}`);
      }}
      size={size}
      tone={tone}
      variant={variant}
      background={background}
      gap={gap > 0 ? gap : undefined}
      separatorPadding={separatorPadding}
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
                  <div className="space-y-3">
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
                    <div className="grid grid-cols-2 gap-2">
                      {OPTIONS.map((option) => (
                        <React.Fragment key={option.value}>
                          <ToggleRow
                            label={`Hide ${option.label}`}
                            checked={!!segmentFlags[option.value]?.hidden}
                            onChange={(v) =>
                              setFlag(option.value, "hidden", v)
                            }
                          />
                          <ToggleRow
                            label={`Disable ${option.label}`}
                            checked={!!segmentFlags[option.value]?.disabled}
                            onChange={(v) =>
                              setFlag(option.value, "disabled", v)
                            }
                          />
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      <strong>Hide</strong> takes a segment out of the track
                      entirely — the others close ranks, and hiding the{" "}
                      <em>selected</em> one makes the indicator jump out of
                      sight rather than slide. <strong>Disable</strong> keeps
                      the segment in place, dimmed and inert, still selected if
                      it was.
                    </p>
                  </div>
                ),
              },
              {
                id: "spacing",
                title: "Spacing & separators",
                controls: (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleRow
                        label="Track background"
                        checked={background}
                        onChange={setBackground}
                      />
                      <ToggleRow
                        label="Separator + All"
                        checked={withSeparators}
                        onChange={setWithSeparators}
                      />
                    </div>
                    <Control label={`Item gap · ${gap}px`}>
                      <input
                        aria-label="Item gap"
                        className="w-full"
                        type="range"
                        min="0"
                        max="24"
                        step="1"
                        value={gap}
                        onChange={(event) => setGap(Number(event.target.value))}
                      />
                    </Control>
                    <Control label={`Separator padding · ${separatorPadding}px`}>
                      <input
                        aria-label="Separator padding"
                        className="w-full"
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={separatorPadding}
                        onChange={(event) =>
                          setSeparatorPadding(Number(event.target.value))
                        }
                      />
                    </Control>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      The gap never touches the outer edges, and a separator
                      cancels it on both sides of its rule — only{" "}
                      <strong>Separator padding</strong> spaces the rule from
                      its neighbours. Switch <strong>Track background</strong>{" "}
                      off and the segments float on the page, indicator and all.
                    </p>
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
