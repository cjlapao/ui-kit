import React from "react";
import type { SurfaceTone, TrueColor } from "@cjlapao/ui-kit";
import { HueSwatches } from "../../shared/HueControl";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import type { PlaygroundState, PlaygroundValue } from "../../shared/playground/schema";

/**
 * The pieces the Panel playground shares with the source it prints.
 *
 * `Playground` mounts these and `h.jsx` writes them out, so the card on screen
 * and the snippet in the Code view are built from the same objects — which is
 * the only reason the Code view can be trusted to say `media={<div … />}` the
 * way the preview renders it, and to keep quiet about the two props
 * (`vibrancy`, `glassOpacity`) that `Panel.tsx` reads on one variant only.
 */

/** The media block, as the two placements that use it want it. */
const MEDIA_BASE = "w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400";

export const mediaFor = (state: PlaygroundState): React.ReactElement => (
  <div
    className={
      state.mediaPlacement === "overlay"
        ? `h-full min-h-40 ${MEDIA_BASE}`
        : `h-28 ${MEDIA_BASE}`
    }
  />
);

/**
 * The card's own action row. `onClick` is here because a panel action is a
 * button and a button without a handler is a prop the reader will copy without
 * asking what it does; the Code view prints it as the named `onAction` the
 * snippet declares, since what yours should do is not the playground's business.
 */
export interface StageAction {
  label: string;
  variant: "solid" | "outline";
  color: TrueColor;
  size: "sm";
  onClick: () => void;
}

export const actionsFor = (): StageAction[] => [
  { label: "Open", variant: "solid", color: "blue", size: "sm", onClick: () => undefined },
  { label: "Close", variant: "outline", color: "rose", size: "sm", onClick: () => undefined },
];

/** The verbatim placeholder the snippet prints in place of every handler. */
export const HANDLER_BODY = "() => {\n  // your handler\n}";

/** The body copy — the panel's `children`, printed as children, not as a prop. */
export const BODY_TEXT =
  "Children land under the header, in the panel's own body scroll.";

/** `hoverable` and `clickable` are three-state; `auto` is the unprinted case. */
export const triState = (value: PlaygroundValue): boolean | undefined =>
  value === "on" ? true : value === "off" ? false : undefined;

/**
 * `hoverable` / `clickable` as attributes. `auto` prints nothing because the
 * component's own answer to an absent prop is `Boolean(onClick)` (:725,731) —
 * printing `hoverable={undefined}` would describe a decision the reader did not
 * make, and describe it as if the component had.
 */
export const triEmit =
  (name: string) =>
  (value: PlaygroundValue): string | null =>
    value === "on" ? name : value === "off" ? `${name}={false}` : null;

/** A hue control's `undefined` ⇄ state: the empty string means "no hue". */
export const hueOf = (value: PlaygroundValue | undefined): TrueColor | undefined =>
  typeof value === "string" && value !== "" ? (value as TrueColor) : undefined;

/** `"auto"` in state means "the prop is absent", which is what prints nothing. */
export const defined = (value: PlaygroundValue | undefined): string | undefined =>
  typeof value === "string" && value !== "" && value !== "auto"
    ? value
    : undefined;

/**
 * Tone as a swatch row, without its own label — `PlaygroundControls` already
 * labels a `custom` field (`PlaygroundControls.tsx:115`), and a control that
 * labels itself twice is how a controls column drifts out of alignment.
 */
export const ToneLever: React.FC<{
  value: string;
  onSelect: (value: SurfaceTone) => void;
}> = ({ value, onSelect }) => (
  <SurfaceToneSwatches value={value as SurfaceTone} onSelect={onSelect} />
);

/** One hue, with "Auto" as the unprinted third state. */
export const HueLever: React.FC<{
  value?: string;
  autoLabel: string;
  onChange: (value: string | undefined) => void;
}> = ({ value, autoLabel, onChange }) => (
  <HueSwatches
    value={value as TrueColor | undefined}
    autoLabel={autoLabel}
    onSelect={(hue) => onChange(hue)}
  />
);

