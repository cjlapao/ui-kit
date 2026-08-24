import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

export default function ValueChange() {
  const [value, setValue] = useState(50);
  const [endValue, setEndValue] = useState(50);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
        <div>
          change:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">{value}</strong>
        </div>
        <div>
          slideend:{" "}
          <strong className="text-neutral-900 dark:text-neutral-100">
            {endValue}
          </strong>
        </div>
      </div>
      <Slider
        value={value}
        onChange={(next) => setValue(next as number)}
        onSlideEnd={(next) => setEndValue(next as number)}
      />
    </div>
  );
}
