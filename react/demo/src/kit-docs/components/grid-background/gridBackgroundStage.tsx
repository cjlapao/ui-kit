import React from "react";
import {
  ColorSwatches,
  Panel,
  type TrueColor,
} from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The pieces of the Grid Background stage that are not the component: the box
 * the lattice fills, the surface sitting on it, and the readout that says what
 * the controls are set to.
 *
 * Everything the Code view prints is built here or from the config, so the
 * snippet cannot drift from the pixels.
 */

/** The bordered box the lattice fills. Printed as mounted. */
export const STAGE_CLASS =
  "relative h-72 w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950";

/** The value the colour picker opens at: the component's own default. */
export const FOLLOW_TEXT = "currentColor";

/** What the content says — one string, so the snippet prints it as one line. */
export const CONTENT_TEXT = "Type over the lattice — legibility is what you are judging.";

/**
 * The surface on the lattice. Two things it must not forget: a fixed height
 * rather than `h-full`, so it reads the same as a sibling of an absolute lattice
 * and as the children of one used as a wrapper; and `relative`, because the
 * lattice is a positioned element and a static one paints under it however the
 * JSX is ordered (GridBackground.tsx:48,50).
 */
export const contentFor = (): React.ReactElement => (
  <div className="relative flex h-72 items-center justify-center p-4">
    <Panel variant="elevated" corner="rounded-lg" padding="sm">
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {CONTENT_TEXT}
      </p>
    </Panel>
  </div>
);

const num = (state: PlaygroundState, id: string, fallback: number): number =>
  Number(state[id] ?? fallback);

/** The docs' own caption of the state — not the component, not in the snippet. */
export const Readout: React.FC<{ state: PlaygroundState }> = ({ state }) => {
  const pattern = String(state.pattern ?? "grid");
  const tone = String(state.lineColor ?? FOLLOW_TEXT);
  const bits = [
    pattern === "dots"
      ? `dots r=${num(state, "dotSize", 1)}px`
      : "grid lines 1px",
    `${num(state, "size", 32)}px lattice`,
    `opacity ${Math.round(num(state, "opacity", 0.12) * 100)}%`,
    tone === FOLLOW_TEXT ? "currentColor" : tone,
    String(state.fade ?? "none") === "none"
      ? "no fade"
      : `${state.fade} fade from ${num(state, "fadeStart", 15)}%`,
    String(state.position ?? "absolute"),
  ];
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
        {bits.join(" · ")}
      </p>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
        The caption above is the docs&apos; own reading of the controls — not
        component output, and not in the Code view.
      </p>
    </div>
  );
};

/** The lattice's colour, chosen the way a colour is chosen: with swatches. */
export const TonePicker: React.FC<{
  value: unknown;
  onSelect: (tone: TrueColor) => void;
}> = ({ value, onSelect }) => (
  <ColorSwatches
    selectable
    size="sm"
    value={value === FOLLOW_TEXT ? undefined : (value as TrueColor)}
    onSelect={onSelect}
    defaultExpanded
  />
);
