import React from "react";
import { GlassBackground } from "@cjlapao/ui-kit";

const AmbientCell: React.FC<{ label: string; ambient: boolean }> = ({
  label,
  ambient,
}) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg">
    <GlassBackground
      position="absolute"
      color="blue"
      colorSecondary="indigo"
      direction="br"
      ambient={ambient}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function AmbientOff() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <AmbientCell label="Ambient on" ambient />
      <AmbientCell label="Ambient off" ambient={false} />
    </div>
  );
}
