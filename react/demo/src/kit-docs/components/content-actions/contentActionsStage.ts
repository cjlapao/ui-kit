import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Fixtures and predicates for the Content Actions playground.
 *
 * The component owns no text of its own (:9-12) — it is two regions and a
 * stylesheet — so everything visible here comes from this file, and the preview
 * and the Code view read the same values. `ACTION_SETS` is the single source for
 * the action row: the stage renders those buttons and the snippet prints the
 * same ones, which is the only way the copied example can behave like the
 * preview (`ContentActions.tsx:44` renders `actions` untouched).
 */

export interface StageAction {
  /** The icon name the reader will see in the snippet. */
  icon: string;
  /** The label, and with it the accessible name (:466 of ExpandableButton.tsx). */
  label: string;
  /** Only the destructive action is tinted, so the set still reads as a group. */
  color?: string;
}

export type ActionSetId = "three" | "one" | "six";

export const ACTION_SETS: Record<ActionSetId, StageAction[]> = {
  one: [{ icon: "Edit", label: "Edit agent" }],
  three: [
    { icon: "Edit", label: "Edit agent" },
    { icon: "Copy", label: "Duplicate agent" },
    { icon: "Trash", label: "Delete agent", color: "rose" },
  ],
  six: [
    { icon: "Copy", label: "Duplicate agent" },
    { icon: "Edit", label: "Edit agent" },
    { icon: "Star", label: "Pin agent" },
    { icon: "Archive", label: "Archive agent" },
    { icon: "Link", label: "Copy link" },
    { icon: "Trash", label: "Delete agent", color: "rose" },
  ],
};

export const ACTION_SET_LABELS: Record<string, string> = {
  three: "Three actions",
  one: "One action",
  six: "Six actions",
  none: "No actions",
};

export const ACTIONS_CHOICES = ["three", "one", "six", "none"] as const;

export const DEFAULT_ACTIONS = "three";

export const actionsChoice = (state: PlaygroundState): string =>
  String(state.actions ?? DEFAULT_ACTIONS);

export const hasActions = (state: PlaygroundState): boolean =>
  actionsChoice(state) !== "none";

/** The buttons to render, or `null` when the second region should not exist. */
export const actionSet = (state: PlaygroundState): StageAction[] | null =>
  ACTION_SETS[actionsChoice(state) as ActionSetId] ?? null;

export const DEFAULT_TITLE = "Brainstormer";
export const DEFAULT_SUMMARY =
  "Turns an idea into a reviewable plan. This text yields width while the actions stay on one row.";

export const contentTitle = (state: PlaygroundState): string =>
  String(state.title ?? DEFAULT_TITLE);

export const contentSummary = (state: PlaygroundState): string =>
  String(state.summary ?? DEFAULT_SUMMARY);

/** The resizable box: a number, so the reader can read the pixel width off it. */
export const MIN_WIDTH = 160;
export const MAX_WIDTH = 900;
export const DEFAULT_WIDTH = 560;

export const stageWidth = (state: PlaygroundState): number => {
  const raw = Number(state.width ?? DEFAULT_WIDTH);
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Number.isFinite(raw) ? raw : DEFAULT_WIDTH));
};

/** `absent`, blank and `auto` all mean the prop is not there. */
export const defined = (value: unknown): string | undefined => {
  const text = value === undefined || value === null ? "" : String(value);
  const trimmed = text.trim();
  return trimmed === "" || trimmed === "absent" || trimmed === "auto" ? undefined : text;
};
