import React, { useState } from "react";
import { ColorSwatches, ExpandableButton, Input, Panel } from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  ButtonVariant,
  ExpandableButtonIconMotion,
  ExpandableButtonSpring,
  ExpandTrigger,
  SpecularMode,
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
  buttonVariantOptions,
  controlSizeOptions,
  expandableButtonExpandOnOptions,
  expandableButtonIconMotionOptions,
  expandableButtonLabelPlacementOptions,
  expandableButtonSpringOptions,
  iconButtonRoundedOptions,
  panelSpecularOptions,
  spinnerVariantOptions,
} from "../../shared/options";

type ExpandableRounded = "md" | "lg" | "xl" | "full";
type LabelPlacement = "after" | "before";
type SpinnerVariant = "solid" | "segments";

const SPRING_DURATIONS = {
  bouncy: 600,
  snappy: 380,
  gentle: 900,
  precise: 320,
} as const;

export const ExpandableButtonPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ButtonVariant>("icon");
  const [size, setSize] = useState<ButtonSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [rounded, setRounded] = useState<ExpandableRounded>("full");
  const [expandOn, setExpandOn] = useState<ExpandTrigger>("hover");
  const [spring, setSpring] = useState<ExpandableButtonSpring>("bouncy");
  const [iconMotion, setIconMotion] =
    useState<ExpandableButtonIconMotion>("pop-tilt");
  const [duration, setDuration] = useState(600);
  const [overrideDuration, setOverrideDuration] = useState(false);
  const [elevate, setElevate] = useState(true);
  const [squish, setSquish] = useState(true);
  const [glass, setGlass] = useState(false);
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");
  const [loading, setLoading] = useState(false);
  const [spinnerVariant, setSpinnerVariant] = useState<SpinnerVariant>(
    "segments",
  );
  const [disabled, setDisabled] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const [glassPanel, setGlassPanel] = useState(false);
  const [label, setLabel] = useState("Save changes");
  const [labelPlacement, setLabelPlacement] = useState<LabelPlacement>("after");
  const [log, pushLog] = useEventLog();

  // `always` is open by definition, so it needs nothing here. The Force-open
  // toggle is the interesting one: it pins *any* trigger open through
  // `expanded`, which also shows what a controlled button looks like — the
  // pointer no longer moves the label, or the glyph.
  const controlledOpen = forceOpen;

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
                      onChange={(v) => setRounded(v as ExpandableRounded)}
                    />
                  </>
                ),
              },
              {
                id: "physics",
                title: "Physics",
                defaultOpen: true,
                controls: (
                  <div className="space-y-3">
                    <SelectControl
                      label="Expand on"
                      options={expandableButtonExpandOnOptions}
                      value={expandOn}
                      onChange={(v) => setExpandOn(v as ExpandTrigger)}
                    />
                    <ChoiceControl
                      label="Spring"
                      options={expandableButtonSpringOptions}
                      value={spring}
                      onChange={(v) => setSpring(v as ExpandableButtonSpring)}
                    />
                    <SelectControl
                      label="Icon motion"
                      options={expandableButtonIconMotionOptions}
                      value={iconMotion}
                      onChange={(v) =>
                        setIconMotion(v as ExpandableButtonIconMotion)
                      }
                    />
                    <Control
                      label={
                        overrideDuration
                          ? `Duration — ${duration} ms`
                          : `Duration — ${SPRING_DURATIONS[spring]} ms (preset)`
                      }
                    >
                      <input
                        type="range"
                        min={150}
                        max={1200}
                        step={20}
                        value={overrideDuration ? duration : SPRING_DURATIONS[spring]}
                        disabled={!overrideDuration}
                        onChange={(event) =>
                          setDuration(Number(event.target.value))
                        }
                        className="w-full accent-blue-500 disabled:opacity-50"
                        aria-label="Spring duration in milliseconds"
                      />
                    </Control>
                    <ToggleRow
                      label="Override duration"
                      checked={overrideDuration}
                      onChange={setOverrideDuration}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleRow
                        label="Elevate"
                        checked={elevate}
                        onChange={setElevate}
                      />
                      <ToggleRow
                        label="Squish"
                        checked={squish}
                        onChange={setSquish}
                      />
                      <ToggleRow
                        label="Glass"
                        checked={glass}
                        onChange={setGlass}
                      />
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
                        label="Tooltip"
                        checked={tooltip}
                        onChange={setTooltip}
                      />
                      <ToggleRow
                        label="Force open"
                        checked={forceOpen}
                        onChange={setForceOpen}
                      />
                      <ToggleRow
                        label="Glass panel"
                        checked={glassPanel}
                        onChange={setGlassPanel}
                      />
                    </div>
                    {loading && (
                      <ChoiceControl
                        label="Spinner type"
                        options={spinnerVariantOptions}
                        value={spinnerVariant}
                        onChange={(v) =>
                          setSpinnerVariant(v as SpinnerVariant)
                        }
                      />
                    )}
                  </div>
                ),
              },
              {
                id: "label",
                title: "Label",
                controls: (
                  <>
                    <Control label="Label text">
                      <Input
                        size="sm"
                        value={label}
                        placeholder="Save changes"
                        aria-label="Button label"
                        onChange={(event) => setLabel(event.target.value)}
                      />
                    </Control>
                    <ChoiceControl
                      label="Placement"
                      options={expandableButtonLabelPlacementOptions}
                      value={labelPlacement}
                      onChange={(v) => setLabelPlacement(v as LabelPlacement)}
                    />
                  </>
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
            emptyText="No events yet — hover or press the button."
          />
          <p className="text-xs opacity-70">
            The resting control is a circle; the label rides out on a spring
            whose overshoot is the whole illusion. <strong>Expand on</strong>{" "}
            decides who owns that open state: <code>hover</code>,{" "}
            <code>focus</code> and <code>hover+focus</code> are pure CSS (no
            re-render), <code>click</code> moves it into React state, and{" "}
            <code>always
            </code> writes it outright — the pointer has nothing to do with it.{" "}
            <strong>Force open</strong> pins any trigger through{" "}
            <code>expanded</code>, and a control that owns its open state stops
            answering hover and focus altogether.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <ExpandableButton
              icon="Send"
              label={label}
              variant={variant}
              color={color}
              size={size}
              rounded={rounded}
              expandOn={expandOn}
              expanded={controlledOpen ? true : undefined}
              spring={spring}
              springDuration={overrideDuration ? duration : undefined}
              iconMotion={iconMotion}
              elevate={elevate}
              squish={squish}
              glass={glass}
              specularMode={glass ? specularMode : "none"}
              loading={loading}
              spinnerVariant={spinnerVariant}
              disabled={disabled}
              tooltip={tooltip ? "Send message" : undefined}
              tooltipPosition="top"
              labelPlacement={labelPlacement}
              srLabel={label}
              onExpandedChange={(next) =>
                pushLog(`onExpandedChange → ${next}`)
              }
              onClick={() => pushLog("clicked")}
            />
          </Panel>
          <p className="text-center text-[11px] opacity-60">
            Hover the circle (or <code>Tab</code> to it) to spring the label
            out.
          </p>
        </div>
      }
    ></PlaygroundPanel>
  );
};

export default ExpandableButtonPlayground;
