import type { ReactNode } from "react";

/**
 * One row of the fleet the panel pages through. The preview mounts
 * `pageCard(region)` and the Code view prints `h.jsx` of the very same element,
 * so the card on screen and the card in the snippet are one object — they cannot
 * drift apart.
 */
export interface Region {
  name: string;
  cpu: number;
  nodes: number;
}

export const REGIONS: Region[] = [
  { name: "eu-west-1", cpu: 62, nodes: 12 },
  { name: "us-east-1", cpu: 41, nodes: 8 },
  { name: "ap-south-1", cpu: 78, nodes: 5 },
  { name: "ap-northeast-1", cpu: 24, nodes: 6 },
  { name: "sa-east-1", cpu: 55, nodes: 4 },
];

/** The card's class ladder, spelled once. */
export const PAGE_TEMPLATE = {
  card: "w-full max-w-sm space-y-2 text-left",
  name: "text-sm font-semibold text-neutral-800 dark:text-neutral-100",
  meta: "text-xs tabular-nums text-neutral-500 dark:text-neutral-400",
  track: "h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",
  fill: "h-full rounded-full bg-blue-500 dark:bg-blue-400",
} as const;

export const pageCard = (region: Region): ReactNode => (
  <div className={PAGE_TEMPLATE.card}>
    <div className={PAGE_TEMPLATE.name}>{region.name}</div>
    <div className={PAGE_TEMPLATE.meta}>
      {region.nodes} nodes · {region.cpu}% average CPU
    </div>
    <div className={PAGE_TEMPLATE.track}>
      <div className={PAGE_TEMPLATE.fill} style={{ width: `${region.cpu}%` }} />
    </div>
  </div>
);

/** The pages the panel receives: one card per region, in menu order. */
export const pagesOf = (count: number): ReactNode[] =>
  REGIONS.slice(0, Math.max(0, count)).map(pageCard);

/**
 * A custom `loadingState` — the one prop that replaces *every* built-in
 * treatment at once (:50-51,:264-265), so it is worth being able to see.
 */
export const LOADING_TEMPLATE = {
  wrap: "flex w-full items-center gap-3 text-left",
  ring:
    "size-5 shrink-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent motion-reduce:animate-none",
  copy: "text-sm text-neutral-600 dark:text-neutral-300",
} as const;

export const LOADING_CARD: ReactNode = (
  <div className={LOADING_TEMPLATE.wrap}>
    <span className={LOADING_TEMPLATE.ring} aria-hidden="true" />
    <span className={LOADING_TEMPLATE.copy}>Fetching the fleet…</span>
  </div>
);

/**
 * A custom `emptyState`, replacing the kit's `EmptyState` (:294-305): the
 * default brings an icon and a translated title, and a caller who supplies this
 * prop gives up both — which is why the block says what it is.
 */
export const EMPTY_TEMPLATE = {
  wrap: "flex w-full flex-col items-center gap-1 py-6 text-center",
  title: "text-sm font-semibold text-neutral-700 dark:text-neutral-200",
  note: "text-xs text-neutral-500 dark:text-neutral-400",
} as const;

export const EMPTY_BLOCK: ReactNode = (
  <div className={EMPTY_TEMPLATE.wrap}>
    <div className={EMPTY_TEMPLATE.title}>No regions in this account</div>
    <div className={EMPTY_TEMPLATE.note}>Add a region and it becomes a page.</div>
  </div>
);

/** Every element has a plain tag, so nothing needs an identifier to print by. */
export const FIXTURE_NAMES: Record<string, unknown> = {};
