import type { ReactNode } from "react";
import type { PlaygroundState } from "../../shared/playground/schema";
import { CITIES, FIT, GRID, ROWS, ROW_HEIGHT, TILES_ROW } from "./scrollAreaFixture";

/**
 * One table for the four contents the playground offers. The preview mounts
 * `element`; the Code view prints `constName` from the same row, so a case that
 * is not on screen cannot be printed, and the numbers the virtual viewport is
 * built from are the fixture's own (:101-104 of `ScrollArea.tsx` — the frame's
 * height is the caller's business, so the content is what decides overflow).
 */
export interface ScenarioSpec {
  constName: string;
  element: ReactNode;
  label: string;
  note: string;
}

export const SCENARIOS: Record<string, ScenarioSpec> = {
  rows: {
    constName: "ROWS",
    element: ROWS,
    label: "sixteen rows in a frame that holds about eight",
    note: "the vertical bar is the only one with an axis to scroll (:519-548)",
  },
  tiles: {
    constName: "TILES_ROW",
    element: TILES_ROW,
    label: "a strip wider than the frame, short enough to fit",
    note: "the sideways bar alone; the vertical axis never overflows (:553-584)",
  },
  grid: {
    constName: "GRID",
    element: GRID,
    label: "eight strips of three tiles — both axes overflow",
    note: "both bars, plus the corner square where they meet (:587-591)",
  },
  fits: {
    constName: "FIT",
    element: FIT,
    label: "three rows — everything fits",
    note: "no bar, no lane, and the viewport leaves the tab order (:458)",
  },
};

export const SCENARIO_IDS = Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>;

/** What the reader picks for the frame; the component&rsquo;s own default is `""` (:158). */
export const FRAME_DEFAULT = "h-56 w-full";
/** A frame with no height: nothing can overflow, so nothing is ever drawn. */
export const FRAME_NONE = "w-full";

/** The control's spelling of "the kit adds no role" (`viewportRole` is otherwise unset :457). */
export const ROLE_NONE = "none";

/** What an empty text control means — the prop was never written. */
export const TEXT_NONE = "";

/**
 * The virtual viewport the playground drives. `contentSize` is the same list the
 * preview renders at the same row height, so the thumb&rsquo;s size —
 * `viewportSize / contentSize` of the track (:236-239) — matches what the reader
 * sees; sizes may be pixels or logical units, which is the whole point of the
 * prop (:27-28).
 */
export const VIRTUAL = {
  contentSize: CITIES.length * ROW_HEIGHT,
  viewportSize: 224,
  offset: 0,
};

export const isVirtual = (state: PlaygroundState): boolean =>
  state.virtualScroll === true;

/** `virtualScroll` forces the sideways axis off (:161), so the control has nothing to say. */
export const showsHorizontal = (state: PlaygroundState): boolean => !isVirtual(state);

/** …and the vertical one on (:162), same reason. */
export const showsVertical = (state: PlaygroundState): boolean => !isVirtual(state);

export const scenarioOf = (state: PlaygroundState): ScenarioSpec =>
  SCENARIOS[String(state.content ?? "rows")] ?? SCENARIOS.rows;

/** A text control&rsquo;s value, trimmed; blank means the prop was never written. */
export const textOf = (state: PlaygroundState, id: string): string =>
  String(state[id] ?? TEXT_NONE).trim();

/** The class the frame is mounted with — the preview and the snippet read it here. */
export const frameOf = (state: PlaygroundState): string =>
  String(state.className ?? FRAME_DEFAULT);

/** `""` for the sentinel, so a caller&rsquo;s `viewportRole` prints only when chosen. */
export const roleOf = (state: PlaygroundState): string => {
  const role = textOf(state, "viewportRole");
  return role === ROLE_NONE ? TEXT_NONE : role;
};
