import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";

const OUTLINE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 12h16M12 4v16" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>';

const GRADIENT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f43f5e"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#g)"/></svg>';

const VARIANTS: { label: string; note: string; img: React.ReactNode }[] = [
  {
    label: "Tone: blue",
    note: "Recoloured to the theme colour.",
    img: <DynamicImg src={OUTLINE} size="xl" tone="blue" />,
  },
  {
    label: "Tone: violet",
    note: "A different theme colour.",
    img: <DynamicImg src={OUTLINE} size="xl" tone="violet" />,
  },
  {
    label: "Raw fill",
    note: "fill overrides the tone.",
    img: <DynamicImg src={OUTLINE} size="xl" fill="#f43f5e" stroke="#f43f5e" />,
  },
  {
    label: "Raw stroke",
    note: "stroke paints only the outline.",
    img: <DynamicImg src={OUTLINE} size="xl" stroke="#0ea5e9" />,
  },
  {
    label: "Keep own colours",
    note: "colored preserves the gradient.",
    img: <DynamicImg src={GRADIENT} size="xl" tone="blue" colored />,
  },
];

const Recolouring: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {VARIANTS.map((variant) => (
      <div
        key={variant.label}
        className="flex flex-col items-center gap-2 text-center"
      >
        <div className="flex h-16 w-full items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700">
          {variant.img}
        </div>
        <span className="text-xs font-semibold">{variant.label}</span>
        <span className="text-[11px] leading-snug opacity-60">
          {variant.note}
        </span>
      </div>
    ))}
  </div>
);

export default Recolouring;
