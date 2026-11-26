import { useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";

// The two ways a segment can stop being selectable are *not* the same
// control: `disabled` keeps it in the row, dimmed, and it may stay the
// selected one; `hidden` removes it outright — and when the hidden segment
// is the selected one, the indicator jumps out of sight instead of sliding
// over the wrong segment.
const OPTIONS: Array<{ value: string; label: string }> = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

/**
 * A `{ hidden: true }` option takes no segment slot, no width from the
 * `activeWidthStrategy="max"` measuring pass, and no keyboard step; the
 * group's `value` is untouched, so hiding the selected segment simply
 * withdraws the pill until the segment — or the selection — comes back.
 */
export default function HiddenDisabled() {
  const [value, setValue] = useState("week");
  const [hidden, setHidden] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<string[]>(["year"]);

  const flip = (
    list: string[],
    set: (next: string[]) => void,
    target: string,
  ) =>
    set(
      list.includes(target)
        ? list.filter((entry) => entry !== target)
        : [...list, target],
    );

  const options: MultiToggleOption[] = OPTIONS.map((option) => ({
    ...option,
    hidden: hidden.includes(option.value) || undefined,
    disabled: disabled.includes(option.value) || undefined,
  }));

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <MultiToggle
        options={options}
        value={value}
        onChange={setValue}
        tone="indigo"
      />
      <div className="flex flex-wrap justify-center gap-2">
        {OPTIONS.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
          >
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              {option.label}
            </span>
            <label className="flex cursor-pointer items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={hidden.includes(option.value)}
                onChange={() => flip(hidden, setHidden, option.value)}
              />
              hide
            </label>
            <label className="flex cursor-pointer items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={disabled.includes(option.value)}
                onChange={() => flip(disabled, setDisabled, option.value)}
              />
              disable
            </label>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Tick <strong>hide</strong> on the selected segment — the pill jumps
        out and the value is kept; tick it back and the pill jumps home.
        Tick <strong>disable</strong> and the segment stays put, dimmed,
        skipped by the arrow keys but still readable as the selection.
      </p>
    </div>
  );
}
