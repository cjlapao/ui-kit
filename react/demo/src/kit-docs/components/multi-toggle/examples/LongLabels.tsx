import { useId, useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "once", label: "One step" },
  { value: "repeat", label: "Repeat for each item in the collection" },
  { value: "skip", label: "Skip" },
];

export default function LongLabels() {
  const widthId = useId();
  const [width, setWidth] = useState(300);
  const [value, setValue] = useState("repeat");

  return (
    <div className="flex min-w-0 w-full flex-col gap-5">
      <label htmlFor={widthId} className="flex flex-col gap-2 text-sm">
        <span>Parent width: {width}px</span>
        <input
          id={widthId}
          type="range"
          min={180}
          max={640}
          step={10}
          value={width}
          onChange={(event) => setWidth(Number(event.target.value))}
          className="w-full max-w-sm"
        />
      </label>

      {[false, true].map((fullWidth) => (
        <div key={String(fullWidth)} className="flex min-w-0 flex-col gap-2">
          <p className="text-sm font-medium">
            {fullWidth ? "Full width: equal segments with ellipsis" : "Auto width: natural label sizes"}
          </p>
          <div
            style={{ width, maxWidth: "100%" }}
            className="rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500"
          >
            <div className="min-w-0 py-3">
              <MultiToggle
                aria-label={fullWidth ? "Full width execution mode" : "Auto width execution mode"}
                options={OPTIONS}
                value={value}
                onChange={setValue}
                fullWidth={fullWidth}
              />
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {fullWidth
              ? "The control fits its parent. Hover or focus a shortened option to read it in full."
              : "The control grows up to the parent width, then shortens labels. Hover or focus an option to read its full label."}
          </p>
        </div>
      ))}
    </div>
  );
}
