import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function Step() {
  const [value, setValue] = useState(20);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <Slider
        value={value}
        onChange={(next) => setValue(next as number)}
        step={20}
      />
      <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        Value:{" "}
        <strong className="text-neutral-900 dark:text-neutral-100">{value}</strong>
      </span>
    </div>
  );
}
