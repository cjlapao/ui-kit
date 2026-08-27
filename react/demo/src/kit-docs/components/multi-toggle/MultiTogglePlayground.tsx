import React, { useState } from "react";
import classNames from "classnames";
import {
  MultiToggle,
  MULTI_TOGGLE_VARIANTS,
  MULTI_TOGGLE_INDICATORS,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  MultiToggleIndicator,
  MultiToggleVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const variantOptions = MULTI_TOGGLE_VARIANTS.map((value) => ({ label: value, value }));
const indicatorOptions = MULTI_TOGGLE_INDICATORS.map((value) => ({ label: value, value }));
const roundedOptions = ["none", "xs", "sm", "md", "lg", "xl", "full"].map((value) => ({ label: value, value }));

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
  const [onGlass, setOnGlass] = useState(false);
  const [rounded, setRounded] = useState("lg");
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withIcons, setWithIcons] = useState(false);

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
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Track variant" options={variantOptions} value={variant}
                      onChange={(v) => setVariant(v as MultiToggleVariant)} />
                    <SelectControl label="Indicator" options={indicatorOptions} value={indicator}
                      onChange={(v) => setIndicator(v as MultiToggleIndicator)} />
                    <SelectControl label="Corner" options={roundedOptions} value={rounded}
                      onChange={setRounded} />
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <Control label="Layout">
                    <div className="space-y-1.5">
                      <ToggleRow label="Full width" checked={fullWidth} onChange={setFullWidth} />
                      <ToggleRow label="Icons" checked={withIcons} onChange={setWithIcons} />
                      <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                      <ToggleRow label="On a photo backdrop" checked={onGlass} onChange={setOnGlass} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Focus a segment and use the <strong>arrow keys</strong>, Home and
            End. The group had a roving tabindex but handled no keys at all, so
            a keyboard user could reach it and never change the selection — the
            one interaction a radiogroup exists for.
          </p>
        </div>
      }
      preview={
        <div
          className={classNames(
            "rounded-2xl p-6",
            onGlass &&
              "bg-gradient-to-br from-sky-300 via-violet-300 to-rose-300 dark:from-sky-800 dark:via-violet-800 dark:to-rose-800",
            fullWidth && "w-full",
          )}
        >
          <MultiToggle
            options={
              withIcons
                ? OPTIONS.map((o, i) => ({ ...o, icon: ["Calendar", "ChartLine", "Clock"][i] }))
                : OPTIONS
            }
            value={value}
            onChange={setValue}
            size={size}
            tone={tone}
            variant={variant}
            indicator={indicator}
            rounded={rounded as "lg"}
            fullWidth={fullWidth}
            disabled={disabled}
          />
        </div>
      }
    />
  );
};
