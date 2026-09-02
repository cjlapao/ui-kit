<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Gantt,
  MultiToggle,
  Select,
  sampleGanttLanes,
  sampleGanttLinks,
  sampleGanttTasks,
} from "@cjlapao/ui-kit-vue";
import type { GanttLane, GanttLink, GanttSnap, GanttTask, TrueColor } from "@cjlapao/ui-kit-vue";
import { trueColorOptions } from "../constants";

const ACCENTS: TrueColor[] = ["blue", "emerald", "violet", "amber", "rose", "cyan"];
const SNAPS: GanttSnap[] = ["none", "hour", "day", "week"];

const initialLanes: GanttLane[] = sampleGanttLanes;
const initialTasks: GanttTask[] = sampleGanttTasks();
const initialLinks: GanttLink[] = sampleGanttLinks();

const lanes = ref<GanttLane[]>(initialLanes);
const tasks = ref<GanttTask[]>(initialTasks);
const links = ref<GanttLink[]>(initialLinks);
const rowOrder = ref<string[] | undefined>(undefined);
const color = ref<TrueColor>("blue");
const snap = ref<GanttSnap>("day");
const log = ref<{ id: number; label: string }[]>([]);
let logSeq = 0;

const pushLog = (label: string) => {
  logSeq += 1;
  log.value = [{ id: logSeq, label }, ...log.value].slice(0, 6);
};

const onTasksChange = (next: GanttTask[]) => {
  tasks.value = next;
  pushLog("Dates / progress edited");
};
const onLinksChange = (next: GanttLink[]) => {
  links.value = next;
  pushLog(`Dependencies → ${next.length}`);
};
const onReorder = (order: string[]) => {
  rowOrder.value = order;
  pushLog("Rows reordered");
};
const onSelect = (id: string | null) => {
  pushLog(id ? `Selected “${id}”` : "Selection cleared");
};

const reset = () => {
  tasks.value = initialTasks;
  links.value = initialLinks;
  rowOrder.value = undefined;
  log.value = [];
};

const stats = computed(() => {
  const milestones = tasks.value.filter((t) => t.type === "milestone").length;
  const groups = tasks.value.filter((t) => tasks.value.some((c) => c.parent === t.id)).length;
  return { tasks: tasks.value.length, links: links.value.length, milestones, groups };
});
</script>

<template>
  <PlaygroundSection
    title="Gantt Chart"
    label="Schedule, swimlanes, dependencies & drag-to-edit"
    description="A fully interactive, feature-rich Gantt. Drag bars to move, drag the edges to resize, drag the row grip to reorder, drag the right-edge handle to create a dependency, and drag the progress knob. Keyboard: arrows nudge dates, Shift+arrows resize, Delete removes a selected dependency."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Accent</span>
          <MultiToggle
            :options="trueColorOptions.filter((o) => ACCENTS.includes(o.value))"
            :model-value="color"
            size="sm"
            @update:model-value="(v) => (color = v as TrueColor)"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Snap</span>
          <Select :model-value="snap" @update:model-value="(v) => (snap = v as GanttSnap)">
            <option v-for="s in SNAPS" :key="s" :value="s">
              {{ s === "none" ? "Free (no snap)" : s }}
            </option>
          </Select>
        </div>
        <button
          type="button"
          class="self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          @click="reset"
        >
          Reset sample data
        </button>

        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Live stats</span>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ stats.tasks }} tasks · {{ stats.groups }} groups · {{ stats.milestones }} milestones ·
            {{ stats.links }} dependencies
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Event log</span>
          <p v-if="log.length === 0" class="text-xs text-neutral-400 dark:text-neutral-500">
            Interact with the chart to see events.
          </p>
          <ul v-else class="flex flex-col gap-1">
            <li
              v-for="l in log"
              :key="l.id"
              class="rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"
            >
              {{ l.label }}
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #preview>
      <div class="flex h-[520px] w-full flex-col gap-3">
        <Gantt
          :tasks="tasks"
          :links="links"
          :lanes="lanes"
          :row-order="rowOrder"
          :color="color"
          :snap="snap"
          :height="430"
          @tasks-change="onTasksChange"
          @links-change="onLinksChange"
          @reorder="onReorder"
          @select="onSelect"
        />
        <p class="px-1 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
          Tip: hover a bar to reveal resize / progress / link handles · use the floating toolbar
          (top-right) for Day/Week/Month/Quarter zoom · Ctrl/Cmd + scroll to pinch zoom at the cursor.
        </p>
      </div>
    </template>
  </PlaygroundSection>
</template>
