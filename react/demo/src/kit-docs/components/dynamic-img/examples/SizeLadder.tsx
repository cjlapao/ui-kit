import React from "react";
import { DynamicImg } from "@cjlapao/ui-kit";
import type { DynamicImgSize } from "@cjlapao/ui-kit";

const SIZES: { value: DynamicImgSize; label: string }[] = [
  { value: "xs", label: "xs · 12px" },
  { value: "sm", label: "sm · 16px" },
  { value: "md", label: "md · 24px" },
  { value: "lg", label: "lg · 32px" },
  { value: "xl", label: "xl · 40px" },
];

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563eb"/></svg>`;

const SizeLadder: React.FC = () => (
  <div className="flex items-end gap-6">
    {SIZES.map(({ value, label }) => (
      <div key={value} className="flex flex-col items-center gap-2">
        <DynamicImg src={MARK} size={value} tone="blue" />
        <span className="text-[11px] opacity-60">{label}</span>
      </div>
    ))}
  </div>
);

export default SizeLadder;
