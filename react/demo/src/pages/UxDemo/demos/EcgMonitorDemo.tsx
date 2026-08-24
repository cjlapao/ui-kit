// @ts-nocheck
import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { EcgMonitor, MultiToggle, Toggle } from "@cjlapao/ui-kit";
import { EcgMonitorState } from "@cjlapao/ui-kit";
import { ecgMonitorStateOptions } from "../constants";

export const EcgMonitorDemo: React.FC = () => {
  const [ecgState, setEcgState] = useState<EcgMonitorState>("healthy");
  const [ecgWidth, setEcgWidth] = useState(560);
  const [ecgHeight, setEcgHeight] = useState(160);
  const [ecgUseFullWidth, setEcgUseFullWidth] = useState(false);
  const [ecgBpm, setEcgBpm] = useState(60);
  const [ecgGlow, setEcgGlow] = useState(0.6);
  const [ecgLineWidth, setEcgLineWidth] = useState(2);
  const [ecgShowGrid, setEcgShowGrid] = useState(false);
  const [ecgLineColorEnabled, setEcgLineColorEnabled] = useState(false);
  const [ecgLineColor, setEcgLineColor] = useState("#22d3ee");

  return (
    <PlaygroundSection
      title="ECG Monitor"
      label="[EcgMonitor]"
      description="Canvas ECG trace for service health — a steady rhythm when healthy, a jittered one when degraded, a flatline when down."
      controls={
        <div className="space-y-4 text-sm">
          <label className="flex flex-col gap-2">
            <span>State</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={ecgMonitorStateOptions}
              value={ecgState}
              onChange={(value) => setEcgState(value as EcgMonitorState)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>BPM ({ecgBpm})</span>
            <input
              type="range"
              min={20}
              max={180}
              step={5}
              value={ecgBpm}
              onChange={(event) => setEcgBpm(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Width ({ecgWidth}px)</span>
            <input
              type="range"
              min={240}
              max={960}
              step={20}
              value={ecgWidth}
              disabled={ecgUseFullWidth}
              onChange={(event) => setEcgWidth(Number(event.target.value))}
              className="w-full accent-blue-500 disabled:opacity-40"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Height ({ecgHeight}px)</span>
            <input
              type="range"
              min={80}
              max={320}
              step={8}
              value={ecgHeight}
              onChange={(event) => setEcgHeight(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Line width ({ecgLineWidth}px)</span>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={ecgLineWidth}
              onChange={(event) => setEcgLineWidth(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Glow ({Math.round(ecgGlow * 100)}%)</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={ecgGlow}
              onChange={(event) => setEcgGlow(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Use full width</span>
            <Toggle
              size="sm"
              checked={ecgUseFullWidth}
              onChange={(event) => setEcgUseFullWidth(event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Show grid</span>
            <Toggle
              size="sm"
              checked={ecgShowGrid}
              onChange={(event) => setEcgShowGrid(event.target.checked)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center justify-between gap-2">
              <span>Line color</span>
              <Toggle
                size="sm"
                checked={ecgLineColorEnabled}
                onChange={(event) =>
                  setEcgLineColorEnabled(event.target.checked)
                }
              />
            </span>
            <input
              type="color"
              value={ecgLineColor}
              disabled={!ecgLineColorEnabled}
              onChange={(event) => setEcgLineColor(event.target.value)}
              className="h-8 w-full cursor-pointer rounded border border-slate-200 bg-transparent disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
            />
          </label>
        </div>
      }
      preview={
        <div className="flex flex-col gap-6">
          <EcgMonitor
            state={ecgState}
            width={ecgWidth}
            height={ecgHeight}
            lineColor={ecgLineColorEnabled ? ecgLineColor : undefined}
            lineGlowIntensity={ecgGlow}
            lineWidth={ecgLineWidth}
            useFullWidth={ecgUseFullWidth}
            bpm={ecgBpm}
            showGrid={ecgShowGrid}
            className="rounded-xl"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Healthy
              </span>
              <EcgMonitor
                state="healthy"
                height={96}
                useFullWidth
                showGrid={ecgShowGrid}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Warning
              </span>
              <EcgMonitor
                state="warning"
                height={96}
                useFullWidth
                showGrid={ecgShowGrid}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Unhealthy
              </span>
              <EcgMonitor
                state="unhealthy"
                height={96}
                useFullWidth
                showGrid={ecgShowGrid}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      }
    />
  );
};
