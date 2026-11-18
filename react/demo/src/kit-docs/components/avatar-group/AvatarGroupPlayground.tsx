import React, { useState } from "react";
import {
  AvatarGroup,
  type AvatarGroupItem,
  type AvatarGroupRounded,
  type ControlSize,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, ChoiceControl, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const ROSTER: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Linus Torvalds" },
  { name: "Margaret Hamilton" },
  { name: "Barbara Liskov" },
  { name: "PostgreSQL", icon: "Database", tone: "emerald" },
  { name: "CI bot", icon: "Cog", tone: "zinc" },
];

const ROUNDED_OPTIONS = [
  { value: "full", label: "Full" },
  { value: "lg", label: "LG" },
  { value: "md", label: "MD" },
  { value: "none", label: "None" },
];

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

export const AvatarGroupPlayground: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("lg");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [rounded, setRounded] = useState<AvatarGroupRounded>("full");
  const [border, setBorder] = useState(true);
  const [expandOn, setExpandOn] = useState<"click" | "hover">("click");
  const [maxVisible, setMaxVisible] = useState(5);
  const [defaultExpanded, setDefaultExpanded] = useState(false);
  const [singleRow, setSingleRow] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "chips",
                title: "Chips",
                controls: (
                  <>
                    <SelectControl label="Size" options={controlSizeOptions} value={size}
                      onChange={(v) => setSize(v as ControlSize)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <ChoiceControl label="Rounded" options={ROUNDED_OPTIONS} value={rounded}
                      onChange={(v) => setRounded(v as AvatarGroupRounded)} />
                    <ToggleRow label="border" checked={border} onChange={setBorder} />
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
                    <ToggleRow label="defaultExpanded" checked={defaultExpanded} onChange={setDefaultExpanded} />
                    <ToggleRow label="singleRow" checked={singleRow} onChange={setSingleRow} />
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The <code>tone</code> picker sets the group&apos;s fallback colour —
            the two icon chips carry their own and ignore it. Resize the
            window: a strip too narrow for its chips condenses on its own.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <AvatarGroup
            key={`${expandOn}-${defaultExpanded}`}
            items={ROSTER}
            size={size}
            tone={tone}
            rounded={rounded}
            border={border}
            expandOn={expandOn}
            maxVisible={maxVisible}
            defaultExpanded={defaultExpanded}
            singleRow={singleRow}
          />
        </div>
      }
    />
  );
};
