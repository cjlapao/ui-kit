import React, { useEffect, useState } from "react";
import { Loader, MultiToggle, Panel } from "@cjlapao/ui-kit";
import type {
  GlassBlurIntensity,
  LoaderSize,
  LoaderVariant,
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
  controlSizeOptions,
  loaderGlassBlurOptions,
  loaderVariantOptions,
  trueColorOptions,
} from "../../shared/options";

export const LoaderPlayground: React.FC = () => {
  const [variant, setVariant] = useState<LoaderVariant>("spinner");
  const [size, setSize] = useState<LoaderSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [progress, setProgress] = useState(40);
  const [indeterminate, setIndeterminate] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [running, setRunning] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [glass, setGlass] = useState(true);
  const [glassBlur, setGlassBlur] = useState<GlassBlurIntensity>("medium");

  // A bar that never moves hides every timing bug in the transition.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setProgress((v) => (v >= 100 ? 0 : v + 7)),
      600,
    );
    return () => window.clearInterval(id);
  }, [running]);

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
                    <Control label="Variant">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={loaderVariantOptions}
                        value={variant}
                        onChange={(v) => setVariant(v as LoaderVariant)}
                      />
                    </Control>
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as LoaderSize)}
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
              ...(variant === "progress"
                ? [
                    {
                      id: "progress",
                      title: "Progress",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <Control label={`Progress — ${Math.round(progress)}%`}>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={progress}
                              disabled={indeterminate}
                              onChange={(event) =>
                                setProgress(Number(event.target.value))
                              }
                              className="w-full accent-blue-500 disabled:opacity-50"
                              aria-label="Loader progress"
                            />
                          </Control>
                          <div className="grid grid-cols-2 gap-2">
                            <ToggleRow
                              label="Indeterminate"
                              checked={indeterminate}
                              onChange={setIndeterminate}
                            />
                            <ToggleRow
                              label="Animate the value"
                              checked={running}
                              onChange={setRunning}
                            />
                          </div>
                        </div>
                      ),
                    },
                  ]
                : []),
              ...(overlay
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <Control label="Glass blur">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={loaderGlassBlurOptions}
                            value={glassBlur}
                            onChange={(v) => setGlassBlur(v as GlassBlurIntensity)}
                          />
                        </Control>
                      ),
                    },
                  ]
                : []),
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Title" checked={showTitle} onChange={setShowTitle} />
                    <ToggleRow label="Label" checked={showLabel} onChange={setShowLabel} />
                    <ToggleRow label="Overlay" checked={overlay} onChange={setOverlay} />
                    <ToggleRow
                      label="Glass overlay"
                      checked={glass}
                      onChange={setGlass}
                    />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            <strong>Indeterminate</strong> sweeps the bar and drops{" "}
            <code>aria-valuenow</code> — its absence is what tells a screen
            reader the extent is unknown, not a zero. The overlay covers the
            nearest positioned ancestor, so it is hosted in a card here.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          {overlay ? (
            <div className="relative h-56 overflow-hidden">
              <Panel variant="outlined" padding="sm">
                <div className="space-y-2 text-sm opacity-80">
                  <p>Quarterly revenue, by region</p>
                  <p className="opacity-70">
                    The overlay fills this card — blur and scrim included —
                    while the content behind stays in place.
                  </p>
                </div>
              </Panel>
              <Loader
                variant={variant}
                size={size}
                color={color}
                progress={progress}
                indeterminate={indeterminate}
                title={showTitle ? "Syncing workspace" : undefined}
                label={showLabel ? "Uploading files" : undefined}
                overlay
                glass={glass}
                glassBlurIntensity={glassBlur}
              />
            </div>
          ) : (
            <Panel variant="outlined" padding="md">
              <div className="flex w-full max-w-md justify-center">
                <Loader
                  variant={variant}
                  size={size}
                  color={color}
                  progress={progress}
                  indeterminate={indeterminate}
                  title={showTitle ? "Syncing workspace" : undefined}
                  label={showLabel ? "Uploading files" : undefined}
                />
              </div>
            </Panel>
          )}
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
