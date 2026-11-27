import React from "react";
import { Button, CustomIcon } from "@cjlapao/ui-kit";
import type { PillSize, PillVariant, TrueColor } from "@cjlapao/ui-kit";

/**
 * The tags the playground mounts — and the only tags the Code view prints.
 * `TagPanel` reads four fields off each entry (`label` plus optional `tone`,
 * `variant`, `size`, `icon`, :203-212 of `TagPanel.tsx`) and ignores anything
 * else, so nothing here carries a field the component would drop on the floor.
 */
export interface TagFixture {
  label: string;
  tone?: TrueColor;
  variant?: PillVariant;
  size?: PillSize;
  icon?: React.ReactNode;
}

const LABELS = [
  "prod",
  "eu-west-1",
  "docker",
  "gpu",
  "beta",
  "internal",
  "canary",
  "v2",
];

/**
 * The per-tag overrides, keyed by label so the plain deck and the styled one
 * are the same eight tags. `size` is here on one tag only to show the fallback
 * the JSDoc complains about: a tag without it takes the panel's `tagSize`
 * (:207), a tag with it wins.
 */
const STYLES: Record<string, Omit<TagFixture, "label">> = {
  prod: { tone: "emerald" },
  "eu-west-1": { tone: "sky", variant: "outline" },
  gpu: { tone: "violet", icon: <CustomIcon icon="Server" size="xs" /> },
  canary: { tone: "amber", size: "xs" },
};

const PLAIN: TagFixture[] = LABELS.map((label) => ({ label }));
const STYLED: TagFixture[] = LABELS.map((label) => ({
  label,
  ...(STYLES[label] ?? {}),
}));

/** `count` tags, styled only when the reader asked for the mixed deck. */
export const tagsOf = (count: number, styled: boolean): TagFixture[] =>
  (styled ? STYLED : PLAIN).slice(0, Math.max(0, Math.min(count, LABELS.length)));

/** How many tags exist at all — the top of the count control. */
export const TAG_UNIVERSE = LABELS.length;

/** Header actions, for the `actions` prop (:53-54,:220). */
export const HEADER_ACTIONS = (
  <Button size="xs" variant="ghost">
    Manage tags
  </Button>
);

/** A caller's own empty block, for the `emptyState` prop (:50,:242). */
export const EMPTY_BLOCK = (
  <div className="flex items-center gap-2 rounded-md border border-dashed border-neutral-300 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
    <CustomIcon icon="PriceTag" size="xs" />
    Nothing tagged — add one from the editor
  </div>
);

/** Printed as themselves, never as a mangled `fn.name` (:153-164 of emit.ts). */
export const FIXTURE_NAMES: Record<string, unknown> = {
  Button,
  CustomIcon,
};

export const FIXTURE_LABELS = LABELS;
