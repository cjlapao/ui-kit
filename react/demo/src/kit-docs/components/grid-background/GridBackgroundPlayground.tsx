import React, { useState } from "react";
import {
  ColorSwatches,
  GridBackground,
  Panel,
  Slider,
  type GridBackgroundPattern,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { ChoiceControl, Control, PlaygroundPanel } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  gridBackgroundFadeOptions,
  gridBackgroundPatternOptions,
} from "../../shared/options";

export const GridBackgroundPlayground: React.FC = () => {
  const [pattern, setPattern] = useState<GridBackgroundPattern>("grid");
  const [size, setSize] = useState(32);
  const [opacity, setOpacity] = useState(20);
  const [tone, setTone] = useState<TrueColor>("cyan");
  const [dotSize, setDotSize] = useState(1.5);
  const [fade, setFade] = useState<"none" | "radial" | "vertical">("radial");
  const [fadeStart, setFadeStart] = useState(25);

  const readout = [
    pattern === "dots" ? `dots ${dotSize}px` : "grid",
    `${size}px`,
    `${opacity}%`,
    fade === "none" ? "no fade" : `${fade} fade`,
  ].join(" · ");

  return (
    <PlaygroundPanel
      hideBackgroundToggle
      controls={
        <ControlAccordion
          groups={[
            {
              id: "lattice",
              title: "Lattice",
              defaultOpen: true,
              controls: (
                <>
                  <ChoiceControl
                    label="Pattern"
                    options={gridBackgroundPatternOptions}
                    value={pattern}
                    onChange={(value) => setPattern(value as GridBackgroundPattern)}
                  />
                  <Control label={`Spacing: ${size}px`}>
                    <Slider
                      ariaLabel="Lattice spacing"
                      min={8}
                      max={96}
                      value={size}
                      onChange={(value) => setSize(value as number)}
                    />
                  </Control>
                  <Control label={`Opacity: ${opacity}%`}>
                    <Slider
                      ariaLabel="Lattice opacity"
                      max={100}
                      value={opacity}
                      onChange={(value) => setOpacity(value as number)}
                    />
                  </Control>
                  {/* A colour decision, so swatches rather than a list of words —
                      the same control the Agent Map playground uses for its grid tone. */}
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
            // Conditional group: dots own their radius, lines do not.
            ...(pattern === "dots"
              ? [
                  {
                    id: "dots",
                    title: "Dots",
                    defaultOpen: true,
                    controls: (
                      <Control label={`Dot radius: ${dotSize}px`}>
                        <Slider
                          ariaLabel="Dot radius"
                          min={0.5}
                          max={8}
                          step={0.25}
                          value={dotSize}
                          onChange={(value) => setDotSize(value as number)}
                        />
                      </Control>
                    ),
                  },
                ]
              : []),
            {
              id: "fade",
              title: "Edge fade",
              defaultOpen: true,
              controls: (
                <>
                  <ChoiceControl
                    label="Fade"
                    options={gridBackgroundFadeOptions}
                    value={fade}
                    onChange={(value) =>
                      setFade(value as "none" | "radial" | "vertical")
                    }
                  />
                  {fade !== "none" && (
                    <Control label={`Fade start: ${fadeStart}%`}>
                      <Slider
                        ariaLabel="Fade start"
                        max={85}
                        value={fadeStart}
                        onChange={(value) => setFadeStart(value as number)}
                      />
                    </Control>
                  )}
                </>
              ),
            },
          ]}
        />
      }
      preview={
        <div className="relative h-72 w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <GridBackground
            pattern={pattern}
            size={size}
            dotSize={dotSize}
            lineColor={`var(--color-${tone}-500)`}
            opacity={opacity / 100}
            fade={fade}
            fadeStart={fadeStart}
          />
          {/* Real content on top, so legibility is what you are judging —
              a lattice you cannot read through is not a background. */}
          <div className="relative flex h-full items-center justify-center p-4">
            <Panel variant="elevated" corner="rounded-lg" padding="sm">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {readout}
              </p>
            </Panel>
          </div>
        </div>
      }
    />
  );
};

export default GridBackgroundPlayground;
