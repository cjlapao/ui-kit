import { ColorSwatches, type TrueColor } from "@cjlapao/ui-kit";
import { Control } from "./PlaygroundPanel";

/**
 * A hue picker with an `Auto` exit.
 *
 * `activeTone`, `pulseTone` and `checkboxTone` all default to whatever the card
 * already wears, and a swatch row alone cannot say that: `undefined` is a
 * decision here, not the absence of one, so it gets a control of its own
 * (the same shape `SurfaceToneSwatches` gives `none`).
 */
export function HueSwatches({
  value,
  onSelect,
  autoLabel = "Auto — the card's own hue",
}: {
  value?: TrueColor;
  onSelect: (value?: TrueColor) => void;
  /** Names what auto means for this prop, since it differs between them. */
  autoLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-pressed={value === undefined}
        onClick={() => onSelect(undefined)}
        className={`rounded-md border px-3 py-1 text-xs ${
          value === undefined
            ? "border-neutral-500 bg-neutral-100 dark:bg-neutral-800"
            : "border-neutral-300 dark:border-neutral-700"
        }`}
      >
        {autoLabel}
      </button>
      <ColorSwatches
        selectable
        size="sm"
        value={value}
        onSelect={onSelect}
        defaultExpanded
      />
    </div>
  );
}

export function HueControl({
  label,
  value,
  onChange,
  autoLabel,
}: {
  label: string;
  value?: TrueColor;
  onChange: (value?: TrueColor) => void;
  autoLabel?: string;
}) {
  return (
    <Control label={label}>
      <HueSwatches value={value} onSelect={onChange} autoLabel={autoLabel} />
    </Control>
  );
}
