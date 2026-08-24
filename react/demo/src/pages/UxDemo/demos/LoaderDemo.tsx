import React, { useEffect, useState } from "react";
import {
  Loader,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  GlassBlurIntensity,
  LoaderSize,
  LoaderVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  controlSizeOptions,
  loaderGlassBlurOptions,
  loaderVariantOptions,
  trueColorOptions,
} from "../constants";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OverlayHost: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative h-56 overflow-hidden">
    <Panel variant="outlined" padding="sm">
      <div className="space-y-2 text-sm opacity-80">
        <p>Quarterly revenue, by region</p>
        <p className="opacity-70">
          The overlay fills this card — blur and scrim included — while the
          content behind stays in place.
        </p>
      </div>
    </Panel>
    {children}
  </div>
);

export const LoaderDemo: React.FC = () => {
  const [variant, setVariant] = useState<LoaderVariant>("spinner");
  const [size, setSize] = useState<LoaderSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [indeterminate, setIndeterminate] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [glass, setGlass] = useState(true);
  const [glassBlur, setGlassBlur] = useState<GlassBlurIntensity>("medium");
  const [progress, setProgress] = useState(40);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setProgress((v) => (v >= 100 ? 0 : v + 7)),
      600,
    );
    return () => window.clearInterval(id);
  }, [running]);

  const shared = {
    variant,
    size,
    color,
    indeterminate,
    progress,
    title: showTitle ? "Syncing workspace" : undefined,
    label: showLabel ? "Uploading files" : undefined,
  };

  return (
    <PlaygroundSection
      title="Loader"
      label="[Loader]"
      description="A loading state that can be a spinner, a progress bar, or an overlay covering its card. Size comes from the shared control scale and drives the ring, the bar, and the type together; the glass overlay takes its fill from the shared theme."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <MultiToggle
                fullWidth
                size="sm"
                options={loaderVariantOptions}
                value={variant}
                onChange={(v) => setVariant(v as LoaderVariant)}
              />
            </Field>
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(v) => setSize(v as LoaderSize)}
              />
            </Field>
          </div>

          <Field label="Tone">
            <Select
              value={color}
              onChange={(event) => setColor(event.target.value as TrueColor)}
            >
              {trueColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          {variant === "progress" && (
            <Field label={`Progress — ${Math.round(progress)}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                disabled={indeterminate}
                onChange={(event) => setProgress(Number(event.target.value))}
                className="w-full accent-blue-500 disabled:opacity-50"
              />
            </Field>
          )}

          {overlay && (
            <Field label="Glass blur">
              <MultiToggle
                fullWidth
                size="sm"
                options={loaderGlassBlurOptions}
                value={glassBlur}
                onChange={(v) => setGlassBlur(v as GlassBlurIntensity)}
              />
            </Field>
          )}

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Indeterminate"
              checked={indeterminate}
              onChange={(event) => setIndeterminate(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Title"
              checked={showTitle}
              onChange={(event) => setShowTitle(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Label"
              checked={showLabel}
              onChange={(event) => setShowLabel(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Animate the value"
              checked={running}
              onChange={(event) => setRunning(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Overlay"
              checked={overlay}
              onChange={(event) => setOverlay(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Glass overlay"
              checked={glass}
              onChange={(event) => setGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            <strong>Indeterminate</strong> sweeps the bar and drops{" "}
            <code>aria-valuenow</code> — its absence is what tells a screen
            reader the extent is unknown, not a zero. The overlay covers the
            nearest positioned ancestor, so it is hosted in a card here.
          </p>
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          <div className="flex flex-col gap-2">
            <Caption>Current settings</Caption>
            {overlay ? (
              <OverlayHost>
                <Loader {...shared} overlay glass={glass} glassBlurIntensity={glassBlur} />
              </OverlayHost>
            ) : (
              <Panel variant="outlined" padding="md">
                <Loader {...shared} />
              </Panel>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Caption>Size ladder</Caption>
            <div className="flex flex-wrap items-end gap-6">
              {CONTROL_SIZES.map((each) => (
                <Loader key={each} size={each} color={color} label={each} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Caption>Determinate versus indeterminate</Caption>
            <div className="grid gap-4 md:grid-cols-2">
              <Loader variant="progress" size="md" color={color} progress={progress} label="Known extent" />
              <Loader variant="progress" size="md" color={color} indeterminate label="Unknown extent" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Caption>Overlay — scrim versus glass</Caption>
            <div className="grid gap-4 md:grid-cols-2">
              <OverlayHost>
                <Loader overlay title="Working…" size="md" color={color} />
              </OverlayHost>
              <OverlayHost>
                <Loader overlay title="Working…" size="md" color={color} glass glassBlurIntensity={glassBlur} />
              </OverlayHost>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Caption>Every tone</Caption>
            <div className="grid gap-3 md:grid-cols-2">
              {TRUE_COLORS.map((each) => (
                <div key={each} className="flex items-center gap-3">
                  <Loader size="sm" color={each} label={each} />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
