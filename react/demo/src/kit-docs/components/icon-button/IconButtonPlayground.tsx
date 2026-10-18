import React, { useState } from "react";
import { ColorSwatches, IconButton, Panel } from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  ButtonVariant,
  SpecularMode,
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
import {
  buttonVariantOptions,
  controlSizeOptions,
  iconButtonRoundedOptions,
  panelSpecularOptions,
} from "../../shared/options";

type IconRounded = "md" | "lg" | "xl" | "full";

export const IconButtonPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ButtonVariant>("icon");
  const [size, setSize] = useState<ButtonSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [rounded, setRounded] = useState<IconRounded>("full");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [accent, setAccent] = useState(false);
  const [glass, setGlass] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");
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
                      options={buttonVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as ButtonVariant)}
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
                    <SelectControl
                      label="Corner"
                      options={iconButtonRoundedOptions}
                      value={rounded}
                      onChange={(v) => setRounded(v as IconRounded)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Accent"
                      checked={accent}
                      onChange={setAccent}
                    />
                    <ToggleRow
                      label="Glass"
                      checked={glass}
                      onChange={setGlass}
                    />
                    <ToggleRow
                      label="Tooltip"
                      checked={tooltip}
                      onChange={setTooltip}
                    />
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
              ...(glass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <SelectControl
                          label="Specular"
                          options={panelSpecularOptions}
                          value={specularMode}
                          onChange={(v) => setSpecularMode(v as SpecularMode)}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — press the icon button."
          />
          <p className="text-xs opacity-70">
            Icon buttons carry no text — the <strong>srLabel</strong> is what
            gets announced and doubles as the native title (a styled{" "}
            <strong>tooltip</strong> replaces the native one, never doubling).
            Loading swaps the glyph for a spinner and blocks clicks — without
            dimming, or the spinner would fade with the button. The default{" "}
            <code>rounded</code> is <code>full</code>: a circle, the icon
            button&rsquo;s identity.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <IconButton
              icon="Send"
              variant={variant}
              color={color}
              size={size}
              rounded={rounded}
              loading={loading}
              disabled={disabled}
              accent={accent}
              glass={glass}
              specularMode={glass ? specularMode : "none"}
              tooltip={tooltip ? "Send message" : undefined}
              tooltipPosition="top"
              srLabel="Send"
              onClick={() => pushLog("clicked")}
            />
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
