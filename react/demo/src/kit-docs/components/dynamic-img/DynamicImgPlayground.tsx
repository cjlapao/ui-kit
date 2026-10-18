import React, { useState } from "react";
import { ColorSwatches, DynamicImg, Panel, Textarea } from "@cjlapao/ui-kit";
import type { DynamicImgSize, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

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
      note: '`fill="none"` is left alone — the old regex rewrote it and turned outlines into solid blobs.',
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
        "data:image/png;base64,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",
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
  const [glassPanel, setGlassPanel] = useState(false);

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
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as DynamicImgSize)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names.
                        It only paints when the SVG is being recoloured —
                        "keep own colours" wins over every tint. */}
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
                    <ToggleRow
                      label="Glass panel"
                      checked={glassPanel}
                      onChange={setGlassPanel}
                    />
                  </div>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
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
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Whatever is handed in is <em>data, not markup</em>: SVG goes through
            an allowlist sanitiser before it can reach the DOM (script, event
            handlers, remote references — dropped), rasters land in an inert{" "}
            <code>&lt;img&gt;</code>, and anything else shows the{" "}
            <strong>fallback icon</strong> rather than raw markup. Recolouring
            replaces every <code>fill</code> and <code>stroke</code> that is not{" "}
            <code>none</code> — so outlines keep their strokes and gradient
            stops keep their colours; use <strong>keep own colours</strong> to
            opt out entirely.
            {SAMPLES[sample].note && (
              <>
                {" "}
                <em>{SAMPLES[sample].note}</em>
              </>
            )}
          </p>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
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
          <Panel variant={glassPanel ? "glass" : "elevated"} padding="md">
            <div className="flex flex-col gap-2">
              <Caption>What was handed in</Caption>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/5 p-3 font-mono text-[10px] dark:bg-white/10">
                {source}
              </pre>
              <p className="text-xs opacity-70">
                Compare with the DOM in dev tools — a hostile sample keeps only
                its geometry.
              </p>
            </div>
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
