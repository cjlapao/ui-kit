import React from "react";
import { GridBackground } from "@cjlapao/ui-kit";

const Cell: React.FC<{ label: string; size: number }> = ({ label, size }) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
    <GridBackground
      pattern="dots"
      size={size}
      dotSize={1.5}
      lineColor="var(--color-amber-500)"
      opacity={0.5}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function Scale() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Cell label="size 12 · dotSize 1.5" size={12} />
      <Cell label="size 64 · dotSize 1.5" size={64} />
    </div>
  );
}
