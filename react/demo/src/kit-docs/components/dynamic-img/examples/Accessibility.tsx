import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";

const MARK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/></svg>';

const ROWS: { label: string; note: string; img: React.ReactNode }[] = [
  {
    label: "Accessible name",
    note: "alt sets role=\"img\" + aria-label.",
    img: <DynamicImg src={MARK} size="lg" tone="blue" alt="Company logo" />,
  },
  {
    label: "Decorative (no alt)",
    note: "Omitting alt hides it from assistive tech.",
    img: <DynamicImg src={MARK} size="lg" tone="blue" />,
  },
  {
    label: "Tooltip",
    note: "title adds a native tooltip.",
    img: (
      <DynamicImg src={MARK} size="lg" tone="blue" alt="Company logo" title="Company logo" />
    ),
  },
  {
    label: "Fallback icon",
    note: "Rejected markup renders the fallbackIcon.",
    img: (
      <DynamicImg
        src="<div>not an svg</div>"
        size="lg"
        tone="amber"
        fallbackIcon="Image"
        alt="Missing image"
      />
    ),
  },
];

const Accessibility: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
    {ROWS.map((row) => (
      <div
        key={row.label}
        className="flex flex-col items-center gap-2 text-center"
      >
        <div className="flex h-16 w-full items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700">
          {row.img}
        </div>
        <span className="text-xs font-semibold">{row.label}</span>
        <span className="text-[11px] leading-snug opacity-60">{row.note}</span>
      </div>
    ))}
  </div>
);

export default Accessibility;
