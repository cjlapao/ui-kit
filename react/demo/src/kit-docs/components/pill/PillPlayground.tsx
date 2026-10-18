import React, { useState } from "react";
import { ColorSwatches, Panel, Pill } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PillCorner,
  PillSize,
  PillTone,
  PillVariant,
  SpecularMode,
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
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  pillCornerOptions,
  pillVariantOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const LABELS = ["Operational", "A long label that runs on"];

export const PillPlayground: React.FC = () => {
  const [tone, setTone] = useState<PillTone>("blue");
  const [variant, setVariant] = useState<PillVariant>("soft");
  const [size, setSize] = useState<PillSize>("md");
  const [corner, setCorner] = useState<PillCorner>("full");
  const [uppercase, setUppercase] = useState(false);
  const [withIcon, setWithIcon] = useState(true);
  const [withTrailingIcon, setWithTrailingIcon] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [truncate, setTruncate] = useState(false);
  const [removable, setRemovable] = useState(false);
  const [withDot, setWithDot] = useState(false);
  const [glassPanel, setGlassPanel] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode | undefined>(
    undefined,
  );
  const [removed, setRemoved] = useState<string[]>([]);
  const [log, pushLog] = useEventLog();

  const isGlass = variant === "glass" || variant === "liquid-glass";

  const shared = {
    tone,
    variant,
    size,
    corner,
    uppercase,
    disabled,
    icon: withIcon ? "Check" : undefined,
    trailingIcon: withTrailingIcon ? "ArrowRight" : undefined,
    maxWidth: truncate ? 140 : undefined,
    glassOpacity,
    vibrancy,
    specularMode,
  };

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
                      label="Variant"
                      options={pillVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as PillVariant)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as PillSize)}
                    />
                    <SelectControl
                      label="Corner"
                      options={pillCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as PillCorner)}
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
                      label="Uppercase"
                      checked={uppercase}
                      onChange={setUppercase}
                    />
                    <ToggleRow
                      label="Leading icon"
                      checked={withIcon}
                      onChange={setWithIcon}
                    />
                    <ToggleRow
                      label="Trailing icon"
                      checked={withTrailingIcon}
                      onChange={setWithTrailingIcon}
                    />
                    <ToggleRow
                      label="Clickable"
                      checked={clickable}
                      onChange={setClickable}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Truncate label"
                      checked={truncate}
                      onChange={setTruncate}
                    />
                    <ToggleRow
                      label="Removable"
                      checked={removable}
                      onChange={(v) => {
                        setRemovable(v);
                        setRemoved([]);
                      }}
                    />
                    <ToggleRow
                      label="Dot pill"
                      checked={withDot}
                      onChange={setWithDot}
                    />
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
              ...(isGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <SelectControl
                            label="Specular"
                            options={panelSpecularOptions}
                            value={
                              specularMode ??
                              (variant === "liquid-glass" ? "classic" : "none")
                            }
                            onChange={(v) => setSpecularMode(v as SpecularMode)}
                          />
                          <SelectControl
                            label="Vibrancy"
                            options={glassVibrancyOptions}
                            value={vibrancy as string}
                            onChange={(v) => setVibrancy(v as GlassVibrancy)}
                          />
                          <SelectControl
                            label="Glass opacity"
                            options={glassOpacityOptions}
                            value={glassOpacity as string}
                            onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                          />
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — click or remove a pill (flip Clickable / Removable first)."
          />
          <p className="text-xs opacity-70">
            The <strong>glass</strong> variants drop the tone fill for a
            translucent one — <strong>liquid-glass</strong> is the same thing
            plus a specular highlight by default. <strong>Clickable</strong>{" "}
            renders a real <code>&lt;button&gt;</code> and turns the tone hover
            on — solid steps one shade deeper, soft and outline gain a
            translucent wash, glass ignites its rim. A pill that is merely
            <em>removable</em> stays quiet: only the little × reacts.{" "}
            <strong>Removable</strong> adds that nested button, whose click
            never activates the pill. <strong>Dot pill</strong> shows the
            bare-dot form, announced only because it is labelled.{" "}
            <strong>Glass panel</strong> swaps the host between the kit&rsquo;s
            default <code>elevated</code> surface and <code>glass</code>; pair
            it with the background-image toggle.
          </p>
        </div>
      }
      preview={
        /*
          The host is a real `Panel` — `elevated` by default, `glass` via the
          States toggle. It used to mirror the pill's own variant, which hid
          every setting inside a lookalike host.
        */
        <div className="w-full">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <div className="flex flex-col gap-2">
              <Caption>Current settings</Caption>
              <div className="flex flex-wrap items-center gap-2">
                {withDot && (
                  <Pill
                    tone={tone}
                    variant={variant}
                    size={size}
                    dot
                    label="Operational status"
                    disabled={disabled}
                  />
                )}
                {LABELS.filter((l) => !removed.includes(l)).map((label) => (
                  <Pill
                    key={label}
                    {...shared}
                    onClick={
                      clickable
                        ? () => pushLog(`clicked "${label}"`)
                        : undefined
                    }
                    onRemove={
                      removable
                        ? () => {
                            setRemoved((r) => [...r, label]);
                            pushLog(`removed "${label}"`);
                          }
                        : undefined
                    }
                  >
                    {label}
                  </Pill>
                ))}
                {removed.length > 0 && (
                  <span className="text-xs opacity-60">
                    {removed.length} removed — flip Removable off to bring them
                    back.
                  </span>
                )}
              </div>
            </div>
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
