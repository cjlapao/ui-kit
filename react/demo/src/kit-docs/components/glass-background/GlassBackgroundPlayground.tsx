import React, { useState } from "react";
import {
  ColorSwatches,
  GlassBackground,
  Panel,
  type GradientDirection,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { ChoiceControl, Control, PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { gradientDirectionOptions } from "../../shared/options";

export const GlassBackgroundPlayground: React.FC = () => {
  // Start on what the component itself derives from its default tone:
  // blue → indigo → violet.
  const [color, setColor] = useState<TrueColor>("blue");
  const [colorSecondary, setColorSecondary] = useState<TrueColor>("indigo");
  const [colorDeep, setColorDeep] = useState<TrueColor>("violet");
  const [direction, setDirection] = useState<GradientDirection>("br");
  const [shimmer, setShimmer] = useState(false);
  const [ambient, setAmbient] = useState(true);

  return (
    <PlaygroundPanel
      hideBackgroundToggle
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  {/* The stops are colour decisions — pick each from colour
                      swatches, not from a dropdown of words. */}
                  <Control label="Tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={color}
                      onSelect={setColor}
                      defaultExpanded
                    />
                  </Control>
                  <Control label="Secondary tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={colorSecondary}
                      onSelect={setColorSecondary}
                      defaultExpanded
                    />
                  </Control>
                  <Control label="Deep tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={colorDeep}
                      onSelect={setColorDeep}
                      defaultExpanded
                    />
                  </Control>
                  <ChoiceControl
                    label="Direction"
                    options={gradientDirectionOptions}
                    value={direction}
                    onChange={(value) => setDirection(value as GradientDirection)}
                  />
                </>
              ),
            },
            {
              id: "effects",
              title: "Effects",
              controls: (
                <div className="grid grid-cols-1 gap-2">
                  <ToggleRow label="Shimmer" checked={shimmer} onChange={setShimmer} />
                  <ToggleRow label="Ambient glow" checked={ambient} onChange={setAmbient} />
                </div>
              ),
            },
          ]}
        />
      }
      preview={
        <div className="relative h-72 w-full max-w-lg overflow-hidden rounded-xl">
          <GlassBackground
            color={color}
            colorSecondary={colorSecondary}
            colorDeep={colorDeep}
            direction={direction}
            shimmer={shimmer}
            ambient={ambient}
          >
            <div className="flex h-full items-center justify-center p-4">
              <Panel variant="liquid-glass" corner="rounded-lg" padding="sm">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {color} → {colorSecondary} → {colorDeep} · {direction}
                </p>
              </Panel>
            </div>
          </GlassBackground>
        </div>
      }
    />
  );
};
