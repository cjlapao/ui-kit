import React from "react";
import { GridBackground, type GridBackgroundPattern } from "@cjlapao/ui-kit";

const Cell: React.FC<{ label: string; pattern: GridBackgroundPattern }> = ({
  label,
  pattern,
}) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
    <GridBackground
      pattern={pattern}
      size={24}
      lineColor="var(--color-cyan-500)"
      opacity={0.35}
      dotSize={1.5}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function GridVsDots() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Cell label={'pattern="grid"'} pattern="grid" />
      <Cell label={'pattern="dots"'} pattern="dots" />
    </div>
  );
}
