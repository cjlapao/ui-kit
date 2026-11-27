import type { ControlSize } from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";
import { CLUSTERS } from "./headerGroupFixture";

/**
 * What the Header Group stage needs to know about itself.
 *
 * Everything here mirrors `react/src/components/HeaderGroup.tsx` rather than
 * restyling it: the two gap ladders (:7-22), the separator thickness ladder
 * (:28-34) and the fact that the rule's geometry is derived from a single
 * custom property per group (:162-168). The stage renders the same four
 * clusters the Code view hoists, so a reader comparing the two sees the same
 * controls in the same order.
 */

/** The clusters, in reading order. Each `label` is the group's name (:95,:151). */
export const GROUP_LABELS: string[] = CLUSTERS.map((cluster) => cluster.label);

export const MIN_GROUPS = 1;
export const MAX_GROUPS = GROUP_LABELS.length;
/** Three clusters: enough to see two rules, few enough to read the bar. */
export const DEFAULT_GROUPS = 3;

export const groupCount = (state: PlaygroundState): number => {
  const raw = Number(state.groups ?? DEFAULT_GROUPS);
  return Number.isFinite(raw)
    ? Math.min(MAX_GROUPS, Math.max(MIN_GROUPS, Math.round(raw)))
    : DEFAULT_GROUPS;
};

/**
 * Height of the bar the groups sit in, in CSS pixels. Worth a slider because
 * the separator is sized *relative to the group*: `top-1/4` + `h-1/2`
 * (:66-67) means the rule always spans half the bar, never a fixed 16 px.
 */
export const MIN_BAR = 40;
export const MAX_BAR = 120;
export const DEFAULT_BAR = 56;

export const barHeight = (state: PlaygroundState): number => {
  const raw = Number(state.barHeight ?? DEFAULT_BAR);
  return Number.isFinite(raw)
    ? Math.min(MAX_BAR, Math.max(MIN_BAR, Math.round(raw)))
    : DEFAULT_BAR;
};

/** Direction of the bar. `rtl` is here to be looked at, not to be trusted. */
export const DIRECTIONS = ["ltr", "rtl"] as const;
export type StageDirection = (typeof DIRECTIONS)[number];
export const DEFAULT_DIRECTION: StageDirection = "ltr";
export const directionOf = (state: PlaygroundState): StageDirection =>
  state.direction === "rtl" ? "rtl" : "ltr";

/** Panel variant behind the bar. Panel's own default is `elevated` (:654). */
export const SURFACES = ["outlined", "elevated", "subtle", "glass"] as const;
export const DEFAULT_SURFACE = "outlined";
export const surfaceOf = (state: PlaygroundState): string =>
  typeof state.surface === "string" ? state.surface : DEFAULT_SURFACE;

/** Group gap in CSS pixels, from the component's own ladder (:7-13). */
export const GAP_PX: Record<ControlSize, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

/** Rule thickness in CSS pixels, from the component's own ladder (:28-34). */
export const RULE_PX: Record<ControlSize, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

/**
 * The rule's offset, recomputed the way the component does it (:165-167) so
 * the docs can state the number the browser will actually receive. The snap
 * term is 0 in a snapshot, where nothing is measured.
 */
export const separatorOffset = (
  gap: ControlSize,
  thickness: ControlSize | number,
): number => {
  const gapPx = GAP_PX[gap] ?? GAP_PX.sm;
  const separatorPx =
    typeof thickness === "number"
      ? thickness
      : (RULE_PX[thickness] ?? RULE_PX.xs);
  return -Math.round((gapPx + separatorPx) / 2);
};

/**
 * `separatorSize` takes the shared scale *or* raw pixels (:88), so the control
 * offers both: five named steps and two numbers, printed as `separatorSize="md"`
 * and `separatorSize={2}` respectively.
 */
export const SEPARATOR_SCALE: readonly ControlSize[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
];
export const RAW_PIXELS = ["2", "5"] as const;
export const DEFAULT_SEPARATOR = "xs";

export const isRawPixels = (value: unknown): boolean =>
  /^\d+$/.test(String(value ?? ""));

export const separatorValueOf = (
  state: PlaygroundState,
): ControlSize | number => {
  const raw = String(state.separatorSize ?? DEFAULT_SEPARATOR);
  return isRawPixels(raw) ? Number(raw) : (raw as ControlSize);
};

/** A tone tints the rule to `--color-<tone>-400` (:176); off means :177. */
export const isToned = (state: PlaygroundState): boolean => state.toned === true;

/** Unnamed groups are legal but usually skipped, so the choice is explicit. */
export const isNamed = (state: PlaygroundState): boolean =>
  String(state.labelling ?? "named") !== "unnamed";

/** A blank text control means the prop is absent, not empty. */
export const defined = (value: unknown): string | undefined => {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" || text === "absent" ? undefined : text;
};
