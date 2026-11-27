import React from "react";
import { StatCard } from "@cjlapao/ui-kit";
import type {
  SmartGridItemDefinition,
  SmartGridRowDefinition,
  SmartGridSectionDefinition,
} from "@cjlapao/ui-kit";

/**
 * The tiles this page plays with, kept as data rather than as seven hand-written
 * components. One record drives three things that must never disagree: the
 * component the preview mounts, the `render` the Code view prints, and the
 * `title`/`defaultSpan` printed beside it.
 */

export type TileIcon = "Database" | "Rocket" | "Shop" | "HealthCheck";

export interface SmartGridTileSpec {
  /** Also the join key — a row names tiles by this, never by position (:84-88). */
  id: string;
  /** What the palette and the tile's header show. */
  title: string;
  /** Columns the entry asks for on a 12-column grid (:45). */
  span: number;
  /** The StatCard's label, and the name a thrown tile is reported under. */
  label: string;
  value: string | number;
  icon: TileIcon;
}

export const TILE_SPECS: SmartGridTileSpec[] = [
  { id: "capsules", title: "Active capsules", span: 3, label: "Active capsules", value: 128, icon: "Rocket" },
  { id: "requests", title: "Requests", span: 3, label: "Requests", value: "1.2M/h", icon: "Database" },
  { id: "spend", title: "Spend", span: 3, label: "Spend", value: "$8.4k", icon: "Shop" },
  { id: "health", title: "Health", span: 3, label: "Health", value: "99.98%", icon: "HealthCheck" },
  { id: "errors", title: "Errors", span: 6, label: "Errors", value: 42, icon: "Database" },
  { id: "latency", title: "Latency", span: 6, label: "Latency", value: "142ms", icon: "Database" },
  // Never placed by any layout below, so "Add Item" always has something to
  // offer; a palette with nothing left in it renders no add button at all.
  { id: "queue", title: "Queue depth", span: 6, label: "Queue depth", value: 17, icon: "Database" },
];

export const TILE_COUNT = TILE_SPECS.length;

/**
 * The helper the Code view hoists, printed verbatim. `tileOf` below builds the
 * same element from the same record, so the printed call and the mounted tile
 * cannot drift without the preview test noticing.
 */
export const TILE_HELPER =
  'const tile = (label: string, value: string | number, icon: "Database" | "Rocket" | "Shop" | "HealthCheck") => () => (\n' +
  '  <StatCard label={label} value={value} icon={icon} variant="elevated" className="h-full" />\n' +
  ");";

/** The mounted tile for a spec. */
export const tileOf =
  (spec: SmartGridTileSpec): (() => React.ReactNode) =>
  () =>
    (
      <StatCard
        label={spec.label}
        value={spec.value}
        icon={spec.icon}
        variant="elevated"
        className="h-full"
      />
    );

/** The same tile as source: the call that builds the element above. */
export const tileSource = (spec: SmartGridTileSpec): string =>
  `() => tile(${JSON.stringify(spec.label)}, ${
    typeof spec.value === "number"
      ? String(spec.value)
      : JSON.stringify(spec.value)
  }, ${JSON.stringify(spec.icon)})`;

const definitionOf = (spec: SmartGridTileSpec): SmartGridItemDefinition => ({
  id: spec.id,
  title: spec.title,
  // Required, not decorative: an inactive entry is skipped by the normalizer and
  // reported with a console.warn (:681-686).
  active: true,
  // One instance on the board, which is what keeps the palette honest (:1373-1401).
  single: true,
  defaultSpan: spec.span,
  render: tileOf(spec),
});

/** The catalogue: what exists, which is wider than what is placed. */
export const itemsOf = (count: number): SmartGridItemDefinition[] =>
  TILE_SPECS.slice(0, Math.max(0, Math.min(count, TILE_COUNT))).map(definitionOf);

export const tilesFor = (state: { tiles?: unknown }): SmartGridTileSpec[] =>
  TILE_SPECS.slice(
    0,
    Math.max(0, Math.min(Number(state.tiles ?? TILE_COUNT - 1), TILE_COUNT)),
  );

/**
 * A layout is written from the catalogue that exists, never from a fixed list of
 * ids: a row naming a tile the `items` array never defined is the resilience
 * path, not the demo — it renders nothing and warns once (:674-679,:3733-3734).
 *
 * Two tiles per row is what the preview's width can hold; twelve columns of
 * three give each tile a label that clips.
 */
export const layoutOf = (
  count: number,
  sections: boolean,
): SmartGridSectionDefinition[] => {
  const placed = TILE_SPECS.slice(0, Math.max(0, Math.min(count, TILE_COUNT) - 1));
  const rows = (specs: SmartGridTileSpec[]): SmartGridRowDefinition[] =>
    specs.reduce<SmartGridRowDefinition[]>((all, spec, index) => {
      const pair = Math.floor(index / 2);
      const row = all[pair] ?? { itemIds: [], defaultHeightSpan: 2 };
      row.itemIds = [...row.itemIds, spec.id];
      all[pair] = row;
      return all;
    }, []);
  if (!sections) {
    const only = rows(placed);
    return only.length === 0
      ? []
      : [{ id: "overview", title: "Overview", rows: only }];
  }
  const half = Math.ceil(placed.length / 2);
  return [
    { id: "overview", title: "Overview", rows: rows(placed.slice(0, half)) },
    { id: "detail", title: "Detail", rows: rows(placed.slice(half)) },
  ].filter((section) => section.rows.length > 0);
};

/**
 * The host's reaction to edit mode, printed as two declarations the Code view
 * hoists — so what the preview passes is literally what the snippet prints, and a
 * test can read the array to prove the callback fires on its own (:1289-1295).
 */
export const editReports: boolean[] = [];

export const logEditMode = (isEditMode: boolean): void => {
  editReports.push(isEditMode);
};
