import React, { useState } from "react";
import { ColorSwatches, DropdownButton, Panel } from "@cjlapao/ui-kit";
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { Kbd } from "../../shared/A11ySections";
import {
  controlSizeOptions,
  dropdownButtonVariantOptions,
  dropdownMenuWidthOptions,
} from "../../shared/options";

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
  const [variant, setVariant] =
    useState<Exclude<ButtonVariant, "clear">>("solid");
  const [size, setSize] = useState<ButtonSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [menuWidth, setMenuWidth] = useState<MenuWidthChoice>("trigger");
  const [split, setSplit] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [emptyMenu, setEmptyMenu] = useState(false);
  const [glassPanel, setGlassPanel] = useState(false);
  const [log, pushLog] = useEventLog();

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
                      options={dropdownButtonVariantOptions}
                      value={variant}
                      onChange={(v) =>
                        setVariant(v as Exclude<ButtonVariant, "clear">)
                      }
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ButtonSize)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={color}
                        onSelect={setColor}
                        defaultExpanded
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <SelectControl
                      label="Menu width"
                      options={dropdownMenuWidthOptions}
                      value={menuWidth}
                      onChange={(v) => setMenuWidth(v as MenuWidthChoice)}
                    />
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
                      <ToggleRow
                        label="Empty menu"
                        checked={emptyMenu}
                        onChange={setEmptyMenu}
                      />
                      <ToggleRow
                        label="Glass panel"
                        checked={glassPanel}
                        onChange={setGlassPanel}
                      />
                    </div>
                  </>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — press the button or pick a menu option."
          />
          <p className="text-xs opacity-70">
            <strong>Split trigger</strong> gives the caret its own button width;
            without it the caret collapses into a compact trigger. An empty menu
            hides the caret entirely, so the control renders as a plain button.
            The primary button fires the action; the caret opens
            <code> role=menu</code> — <Kbd>ArrowUp</Kbd>/<Kbd>ArrowDown</Kbd>{" "}
            walk its items (skipping disabled ones), <Kbd>Home</Kbd>/
            <Kbd>End</Kbd> jump, <Kbd>Escape</Kbd> closes and hands focus back
            to the caret. The caret itself is named through the kit catalogs;
            override it with <code>caretLabel</code> when &ldquo;Deploy
            options&rdquo; beats &ldquo;Toggle dropdown menu&rdquo;.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <DropdownButton
              label="Deploy"
              options={emptyMenu ? [] : DEPLOY_OPTIONS}
              variant={variant}
              color={color}
              size={size}
              disabled={disabled}
              fullWidth={fullWidth}
              split={split}
              menuWidth={
                menuWidth === "trigger" ? "trigger" : Number(menuWidth)
              }
              onPrimaryClick={() => pushLog("primary action fired")}
              onOptionSelect={(option) => pushLog(`selected "${option.value}"`)}
            />
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
