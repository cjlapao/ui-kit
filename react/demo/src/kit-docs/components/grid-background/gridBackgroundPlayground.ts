import { createElement } from "react";
import { gridBackgroundFadeOptions, gridBackgroundPatternOptions } from "../../shared/options";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import { FOLLOW_TEXT, TonePicker, contentFor, latticeColor } from "./gridBackgroundStage";

/**
 * Grid Background's playground as data.
 *
 * Every `default` is the destructuring at `GridBackground.tsx:37` —
 * `pattern="grid"`, `size=32`, `lineColor="currentColor"`, `dotSize=1`,
 * `opacity=0.12`, `fade="none"`, `fadeStart=15`, `position="absolute"` — so the
 * stage opens on the component's own lattice and the Code view opens with no
 * attribute at all.
 *
 * Two controls are gated because the component makes them inert without a
 * partner: the dot radius is only read on the dots branch
 * (`GridBackground.tsx:47`) and the fade start only feeds the mask that
 * `fade` selects (`:43`). A hidden control cannot print, so the snippet can
 * never carry a prop the component would ignore.
 */

const POSITION_OPTIONS: PlaygroundOption[] = [
  { value: "absolute", label: "Fill a parent" },
  { value: "relative", label: "Wrap content" },
];

const dotsOnly = (state: PlaygroundState): boolean =>
  String(state.pattern ?? "grid") === "dots";

const fadeOn = (state: PlaygroundState): boolean =>
  String(state.fade ?? "none") !== "none";

export const gridBackgroundConfig: PlaygroundConfig = {
  groups: [
    { id: "lattice", title: "Lattice", defaultOpen: true },
    { id: "fade", title: "Edge fade", defaultOpen: true },
    { id: "placement", title: "Placement", defaultOpen: true },
  ],
  fields: [
    {
      kind: "choice",
      id: "pattern",
      group: "lattice",
      label: "Pattern",
      options: gridBackgroundPatternOptions as PlaygroundOption[],
      default: "grid",
    },
    {
      kind: "number",
      id: "size",
      group: "lattice",
      label: "Spacing (px)",
      default: 32,
      min: 8,
      max: 96,
      step: 1,
    },
    {
      kind: "number",
      id: "opacity",
      group: "lattice",
      label: "Opacity (0–1)",
      default: 0.12,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      kind: "custom",
      id: "lineColor",
      group: "lattice",
      label: "Lattice colour",
      // The component's default is not a colour: `currentColor` lets the box
      // inherit the text colour around it, so nothing prints until the reader
      // picks a tone.
      default: FOLLOW_TEXT,
      emit: (value, _state, h) => value === FOLLOW_TEXT ? null : `lineColor=${h.lit(latticeColor(String(value)))}`,
      render: ({ state, set }) =>
        createElement(TonePicker, {
          value: state.lineColor ?? FOLLOW_TEXT,
          onSelect: (tone) => set("lineColor", tone),
        }),
    },
    {
      kind: "number",
      id: "dotSize",
      group: "lattice",
      label: "Dot radius (px)",
      default: 1,
      min: 0.25,
      max: 8,
      step: 0.25,
      when: dotsOnly,
    },
    {
      kind: "toggle",
      id: "shimmer",
      group: "lattice",
      label: "Shimmer",
      default: false,
      when: dotsOnly,
    },
    {
      kind: "choice",
      id: "fade",
      group: "fade",
      label: "Fade",
      options: gridBackgroundFadeOptions as PlaygroundOption[],
      default: "none",
    },
    {
      kind: "number",
      id: "fadeStart",
      group: "fade",
      label: "Solid centre (%)",
      default: 15,
      min: 0,
      max: 85,
      step: 1,
      when: fadeOn,
    },
    {
      kind: "choice",
      id: "position",
      group: "placement",
      label: "Placement",
      options: POSITION_OPTIONS,
      default: "absolute",
    },
  ],
  data: [
    {
      id: "content",
      // Children are content, not an attribute: the page's `code` decides
      // whether they sit inside the backdrop or beside it.
      prop: null,
      label: "The surface on the lattice",
      note: "printed as the JSX the stage is mounting",
      emit: "literal",
      value: () => contentFor(),
    },
  ],
};
