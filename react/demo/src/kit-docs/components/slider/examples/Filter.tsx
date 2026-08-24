import { useState } from "react";
import { MultiToggle, Slider } from "@cjlapao/ui-kit";

const FILTERS = [
  { label: "Contrast", value: "Contrast" },
  { label: "Brightness", value: "Brightness" },
  { label: "Sepia", value: "Sepia" },
];

export default function Filter() {
  const [active, setActive] = useState("Contrast");
  const [values, setValues] = useState<Record<string, number>>({
    Contrast: 100,
    Brightness: 100,
    Sepia: 0,
  });
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="h-44 w-64 rounded-xl bg-linear-to-br from-sky-300 via-indigo-400 to-rose-400 dark:from-sky-700 dark:via-indigo-800 dark:to-rose-900"
        style={{
          filter: `contrast(${values.Contrast}%) brightness(${values.Brightness}%) sepia(${values.Sepia}%)`,
        }}
        aria-hidden="true"
      />
      <MultiToggle
        size="sm"
        options={FILTERS}
        value={active}
        onChange={setActive}
        truncateOverflow={false}
      />
      <div className="w-64">
        <Slider
          min={0}
          max={200}
          value={values[active]}
          onChange={(next) =>
            setValues((prev) => ({ ...prev, [active]: next as number }))
          }
        />
      </div>
      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {active}: {values[active]}%
      </span>
    </div>
  );
}
