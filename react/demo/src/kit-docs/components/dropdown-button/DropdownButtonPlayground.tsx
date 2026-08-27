import React, { useState } from "react";
import { DropdownButton, MultiToggle } from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  ButtonVariant,
  DropdownButtonOption,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  buttonVariantOptions,
  controlSizeOptions,
  dropdownMenuWidthOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const DEPLOY_OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
  {
    label: "Advanced…",
    value: "advanced",
    description: "Pick a specific version or channel",
  },
];

type MenuWidthChoice = "trigger" | "240" | "320";

export const DropdownButtonPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ButtonVariant>("solid");
  const [size, setSize] = useState<ButtonSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [menuWidth, setMenuWidth] = useState<MenuWidthChoice>("trigger");
  const [split, setSplit] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [primaryClicks, setPrimaryClicks] = useState(0);
  const [selection, setSelection] = useState("");

  const readout =
    primaryClicks > 0 || selection
      ? [
          primaryClicks > 0 ? `primary: ${primaryClicks}` : null,
          selection ? `selected: ${selection}` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : "— nothing yet —";

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
                      options={buttonVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as ButtonVariant)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as ButtonSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={color}
                      onChange={(v) => setColor(v as TrueColor)}
                    />
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <Control label="Menu width">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={dropdownMenuWidthOptions}
                        value={menuWidth}
                        onChange={(v) => setMenuWidth(v as MenuWidthChoice)}
                      />
                    </Control>
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleRow
                        label="Split trigger"
                        checked={split}
                        onChange={setSplit}
                      />
                      <ToggleRow
                        label="Full width"
                        checked={fullWidth}
                        onChange={setFullWidth}
                      />
                      <ToggleRow
                        label="Disabled"
                        checked={disabled}
                        onChange={setDisabled}
                      />
                    </div>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            <strong>Split trigger</strong> gives the caret its own button
            width; without it the caret collapses into a compact trigger. An
            empty menu hides the caret entirely, so the control renders as a
            plain button.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900">
            <DropdownButton
              label="Deploy"
              options={DEPLOY_OPTIONS}
              variant={variant}
              color={color}
              size={size}
              disabled={disabled}
              fullWidth={fullWidth}
              split={split}
              menuWidth={menuWidth === "trigger" ? "trigger" : Number(menuWidth)}
              onPrimaryClick={() => setPrimaryClicks((n) => n + 1)}
              onOptionSelect={(option) => setSelection(option.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>What happened</Caption>
            <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
              {readout}
            </code>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
