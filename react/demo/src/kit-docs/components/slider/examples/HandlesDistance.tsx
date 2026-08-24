import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function HandlesDistance() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider
        range
        value={value}
        onChange={(next) => setValue(next as [number, number])}
        minStepsBetweenHandles={20}
      />
      <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        {value[0]} – {value[1]} (handles never sit closer than 20 steps)
      </span>
    </div>
  );
}
