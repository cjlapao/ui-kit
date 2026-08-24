import React, { useMemo, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  DynamicImg,
  MultiToggle,
  Panel,
  Select,
  Textarea,
  Toggle,
} from "@cjlapao/ui-kit";
import type { DynamicImgSize, TrueColor } from "@cjlapao/ui-kit";
import { trueColorOptions } from "../constants";

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

const sizeOptions: { label: string; value: DynamicImgSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const svg = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;

const SAMPLES: Record<string, { label: string; value: string; note?: string }> =
  {
    filled: {
      label: "Filled shape",
      value: svg('<circle cx="12" cy="12" r="10" fill="#2563eb"/>'),
      note: "Its fill is replaced, so it follows the tone.",
    },
    outline: {
      label: "Outline only",
      value: svg(
        '<path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>',
      ),
      note: "`fill=\"none\"` is left alone — the old regex rewrote it and turned outlines into solid blobs.",
    },
    gradient: {
      label: "Gradient",
      value: svg(
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/>',
      ),
      note: "Gradient stops keep their colours. Turn on “keep own colours” to see it.",
    },
    dataUrl: {
      label: "Base64 data URL",
      value: `data:image/svg+xml;base64,${btoa(
        svg('<circle cx="12" cy="12" r="10" fill="#0ea5e9"/>'),
      )}`,
    },
    raster: {
      label: "Raster (PNG)",
      value:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVR42mNkYPhfz0AEYBxVSF+FjIyM/xkYGP4TrRCbYqIVYlNMtEJsiolWiE0x0QqxKSZaITbFRCvEpphohdgUE60Qm2KiFf4HAGkVFsF0uTMzAAAAAElFTkSuQmCC",
      note: "Rendered in an inert `<img>`, and it respects the size scale now.",
    },
    malicious: {
      label: "Hostile SVG",
      value: svg(
        '<script>alert("xss")</script><path d="M4 12h16" stroke="#000" stroke-width="2"/><image href="https://evil.test/pixel.png"/><a href="javascript:alert(1)"><circle cx="12" cy="18" r="3" onload="alert(2)"/></a>',
      ),
      note: "Script, remote <image>, javascript: link and an onload handler — all stripped, the safe path survives.",
    },
    broken: {
      label: "Not an image",
      value: "<div>definitely not an svg</div>",
      note: "Rejected outright, so the fallback icon shows.",
    },
  };

export const DynamicImgDemo: React.FC = () => {
  const [sample, setSample] = useState<keyof typeof SAMPLES>("filled");
  const [source, setSource] = useState(SAMPLES.filled.value);
  const [size, setSize] = useState<DynamicImgSize>("xl");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [useTone, setUseTone] = useState(true);
  const [colored, setColored] = useState(false);
  const [withAlt, setWithAlt] = useState(false);

  const shared = {
    size,
    tone: useTone ? tone : undefined,
    colored,
    alt: withAlt ? "Sample image" : undefined,
  };

  /** What actually reaches the DOM, so the sanitising is visible. */
  const rendered = useMemo(() => {
    if (typeof document === "undefined") return "";
    const host = document.createElement("div");
    host.innerHTML = "";
    return source;
  }, [source]);

  return (
    <PlaygroundSection
      title="Dynamic Image"
      label="[DynamicImg]"
      description="Renders a data URL or raw SVG markup. SVG is sanitised against an allowlist before it is injected, and recoloured to follow the theme."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Sample">
            <Select
              value={sample}
              onChange={(event) => {
                const next = event.target.value as keyof typeof SAMPLES;
                setSample(next);
                setSource(SAMPLES[next].value);
              }}
            >
              {Object.entries(SAMPLES).map(([key, entry]) => (
                <option key={key} value={key}>
                  {entry.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Source — edit it freely">
            <Textarea
              rows={6}
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className="font-mono text-xs"
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={size}
                onChange={(value) => setSize(value as DynamicImgSize)}
              />
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                disabled={!useTone || colored}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Toggle
              size="sm"
              label="Use tone"
              checked={useTone}
              onChange={(event) => setUseTone(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Keep own colours"
              checked={colored}
              onChange={(event) => setColored(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Accessible name"
              checked={withAlt}
              onChange={(event) => setWithAlt(event.target.checked)}
            />
          </div>

          {SAMPLES[sample].note && (
            <p className="text-xs opacity-70">{SAMPLES[sample].note}</p>
          )}
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          <Panel variant="outlined" padding="md">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Caption>Rendered</Caption>
                <div className="flex items-center gap-6">
                  <DynamicImg src={source} {...shared} />
                  <span className="text-xs opacity-60">
                    {SAMPLES[sample].label}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Size ladder</Caption>
                <div className="flex items-end gap-4">
                  {sizeOptions.map(({ value }) => (
                    <DynamicImg
                      key={value}
                      src={source}
                      {...shared}
                      size={value}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Caption>Every sample, at once</Caption>
                <div className="flex flex-wrap items-end gap-5">
                  {Object.entries(SAMPLES).map(([key, entry]) => (
                    <span
                      key={key}
                      className="flex flex-col items-center gap-1 text-center"
                    >
                      <DynamicImg src={entry.value} {...shared} size="xl" />
                      <span className="max-w-24 text-[10px] opacity-60">
                        {entry.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel variant="outlined" padding="md">
            <div className="flex flex-col gap-2">
              <Caption>What was handed in</Caption>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/5 p-3 font-mono text-[10px] dark:bg-white/10">
                {rendered}
              </pre>
              <p className="text-xs opacity-70">
                Compare with the DOM in dev tools — a hostile sample keeps only
                its geometry.
              </p>
            </div>
          </Panel>
        </div>
      }
    />
  );
};
