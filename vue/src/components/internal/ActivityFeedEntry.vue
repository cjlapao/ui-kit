<script lang="ts">
/**
 * The fields the standard row template draws, shared verbatim by the feed's
 * rows and its sub-rows — dot, actor/title, count pill, description, code
 * chip, time. The dot class arrives settled because the ladder differs per
 * level: rows climb `item.tone` then the card's accent, sub-rows climb
 * `sub.tone`, the parent's `tone`, then the card.
 */
export interface ActivityFeedEntryView {
  /** Resolved dot background plus its layout classes, settled by the feed. */
  dotClass: string;
  actor?: string;
  title?: string;
  description?: string;
  code?: string;
  /** Pre-formatted; the `<time>` draws only when there is one — a sub-line
   *  is context, not necessarily a clock. */
  timestamp?: string;
  /** `count > 1` resolved — the badge only ever draws above one. */
  hasCount: boolean;
  count?: number;
}
</script>

<script setup lang="ts">
/**
 * One entry of the feed's own row template, drawn as a fragment so the
 * caller owns the wrapper. `ActivityFeed` renders it for its rows and the
 * sub-rows alike; a row that supplies a custom `body` skips it entirely.
 */
import Pill from "../Pill.vue";

defineOptions({ name: "ActivityFeedEntry", inheritAttrs: false });

defineProps<{ entry: ActivityFeedEntryView }>();
</script>

<template>
  <span :class="entry.dotClass" aria-hidden="true" />
  <div class="min-w-0 flex-1">
    <div class="flex items-center gap-2">
      <span class="min-w-0 truncate text-sm font-medium">
        <span v-if="entry.actor" class="font-semibold">{{ entry.actor }} </span>
        {{ entry.title }}
      </span>
      <Pill v-if="entry.hasCount" size="sm" tone="neutral">
        ×{{ entry.count }}
      </Pill>
    </div>
    <p
      v-if="entry.description"
      class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400"
    >
      {{ entry.description }}
    </p>
    <code
      v-if="entry.code"
      class="mt-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
      >{{ entry.code }}</code
    >
  </div>
  <time
    v-if="entry.timestamp"
    class="shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400 dark:text-neutral-500"
    >{{ entry.timestamp }}</time
  >
</template>
