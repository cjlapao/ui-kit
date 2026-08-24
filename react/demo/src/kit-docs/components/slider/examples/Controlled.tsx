import { useState } from "react";
import { Input, Slider } from "@cjlapao/ui-kit";

export default function Controlled() {
  const [value, setValue] = useState(50);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (event.target.value !== "" && Number.isFinite(next)) {
            setValue(Math.min(100, Math.max(0, next)));
          }
        }}
        aria-label="Value"
      />
      <Slider value={value} onChange={(next) => setValue(next as number)} />
    </div>
  );
}
