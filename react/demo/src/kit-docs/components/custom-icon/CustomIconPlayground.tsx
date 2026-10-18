import React, { useState } from "react";
import {
  ColorSwatches,
  CustomIcon,
  iconRegistry,
  Panel,
} from "@cjlapao/ui-kit";
import type { IconName, IconSize, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

const ALL_ICONS = Object.keys(iconRegistry).sort() as IconName[];

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const CustomIconPlayground: React.FC = () => {
  const [icon, setIcon] = useState<IconName>("Notification");
  const [size, setSize] = useState<IconSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [useTone, setUseTone] = useState(true);
  const [hoverColor, setHoverColor] = useState(false);
  const [colored, setColored] = useState(false);
  const [spin, setSpin] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withAlt, setWithAlt] = useState(false);
  const [glassPanel, setGlassPanel] = useState(false);
  const [clicks, setClicks] = useState(0);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "icons",
                title: "Icons",
                controls: (
                  <>
                    <SelectControl
                      label="Icon"
                      options={ALL_ICONS.map((n) => ({ label: n, value: n }))}
                      value={icon}
                      onChange={(v) => setIcon(v as IconName)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as IconSize)}
                    />
                    {/* Colour is a palette, not a list — never a dropdown
                        of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Use tone"
                      checked={useTone}
                      onChange={setUseTone}
                    />
                    <ToggleRow
                      label="Tinted"
                      checked={!colored}
                      onChange={(v) => setColored(!v)}
                    />
                    <ToggleRow
                      label="Hover colour"
                      checked={hoverColor}
                      onChange={setHoverColor}
                    />
                    <ToggleRow label="Spin" checked={spin} onChange={setSpin} />
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
                      label="Accessible name"
                      checked={withAlt}
                      onChange={setWithAlt}
                    />
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Without an <strong>accessible name</strong> the icon is decoration
            and hidden from assistive tech; with one it is announced as an
            image. <strong>Clickable</strong> renders a real{" "}
            <code>&lt;button&gt;</code>, so it is reachable by keyboard.{" "}
            <strong>Spin</strong> respects <code>prefers-reduced-motion</code>.{" "}
            <strong>Tinted</strong> off keeps each icon&rsquo;s own colours —
            multicolour glyphs never take a tone. <strong>Glass panel</strong>{" "}
            swaps the host between the kit&rsquo;s default <code>elevated</code>{" "}
            surface and <code>glass</code>; pair it with the background-image
            toggle.
            {clickable && ` Clicked ${clicks}×.`}
          </p>
        </div>
      }
      preview={
        /*
          Both hosts are real `Panel`s — `elevated` by default, `glass` via
          the States toggle, since the question a tone asks on glass is
          whether the glyph still reads through the frost.
        */
        <div className="w-full">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <div className="flex flex-col gap-2">
              <Caption>Current settings</Caption>
              <div className="flex items-center gap-4">
                <CustomIcon
                  icon={icon}
                  size={size}
                  tone={useTone && !colored ? tone : undefined}
                  hoverColor={hoverColor ? "#f43f5e" : undefined}
                  colored={colored}
                  spin={spin}
                  disabled={disabled}
                  alt={withAlt ? `${icon} icon` : undefined}
                  onClick={
                    clickable ? () => setClicks((n) => n + 1) : undefined
                  }
                />
                <span className="text-xs opacity-60">{icon}</span>
              </div>
            </div>
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
