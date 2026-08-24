import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function Range() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider
        range
        value={value}
        onChange={(next) => setValue(next as [number, number])}
      />
      <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        {value[0]} – {value[1]}
      </span>
    </div>
  );
}
