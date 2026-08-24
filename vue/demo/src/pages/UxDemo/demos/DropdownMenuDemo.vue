<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  DropdownMenu,
  MultiToggle,
  Toggle,
  Button,
} from "@cjlapao/ui-kit-vue";
import {
  dropdownMenuPreviewOptions,
  dropdownMenuRichOptions,
  dropdownAlignOptions,
  dropdownSideOptions,
  dropdownWidthOptions,
  dropdownMaxHeightOptions,
} from "../constants";

const safeLabelText = (label: unknown, fallback: string) =>
  typeof label === "string" ? label : fallback;

const align = ref<"start" | "end">("end");
const side = ref<"auto" | "top" | "bottom">("auto");
const widthChoice = ref<"trigger" | "240" | "320">("trigger");
const maxHeightChoice = ref<"160" | "288" | "420">("288");

// Item-shape toggles: strip a field (or drop a whole row) from the rich
// anatomy list so each shape can be switched on and off.
const showIcons = ref(true);
const showDescriptions = ref(true);
const showDisabled = ref(true);
const showDanger = ref(true);

const widthValue = computed(() =>
  widthChoice.value === "trigger" ? ("trigger" as const) : Number(widthChoice.value),
);
const maxValue = computed(() => Number(maxHeightChoice.value));

const liveItems = computed(() =>
  dropdownMenuRichOptions
    .filter((item) => {
      if (item.disabled && !showDisabled.value) return false;
      if (item.danger && !showDanger.value) return false;
      return true;
    })
    .map((item) => ({
      ...item,
      icon: showIcons.value ? item.icon : undefined,
      description: showDescriptions.value ? item.description : undefined,
    })),
);

const previewOpen = ref(false);
const previewAnchorRef = ref<InstanceType<typeof Button> | null>(null);
const previewAnchorEl = computed(() => previewAnchorRef.value?.el ?? null);
const selection = ref("Nothing selected");

// Collision-detection playground: three anchors at the top / middle / bottom
// of a full-viewport-height area. The menu is positioned against the
// viewport, so the bottom anchor has no room below and flips upward.
const collisionTopOpen = ref(false);
const collisionMidOpen = ref(false);
const collisionBottomOpen = ref(false);
const collisionTopRef = ref<InstanceType<typeof Button> | null>(null);
const collisionMidRef = ref<InstanceType<typeof Button> | null>(null);
const collisionBottomRef = ref<InstanceType<typeof Button> | null>(null);
const collisionTopEl = computed(() => collisionTopRef.value?.el ?? null);
const collisionMidEl = computed(() => collisionMidRef.value?.el ?? null);
const collisionBottomEl = computed(() => collisionBottomRef.value?.el ?? null);
</script>

<template>
  <PlaygroundSection
    title="Dropdown Menu"
    label="[DropdownMenu]"
    description="The raw, positioning-only menu — no trigger of its own. Align, side, width, and max-height; icons, descriptions, disabled and danger items."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span>Align</span>
            <MultiToggle
              :options="dropdownAlignOptions"
              :model-value="align"
              size="sm"
              full-width
              @update:model-value="align = $event as 'start' | 'end'"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span>Side</span>
            <MultiToggle
              :options="dropdownSideOptions"
              :model-value="side"
              size="sm"
              full-width
              @update:model-value="
                side = $event as 'auto' | 'top' | 'bottom'
              "
            />
          </label>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex flex-col gap-1">
            <span>Width</span>
            <MultiToggle
              :options="dropdownWidthOptions"
              :model-value="widthChoice"
              size="sm"
              full-width
              @update:model-value="
                widthChoice = $event as 'trigger' | '240' | '320'
              "
            />
          </label>
          <label class="flex flex-col gap-1">
            <span>Max height</span>
            <MultiToggle
              :options="dropdownMaxHeightOptions"
              :model-value="maxHeightChoice"
              size="sm"
              full-width
              @update:model-value="
                maxHeightChoice = $event as '160' | '288' | '420'
              "
            />
          </label>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <Toggle
            size="sm"
            full-width
            label="Icons"
            v-model="showIcons"
          />
          <Toggle
            size="sm"
            full-width
            label="Descriptions"
            v-model="showDescriptions"
          />
          <Toggle
            size="sm"
            full-width
            label="Disabled item"
            v-model="showDisabled"
          />
          <Toggle
            size="sm"
            full-width
            label="Danger item"
            v-model="showDanger"
          />
        </div>
        <div
          class="space-y-2 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 text-sm text-neutral-600 dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-200"
        >
          <p
            class="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
          >
            Last selection
          </p>
          <p class="font-semibold text-neutral-900 dark:text-neutral-100">
            {{ selection }}
          </p>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-4">
        <div
          class="rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100"
        >
          <div class="flex flex-col gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              Live menu
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <Button
                ref="previewAnchorRef"
                variant="outline"
                size="sm"
                @click="previewOpen = !previewOpen"
              >
                {{ previewOpen ? "Hide menu" : "Show menu" }}
              </Button>
              <span class="text-xs text-neutral-500 dark:text-neutral-400">
                Selection: {{ selection }}
              </span>
            </div>
          </div>
          <DropdownMenu
            :anchor-ref="previewAnchorEl"
            :open="previewOpen"
            :items="liveItems"
            :align="align"
            :side="side"
            :width="widthValue"
            :max-height="maxValue"
            @close="previewOpen = false"
            @select="
              (item) => {
                selection = safeLabelText(item.label, item.value ?? '');
              }
            "
          />
        </div>

        <div
          class="flex min-h-screen flex-col justify-between rounded-2xl border border-dashed border-slate-300/80 p-4 dark:border-slate-700"
        >
          <div>
            <p
              class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Collision detection
            </p>
            <p class="mb-3 text-xs text-slate-500 dark:text-slate-400">
              The menu is placed against the viewport, not the page. Open each
              anchor — the bottom one has no room below, so it flips upward.
            </p>
            <Button
              ref="collisionTopRef"
              variant="outline"
              size="sm"
              @click="collisionTopOpen = !collisionTopOpen"
            >
              Top anchor
            </Button>
            <DropdownMenu
              :anchor-ref="collisionTopEl"
              :open="collisionTopOpen"
              :items="dropdownMenuPreviewOptions"
              align="end"
              side="auto"
              @close="collisionTopOpen = false"
            />
          </div>
          <div>
            <Button
              ref="collisionMidRef"
              variant="outline"
              size="sm"
              @click="collisionMidOpen = !collisionMidOpen"
            >
              Middle anchor
            </Button>
            <DropdownMenu
              :anchor-ref="collisionMidEl"
              :open="collisionMidOpen"
              :items="dropdownMenuPreviewOptions"
              align="end"
              side="auto"
              @close="collisionMidOpen = false"
            />
          </div>
          <div>
            <Button
              ref="collisionBottomRef"
              variant="outline"
              size="sm"
              @click="collisionBottomOpen = !collisionBottomOpen"
            >
              Bottom anchor (flips up)
            </Button>
            <DropdownMenu
              :anchor-ref="collisionBottomEl"
              :open="collisionBottomOpen"
              :items="dropdownMenuPreviewOptions"
              align="end"
              side="auto"
              @close="collisionBottomOpen = false"
            />
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>
