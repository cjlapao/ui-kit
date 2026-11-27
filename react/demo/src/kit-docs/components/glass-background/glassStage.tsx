import React from "react";
import { ColorSwatches, Panel, type TrueColor } from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The two pieces of the Glass Background stage that are not the component:
 * the tone picker the controls column renders, and the glass panel the
 * backdrop carries.
 *
 * Both live here so `glassBackgroundPlayground.ts` can name them as data
 * without becoming a `.tsx`: the config declares the overlay once, the preview
 * mounts it and the Code view prints it, from the same object.
 */

/** The positioned ancestor `position="absolute"` needs — and the frame the fixed mode is kept inside. */
export const STAGE_CLASS =
  "relative h-72 w-full max-w-lg overflow-hidden rounded-xl";

/** The value that means "I did not choose this stop; the kit does". */
export const DERIVED = "derived";

/** A stop the reader has not chosen, named for what it is instead of by colour. */
export const stopLabel = (value: unknown): string =>
  value === undefined || value === DERIVED ? "derived" : String(value);

/** The panel on the backdrop — the component's children, and nothing else on screen. */
export const overlayFor = (state: PlaygroundState): React.ReactElement => (
  <div className="flex h-full items-center justify-center p-4">
    <Panel variant="liquid-glass" corner="rounded-lg" padding="sm">
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {`${String(state.color ?? "blue")} → ${stopLabel(state.colorSecondary)} → ${stopLabel(
          state.colorDeep,
        )} · ${String(state.direction ?? "br")}`}
      </p>
    </Panel>
  </div>
);

/**
 * One gradient stop: the tone strip, and for a derived stop the way back to
 * "the kit decides".
 *
 * While a stop is derived `ColorSwatches` gets no `value`, so no dot wears the
 * ring — the gradient on screen is wearing a colour nobody picked, and the
 * picker should not pretend otherwise.
 */
export const StopPicker: React.FC<{
  value: unknown;
  /** The tone the stop jumps to when the reader takes it out of derivation. */
  fallback?: TrueColor;
  /** Omitted for a stop that has a real default and is never derived. */
  onToggleDerived?: () => void;
  onSelect: (tone: TrueColor) => void;
}> = ({ value, fallback, onToggleDerived, onSelect }) => {
  const derived = value === undefined || value === DERIVED;
  return (
    <div className="flex flex-col gap-1.5">
      <ColorSwatches
        selectable
        size="sm"
        defaultExpanded
        value={derived ? undefined : (value as TrueColor)}
        onSelect={onSelect}
      />
      {onToggleDerived ? (
        <button
          type="button"
          aria-pressed={derived}
          onClick={() => (derived ? onSelect(fallback ?? "blue") : onToggleDerived())}
          className="w-fit text-xs font-medium text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          {derived ? "Stop is derived from the tone" : "Back to derived"}
        </button>
      ) : null}
    </div>
  );
};
