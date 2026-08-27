<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import CustomIcon from "../CustomIcon.vue";
import Pill from "../Pill.vue";
import Progress from "../Progress.vue";
import ProgressSpinner from "../ProgressSpinner.vue";
import {
  getHeaderSurface,
  headerGlyph,
  headerReservesGlyph,
} from "../../connectionFlow";
import type { ConnectionFlowProgressType } from "../../connectionFlow";
import {
  getSurfaceCornerClass,
  type SurfaceCorner,
  type SurfaceVariant,
  type TrueColor,
} from "../../theme/Theme";
import type { PillVariant } from "../Pill.vue";
import type { IconName } from "../../icons/registry";

/**
 * The frame's header: eyebrow, icon, title, tag, and the flow's own progress
 * directly beneath them.
 *
 * Built here rather than handed to `Panel` for two reasons: Panel's header
 * carries no icon chip and no progress, and `variant="plain"` renders no Panel
 * at all — so the header has to belong to the flow either way.
 */
const props = withDefaults(
  defineProps<{
    variant: SurfaceVariant;
    tone: TrueColor;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    /** A registry icon name. */
    icon?: string;
    iconCorner: SurfaceCorner;
    tag?: string;
    tagTone?: TrueColor;
    tagVariant: PillVariant;
    /** 0–1, or undefined when nothing reports progress. */
    progress?: number;
    progressType: ConnectionFlowProgressType;
    animated: boolean;
    loading?: boolean;
  }>(),
  { loading: false },
);

/** The chip is the same box whatever is in it, so the title never shifts. */
const GLYPH_BOX = 44;

const surface = computed(() => getHeaderSurface(props.variant));
const hasIcon = computed(() => Boolean(props.icon));
const reserve = computed(() =>
  headerReservesGlyph(hasIcon.value, props.progressType),
);
const glyph = computed(() =>
  headerGlyph(hasIcon.value, props.progressType, props.progress),
);
const showBar = computed(
  () => props.progressType === "bar" && props.progress !== undefined,
);
const accent = computed(() => (props.tone === "neutral" ? "blue" : props.tone));
const boxStyle = { width: `${GLYPH_BOX}px`, height: `${GLYPH_BOX}px` };
</script>

<template>
  <!-- Placeholder shaped like the real header, so the card keeps its height. -->
  <div
    v-if="loading"
    class="flex animate-pulse flex-col gap-3 motion-reduce:animate-none"
    aria-hidden="true"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <span
          v-if="reserve"
          class="block shrink-0 bg-black/10 dark:bg-white/10"
          :class="getSurfaceCornerClass(iconCorner)"
          :style="boxStyle"
        />
        <div class="min-w-0 flex-1 space-y-2">
          <span
            v-if="eyebrow !== undefined"
            class="block h-2.5 w-28 rounded-full bg-black/10 dark:bg-white/10"
          />
          <span class="block h-5 w-56 rounded-full bg-black/10 dark:bg-white/10" />
          <span
            v-if="subtitle !== undefined"
            class="block h-3 w-36 rounded-full bg-black/10 dark:bg-white/10"
          />
        </div>
      </div>
      <span
        v-if="tag !== undefined"
        class="block h-6 w-20 rounded-full bg-black/10 dark:bg-white/10"
      />
    </div>
    <span
      v-if="progressType === 'bar'"
      class="block h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10"
    />
  </div>

  <div v-else class="flex flex-col gap-3">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <!-- Only the icon sits on a chip; a spinner is its own shape and a
             filled square behind it reads as a second, competing ring. -->
        <span
          v-if="reserve"
          class="flex shrink-0 items-center justify-center overflow-hidden"
          :class="
            glyph.kind === 'icon'
              ? classNames(getSurfaceCornerClass(iconCorner), surface.chip)
              : undefined
          "
          :style="boxStyle"
        >
          <ProgressSpinner
            v-if="glyph.kind === 'spinner'"
            size="lg"
            :value="(progress ?? 0) * 100"
            :color="accent"
            :show-value="false"
          />
          <CustomIcon
            v-else-if="glyph.kind === 'icon'"
            :icon="icon as IconName"
            :custom-size="22"
            :class="surface.muted"
          />
        </span>

        <div class="min-w-0">
          <p
            v-if="eyebrow"
            class="truncate text-[11px] font-semibold uppercase tracking-widest"
            :class="surface.eyebrow"
          >
            {{ eyebrow }}
          </p>
          <h3
            v-if="title"
            class="truncate text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            {{ title }}
          </h3>
          <p v-if="subtitle" class="truncate text-xs" :class="surface.muted">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <Pill v-if="tag" size="sm" :tone="tagTone ?? tone" :variant="tagVariant">
        {{ tag }}
      </Pill>
    </div>

    <!-- Directly beneath the title and icon, at the header's full width. -->
    <Progress
      v-if="showBar"
      size="xs"
      :color="accent"
      :value="(progress ?? 0) * 100"
      :motion="animated && (progress ?? 0) < 1 ? 'shimmer' : 'none'"
      show-value
    />
  </div>
</template>
