import { useState } from "react";
import { Slider } from "@cjlapao/ui-kit";

const BANDS = [
  { label: "Bass", value: 40 },
  { label: "Mid", value: 70 },
  { label: "Treble", value: 55 },
];

export default function Vertical() {
  const [values, setValues] = useState(BANDS.map((band) => band.value));
  return (
    <div className="flex items-end justify-center gap-6">
      {BANDS.map((band, index) => (
        <div key={band.label} className="flex flex-col items-center gap-3">
          <Slider
            value={values[index]}
            onChange={(next) =>
              setValues((prev) =>
                prev.map((v, i) => (i === index ? (next as number) : v)),
              )
            }
            orientation="vertical"
            className="h-56"
            ariaLabel={band.label}
          />
          <span className="font-mono text-xs uppercase text-neutral-500 dark:text-neutral-400">
            {band.label}
          </span>
        </div>
      ))}
    </div>
  );
}
