import React from "react";
import { Button, Pill } from "@cjlapao/ui-kit";
import type {
  SplitViewItem,
  SplitViewPanelHeaderProps,
} from "@cjlapao/ui-kit";

/**
 * The fixture the preview mounts and the Code view prints, in one place.
 *
 * SplitView has no `data-*` hooks at all, so the preview tests reach it the way a
 * reader does — by role and by name — which means the words in here are also the
 * selectors. Keep them stable.
 */
export const STAGE_CLASS =
  "relative flex h-[26rem] w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700";

/**
 * One record per row, in plain data: the preview builds elements from it and the
 * snippet prints it, so the two cannot drift. `hidden` and `disabled` are row
 * flags the component itself reads (:98-99,:573,:677) — the last row exists in
 * `items` and never paints, which is the point of showing it.
 */
export interface CapsuleSpec {
  id: string;
  label: string;
  subtitle: string;
  /** The detail pane's body text. Top-level rows must have one (:93-95). */
  detail: string;
  /** Labels for this row's in-place `subContent`. */
  replicas: string[];
  /** Structured child rows, printed and mounted only while the lever is on. */
  subItems?: { id: string; label: string }[];
  highlight?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export const CAPSULES: CapsuleSpec[] = [
  {
    id: "gateway",
    label: "api-gateway",
    subtitle: "eu-west-1",
    detail: "Gateway build 412 — 4m 12s.",
    replicas: ["gateway-7f4c", "gateway-9d21"],
  },
  {
    id: "worker",
    label: "worker-pool",
    subtitle: "us-east-1",
    detail: "Worker build 88 — 1m 04s.",
    replicas: ["worker-01", "worker-02", "worker-03"],
  },
  {
    id: "batch",
    label: "batch-runner",
    subtitle: "ap-south-1",
    detail: "Batch build 7 — 11m 51s.",
    replicas: ["batch-nightly"],
    highlight: true,
    subItems: [
      { id: "batch-2f", label: "batch-nightly-2f" },
      { id: "batch-8a", label: "batch-nightly-8a" },
    ],
  },
  {
    id: "cache",
    label: "edge-cache",
    subtitle: "sa-east-1",
    detail: "Cache build 12 — 38s.",
    replicas: [],
    disabled: true,
  },
  {
    id: "sidecar",
    label: "legacy-sidecar",
    subtitle: "us-west-2",
    detail: "Sidecar build 3 — 22s.",
    replicas: [],
    hidden: true,
  },
];

/** The row menu, shared by every row and every sub-row (:111,:1441-1445). */
export const ROW_MENU = [
  { label: "Rename", value: "rename" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete", danger: true },
];

export const SUB_MENU = [{ label: "Restart", value: "restart" }];

/** The in-place expansion. Printed as its own component because the snippet must
 *  be readable: a `subContent` of inline `<li>`s would bury the row data. */
export const Replicas: React.FC<{ names: string[] }> = ({ names }) => (
  <ul className="space-y-1 py-2 pl-9 pr-4">
    {names.map((name) => (
      <li
        key={name}
        className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300"
      >
        <span className="truncate">{name}</span>
        <Pill size="sm" tone="sky" variant="soft">
          ready
        </Pill>
      </li>
    ))}
  </ul>
);

export const REPLICAS_SOURCE = `const Replicas: React.FC<{ names: string[] }> = ({ names }) => (
  <ul className="space-y-1 py-2 pl-9 pr-4">
    {names.map((name) => (
      <li key={name} className="flex items-center justify-between gap-2 text-xs">
        <span className="truncate">{name}</span>
        <Pill size="sm" tone="sky" variant="soft">
          ready
        </Pill>
      </li>
    ))}
  </ul>
);`;

/** The line the preview mounts and the snippet prints for a row's detail pane. */
export const detailMarkup = (detail: string): React.ReactNode => (
  <div className="p-6 text-sm">{detail}</div>
);

export const detailSource = (detail: string): string =>
  `panel: <div className="p-6 text-sm">${detail}</div>`;

/** Hover-only row actions (:1282-1292) — no `focus-within` reveal, which the
 *  Keyboard topic says out loud. */
export const ROW_ACTIONS = (
  <Button size="xs" variant="ghost">
    Logs
  </Button>
);

export const LIST_ACTIONS = (
  <Button size="xs" variant="outline">
    Add capsule
  </Button>
);

/** The `panelHeader` escape hatch: a plain node, ignored the moment
 *  `panelHeaderProps` is set (:875-879). */
export const PANEL_HEADER = (
  <div className="border-b border-neutral-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider dark:border-neutral-700">
    Registry entry
  </div>
);

export const PANEL_EMPTY = (
  <div className="p-6 text-sm text-neutral-500">
    Pick a capsule to see its build.
  </div>
);

export const EMPTY_LIST = (
  <div className="px-4 py-6 text-center text-xs italic text-neutral-500">
    Nothing matches that filter.
  </div>
);

export const LOADING_STATE = (
  <div className="p-6 text-xs text-neutral-500">Contacting the registry…</div>
);

export const HEADER_ACTIONS = (
  <Button size="xs" variant="ghost">
    Restart
  </Button>
);

export const HEADER_TAGS = (
  <Pill size="xs" tone="emerald" variant="soft">
    healthy
  </Pill>
);

/** Components the slot markup mounts, so the import line is derived, not guessed. */
export const SLOT_NAMES: Record<string, unknown> = { Button, Pill };

/** The built-in header's slots (:153-175). Every one of them may also be a
 *  function of the active row (:722-730) — the object form is what the reader
 *  copies, and the function form is what the table explains. */
export const panelHeaderProps = (withDetails: boolean): SplitViewPanelHeaderProps => ({
  title: (item) => `${String(item.label)} · build`,
  subtitle: (item) => String(item.subtitle ?? ""),
  actions: HEADER_ACTIONS,
  ...(withDetails
    ? {
        headerDetails: {
          title: "Region",
          subtitle: "eu-west-1",
          description: "Two replicas healthy, last promote 4m ago.",
          tags: HEADER_TAGS,
        },
      }
    : {}),
});

/** The same object as TypeScript, so the Code view prints what the preview mounts. */
export const panelHeaderPropsSource = (withDetails: boolean): string =>
  [
    "{",
    "  title: (item) => `${String(item.label)} · build`,",
    "  subtitle: (item) => String(item.subtitle ?? \"\"),",
    "  actions: <Button size=\"xs\" variant=\"ghost\">Restart</Button>,",
    ...(withDetails
      ? [
          "  headerDetails: {",
          "    title: \"Region\",",
          "    subtitle: \"eu-west-1\",",
          "    description: \"Two replicas healthy, last promote 4m ago.\",",
          "    tags: <Pill size=\"xs\" tone=\"emerald\" variant=\"soft\">healthy</Pill>,",
          "  },",
        ]
      : []),
    "}",
  ].join("\n");

/**
 * The rows the preview mounts. The Code view prints the same shape from
 * `printedItem`, so the two are only honest while they read the same spec.
 */
export const buildItems = (withSubItems: boolean): SplitViewItem[] =>
  CAPSULES.map((spec) => ({
    id: spec.id,
    label: spec.label,
    subtitle: spec.subtitle,
    icon: "Container" as const,
    panel: detailMarkup(spec.detail),
    menu: ROW_MENU,
    ...(spec.id === "gateway" ? { actions: ROW_ACTIONS } : {}),
    ...(spec.highlight ? { highlight: true } : {}),
    ...(spec.disabled ? { disabled: true } : {}),
    ...(spec.hidden ? { hidden: true } : {}),
    ...(spec.id === "batch"
      ? { badges: [{ label: "nightly", tone: "amber" as const, variant: "soft" as const }] }
      : {}),
    ...(withSubItems && spec.replicas.length > 0
      ? { subContent: <Replicas names={spec.replicas} /> }
      : {}),
    ...(withSubItems && spec.subItems
      ? {
          subItems: spec.subItems.map((sub, index) => ({
            id: sub.id,
            label: sub.label,
            menu: SUB_MENU,
            // One of the two is clickable, one is not: a child row is a `button`
            // only when it has an `onClick` (:1411), and the inert half of that
            // rule is a fact the Keyboard topic states.
            ...(index === 0 ? { onClick: () => undefined } : {}),
          })),
        }
      : {}),
  }));
