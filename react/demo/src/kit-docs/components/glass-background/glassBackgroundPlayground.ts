import { createElement } from "react";
import { gradientDirectionOptions } from "../../shared/options";
import type {
  PlaygroundConfig,
  PlaygroundControlContext,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import { DERIVED, StopPicker, overlayFor } from "./glassStage";

/**
 * Glass Background's playground as data.
 *
 * Every `default` below is the destructuring in
 * `react/src/components/GlassBackground.tsx:49-61` — `position="absolute"`,
 * `color="blue"`, `direction="br"`, `shimmer` off, `ambient` on — so the stage
 * opens wearing the component's own defaults and the Code view opens with
 * nothing but the children it is mounting.
 *
 * The two derived stops are the interesting case. `colorSecondary` and
 * `colorDeep` have **no default in the component**: omit them and
 * `getGlassBackgroundSecondaryTone` / `getGlassBackgroundDeepTone`
 * (`common/theme/glass.ts:419,423`) pick a neighbouring hue. Those fields
 * therefore open at `DERIVED`, a value that is not a colour and prints
 * nothing — a snippet claiming `colorSecondary="indigo"` would say the reader
 * chose indigo.
 */

export { DERIVED };

/** A stop's value with the field's own default applied — the emitter's rule. */
export const stopValue = (
  state: PlaygroundState,
  id: "colorSecondary" | "colorDeep",
): string => (state[id] ?? DERIVED) as string;

/** Whether the kit still owns this stop. */
export const isDerived = (
  state: PlaygroundState,
  id: "colorSecondary" | "colorDeep",
): boolean => stopValue(state, id) === DERIVED;

const POSITION_OPTIONS: PlaygroundOption[] = [
  { value: "absolute", label: "Absolute" },
  { value: "fixed", label: "Fixed" },
];

/** The tone strip; the derived button only appears for a stop the kit may fill in. */
const stopPicker =
  (id: string, options: { fallback?: "blue" } = {}) =>
  ({ state, set }: PlaygroundControlContext) =>
    createElement(StopPicker, {
      value: state[id],
      fallback: options.fallback,
      onToggleDerived: options.fallback
        ? () => set(id, DERIVED)
        : undefined,
      onSelect: (tone: string) => set(id, tone),
    });

const derivedStop = (id: "colorSecondary" | "colorDeep", label: string) => ({
  kind: "custom" as const,
  id,
  group: "stops",
  label,
  default: DERIVED,
  render: stopPicker(id, { fallback: "blue" }),
});

export const glassBackgroundConfig: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "stops", title: "Gradient stops", defaultOpen: true },
    { id: "effects", title: "Effects" },
  ],
  fields: [
    {
      kind: "choice",
      id: "position",
      group: "surface",
      label: "Position",
      options: POSITION_OPTIONS,
      default: "absolute",
    },
    {
      kind: "custom",
      id: "color",
      group: "surface",
      label: "Tone",
      default: "blue",
      render: stopPicker("color"),
    },
    derivedStop("colorSecondary", "Secondary stop"),
    derivedStop("colorDeep", "Deep stop"),
    {
      kind: "choice",
      id: "direction",
      group: "effects",
      label: "Direction",
      options: gradientDirectionOptions as PlaygroundOption[],
      default: "br",
    },
    {
      kind: "toggle",
      id: "shimmer",
      group: "effects",
      label: "Shimmer",
      default: false,
    },
    {
      kind: "toggle",
      id: "ambient",
      group: "effects",
      label: "Ambient glow",
      default: true,
    },
  ],
  data: [
    {
      id: "overlay",
      // The page's `code` places it — children are not an attribute.
      prop: null,
      label: "The panel on the backdrop",
      note: "the component's children, printed as the JSX the stage is mounting",
      emit: "literal",
      value: (state) => overlayFor(state),
    },
  ],
};
