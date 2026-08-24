import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";

const svg = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;

const SAMPLES: { label: string; value: string; note: string }[] = [
  {
    label: "Filled shape",
    value: svg('<circle cx="12" cy="12" r="10" fill="#2563eb"/>'),
    note: "Fill is replaced — follows the tone.",
  },
  {
    label: "Outline only",
    value: svg(
      '<path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>',
    ),
    note: "fill=\"none\" is left alone, so the outline survives.",
  },
  {
    label: "Gradient",
    value: svg(
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/>',
    ),
    note: "Gradient stops keep their colours.",
  },
  {
    label: "Base64 data URL",
    value: `data:image/svg+xml;base64,${btoa(
      svg('<circle cx="12" cy="12" r="10" fill="#0ea5e9"/>'),
    )}`,
    note: "Decoded and sanitised like raw markup.",
  },
  {
    label: "Raster (PNG)",
    value:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVR42mNkYPhfz0AEYBxVSF+FjIyM/xkYGP4TrRCbYqIVYlNMtEJsiolWiE0x0QqxKSZaITbFRCvEpphohdgUE60Qm2KiFf4HAGkVFsF0uTMzAAAAAElFTkSuQmCC",
    note: "Rendered in an inert <img>, respects the size scale.",
  },
  {
    label: "Hostile SVG",
    value: svg(
      '<script>alert("xss")</script><path d="M4 12h16" stroke="#000" stroke-width="2"/><image href="https://evil.test/pixel.png"/><a href="javascript:alert(1)"><circle cx="12" cy="18" r="3" onload="alert(2)"/></a>',
    ),
    note: "Script, remote image, js: link and onload — all stripped; the safe path survives.",
  },
  {
    label: "Not an image",
    value: "<div>definitely not an svg</div>",
    note: "Rejected outright, so the fallback icon shows.",
  },
];

const SanitisedSources: React.FC = () => (
  <div className="flex flex-wrap gap-4">
    {SAMPLES.map((sample) => (
      <div
        key={sample.label}
        className="flex w-40 flex-col items-center gap-2 text-center"
      >
        <div className="flex h-20 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700">
          <DynamicImg src={sample.value} size="xl" tone="blue" />
        </div>
        <span className="text-xs font-semibold">{sample.label}</span>
        <span className="text-[11px] leading-snug opacity-60">
          {sample.note}
        </span>
      </div>
    ))}
  </div>
);

export default SanitisedSources;
