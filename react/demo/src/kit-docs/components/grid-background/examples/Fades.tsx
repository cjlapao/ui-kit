import React from "react";
import { GridBackground } from "@cjlapao/ui-kit";

const Cell: React.FC<{
  label: string;
  fade: "none" | "radial" | "vertical";
}> = ({ label, fade }) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
    <GridBackground
      size={20}
      lineColor="var(--color-violet-500)"
      opacity={0.4}
      fade={fade}
      fadeStart={10}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function Fades() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
      <Cell label={'fade="none"'} fade="none" />
      <Cell label={'fade="radial"'} fade="radial" />
      <Cell label={'fade="vertical"'} fade="vertical" />
    </div>
  );
}
