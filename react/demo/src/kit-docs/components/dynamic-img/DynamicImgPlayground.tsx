import React, { useState } from "react";
import {
  DynamicImg,
  MultiToggle,
  Panel,
  Textarea,
} from "@cjlapao/ui-kit";
import type { DynamicImgSize, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

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
      note: "Rendered in an inert <img>, and it respects the size scale now.",
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

const SAMPLE_OPTIONS = Object.entries(SAMPLES).map(([key, entry]) => ({
  label: entry.label,
  value: key,
}));

export const DynamicImgPlayground: React.FC = () => {
  const [sample, setSample] = useState<keyof typeof SAMPLES>("filled");
  const [source, setSource] = useState(SAMPLES.filled.value);
  const [size, setSize] = useState<DynamicImgSize>("xl");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [useTone, setUseTone] = useState(true);
  const [colored, setColored] = useState(false);
  const [withAlt, setWithAlt] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Sample"
            options={SAMPLE_OPTIONS}
            value={sample}
            onChange={(v) => {
              const next = v as keyof typeof SAMPLES;
              setSample(next);
              setSource(SAMPLES[next].value);
            }}
          />
          <Control label="Source — edit it freely">
            <Textarea
              rows={6}
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className="font-mono text-xs"
            />
          </Control>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(v) => setSize(v as DynamicImgSize)}
            />
          </Control>
          {!colored && (
            <SelectControl
              label="Tone"
              options={trueColorOptions}
              value={tone}
              onChange={(v) => setTone(v as TrueColor)}
            />
          )}
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Use tone"
              checked={useTone}
              onChange={setUseTone}
            />
            <ToggleRow
              label="Keep own colours"
              checked={colored}
              onChange={setColored}
            />
            <ToggleRow
              label="Accessible name"
              checked={withAlt}
              onChange={setWithAlt}
            />
          </div>
          {SAMPLES[sample].note && (
            <p className="text-xs opacity-70">{SAMPLES[sample].note}</p>
          )}
        </>
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <Panel variant="outlined" padding="md">
            <div className="flex flex-col gap-2">
              <Caption>Rendered</Caption>
              <div className="flex items-center gap-6">
                <DynamicImg
                  src={source}
                  size={size}
                  tone={useTone && !colored ? tone : undefined}
                  colored={colored}
                  alt={withAlt ? "Sample image" : undefined}
                />
                <span className="text-xs opacity-60">
                  {SAMPLES[sample].label}
                </span>
              </div>
            </div>
          </Panel>
          <Panel variant="outlined" padding="md">
            <div className="flex flex-col gap-2">
              <Caption>What was handed in</Caption>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/5 p-3 font-mono text-[10px] dark:bg-white/10">
                {source}
              </pre>
              <p className="text-xs opacity-70">
                Compare with the DOM in dev tools — a hostile sample keeps
                only its geometry.
              </p>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
