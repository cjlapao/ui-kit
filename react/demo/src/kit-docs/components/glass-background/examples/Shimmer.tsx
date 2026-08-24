import React from "react";
import { GlassBackground } from "@cjlapao/ui-kit";

const ShimmerCell: React.FC<{ label: string; shimmer: boolean }> = ({
  label,
  shimmer,
}) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg">
    <GlassBackground position="absolute" color="purple" direction="br" ambient shimmer={shimmer} />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function Shimmer() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <ShimmerCell label="Shimmer off" shimmer={false} />
      <ShimmerCell label="Shimmer on" shimmer />
    </div>
  );
}
