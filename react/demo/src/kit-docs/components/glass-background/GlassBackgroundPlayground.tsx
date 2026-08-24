import React, { useState } from "react";
import { GlassBackground, Panel } from "@cjlapao/ui-kit";
import type {
  GradientDirection,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import {
  gradientDirectionOptions,
  trueColorOptions,
} from "../../shared/options";

export const GlassBackgroundPlayground: React.FC = () => {
  const [color, setColor] = useState<TrueColor>("purple");
  const [colorSecondary, setColorSecondary] = useState<TrueColor>("blue");
  const [colorDeep, setColorDeep] = useState<TrueColor>("indigo");
  const [direction, setDirection] = useState<GradientDirection>("br");
  const [shimmer, setShimmer] = useState(false);
  const [ambient, setAmbient] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Color"
            options={trueColorOptions}
            value={color}
            onChange={(value) => setColor(value as TrueColor)}
          />
          <SelectControl
            label="Secondary color"
            options={trueColorOptions}
            value={colorSecondary}
            onChange={(value) => setColorSecondary(value as TrueColor)}
          />
          <SelectControl
            label="Deep color"
            options={trueColorOptions}
            value={colorDeep}
            onChange={(value) => setColorDeep(value as TrueColor)}
          />
          <SelectControl
            label="Direction"
            options={gradientDirectionOptions}
            value={direction}
            onChange={(value) => setDirection(value as GradientDirection)}
          />
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Shimmer" checked={shimmer} onChange={setShimmer} />
            <ToggleRow label="Ambient glow" checked={ambient} onChange={setAmbient} />
          </div>
        </>
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
