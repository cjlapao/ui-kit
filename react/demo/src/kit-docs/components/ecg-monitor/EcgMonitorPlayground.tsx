import React, { useState } from "react";
import { EcgMonitor, MultiToggle } from "@cjlapao/ui-kit";
import type { EcgMonitorState } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ecgMonitorStateOptions } from "../../shared/options";

export const EcgMonitorPlayground: React.FC = () => {
  const [state, setState] = useState<EcgMonitorState>("healthy");
  const [bpm, setBpm] = useState(60);
  const [width, setWidth] = useState(560);
  const [height, setHeight] = useState(160);
  const [lineWidth, setLineWidth] = useState(2);
  const [glow, setGlow] = useState(0.6);
  const [useFullWidth, setUseFullWidth] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [lineColorEnabled, setLineColorEnabled] = useState(false);
  const [lineColor, setLineColor] = useState("#22d3ee");

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="State">
            <MultiToggle
              fullWidth
              size="sm"
              options={ecgMonitorStateOptions}
              value={state}
              onChange={(value) => setState(value as EcgMonitorState)}
            />
          </Control>
          <Control label={`BPM (${bpm})`}>
            <input
              type="range"
              min={20}
              max={180}
              step={5}
              value={bpm}
              onChange={(event) => setBpm(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Control>
          <Control label={`Width (${width}px)`}>
            <input
              type="range"
              min={240}
              max={960}
              step={20}
              value={width}
              disabled={useFullWidth}
              onChange={(event) => setWidth(Number(event.target.value))}
              className="w-full accent-blue-500 disabled:opacity-40"
            />
          </Control>
          <Control label={`Height (${height}px)`}>
            <input
              type="range"
              min={80}
              max={320}
              step={8}
              value={height}
              onChange={(event) => setHeight(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Control>
          <Control label={`Line width (${lineWidth}px)`}>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={lineWidth}
              onChange={(event) => setLineWidth(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Control>
          <Control label={`Glow (${Math.round(glow * 100)}%)`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={glow}
              onChange={(event) => setGlow(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Use full width"
              checked={useFullWidth}
              onChange={setUseFullWidth}
            />
            <ToggleRow
              label="Show grid"
              checked={showGrid}
              onChange={setShowGrid}
            />
            <ToggleRow
              label="Custom line colour"
              checked={lineColorEnabled}
              onChange={setLineColorEnabled}
            />
          </div>
          <Control label="Line colour">
            <input
              type="color"
              value={lineColor}
              disabled={!lineColorEnabled}
              onChange={(event) => setLineColor(event.target.value)}
              className="h-8 w-full cursor-pointer rounded border border-slate-200 bg-transparent disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
            />
          </Control>
          <p className="text-xs opacity-70">
            The canvas exposes itself as an <code>img</code> with a text
            description, so screen readers hear “Healthy, 60 beats per minute”
            instead of pixels.
          </p>
        </>
      }
      preview={
        <div className="flex w-full flex-col gap-6">
          <EcgMonitor
            state={state}
            width={width}
            height={height}
            lineColor={lineColorEnabled ? lineColor : undefined}
            lineGlowIntensity={glow}
            lineWidth={lineWidth}
            useFullWidth={useFullWidth}
            bpm={bpm}
            showGrid={showGrid}
            className="rounded-xl"
          />
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
