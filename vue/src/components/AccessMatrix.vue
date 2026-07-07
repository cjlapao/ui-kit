<script lang="ts">
import { h, type VNode } from "vue";
import type { TableVariant } from "./Table.vue";
import type { PanelTone } from "./Panel.vue";

export interface AccessMatrixPermission {
  group: string;
  resource: string;
  action: string;
  enabled: boolean;
}

export interface AccessMatrixProps {
  permissions: AccessMatrixPermission[];
  /** Number of groups visible before the "Show more" button appears. Defaults to 5. */
  limit?: number;
  variant?: TableVariant;
  tone?: PanelTone;
  striped?: boolean;
  /** Forwards to Table: remove inner row borders/dividers. */
  noBorders?: boolean;
  /** Forwards to Table: make the table fill parent height and scroll internally. */
  fullHeight?: boolean;
  hoverable?: boolean;
  /**
   * Background Tailwind class(es) applied to the sticky Resource column cells so they remain
   * opaque over scrolled action columns. Defaults to `'bg-white dark:bg-neutral-900'`.
   * Pass `'bg-transparent'` when the table sits inside a container whose background should
   * show through (e.g. a tinted panel or card).
   */
  stickyBackground?: string;
}

interface MatrixRow {
  _key: string;
  _group: string;
  _resource: string;
  _isGroupHeader?: boolean;
  _groupCount?: number;
  [actionKey: string]: boolean | string | number | undefined;
}

function ChevronSvg({ expanded }: { expanded: boolean }): VNode {
  return h(
    "svg",
    {
      viewBox: "0 0 16 16",
      fill: "none",
      width: "14",
      height: "14",
      class: `flex-shrink-0 text-current transition-transform duration-200${expanded ? " rotate-90" : ""}`,
      "aria-hidden": "true",
    },
    [
      h("path", {
        d: "M6 4l4 4-4 4",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    ],
  );
}

const EnabledCell = (): VNode =>
  h(
    "span",
    { class: "flex items-center justify-center", "aria-label": "Enabled" },
    [
      h(
        "svg",
        {
          viewBox: "0 0 20 20",
          fill: "none",
          class: "h-5 w-5 text-emerald-500",
        },
        [
          h("circle", {
            cx: "10",
            cy: "10",
            r: "9",
            fill: "currentColor",
            "fill-opacity": "0.12",
          }),
          h("path", {
            d: "M6.5 10.5l2.5 2.5 4.5-5",
            stroke: "currentColor",
            "stroke-width": "1.75",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      ),
    ],
  );

const DisabledCell = (): VNode =>
  h(
    "span",
    { class: "flex items-center justify-center", "aria-label": "Disabled" },
    [
      h(
        "svg",
        {
          viewBox: "0 0 20 20",
          fill: "none",
          class: "h-5 w-5 text-slate-300 dark:text-slate-600",
        },
        [
          h("path", {
            d: "M6 10h8",
            stroke: "currentColor",
            "stroke-width": "1.75",
            "stroke-linecap": "round",
          }),
        ],
      ),
    ],
  );
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import Table from "./Table.vue";
import type { TableColumn } from "./Table.vue";
import Button from "./Button.vue";
import Badge from "./Badge.vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "AccessMatrix", inheritAttrs: false });

const props = withDefaults(defineProps<AccessMatrixProps>(), {
  limit: 5,
  variant: "default",
  tone: "neutral",
  striped: false,
  noBorders: false,
  fullHeight: false,
  hoverable: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const expanded = ref(false);
const collapsedGroups = ref<Set<string>>(new Set());

// Unique actions in insertion order → become the action columns
const actions = computed(() => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of props.permissions) {
    if (!seen.has(p.action)) {
      seen.add(p.action);
      result.push(p.action);
    }
  }
  return result;
});

// Unique groups in insertion order → used for slicing (limit)
const allGroups = computed(() => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of props.permissions) {
    if (!seen.has(p.group)) {
      seen.add(p.group);
      result.push(p.group);
    }
  }
  return result;
});

const visibleGroups = computed(() =>
  expanded.value ? allGroups.value : allGroups.value.slice(0, props.limit),
);
const hiddenCount = computed(() => allGroups.value.length - props.limit);

// Build rows: group header pseudo-rows + data rows, with collapsed groups omitted
const rows = computed((): MatrixRow[] => {
  const lookup = new Map<string, boolean>();
  for (const p of props.permissions) {
    lookup.set(`${p.group}::${p.resource}::${p.action}`, p.enabled);
  }

  const groupResources = new Map<string, string[]>();
  for (const p of props.permissions) {
    if (!groupResources.has(p.group)) groupResources.set(p.group, []);
    const res = groupResources.get(p.group)!;
    if (!res.includes(p.resource)) res.push(p.resource);
  }

  const result: MatrixRow[] = [];
  for (const group of visibleGroups.value) {
    const resources = groupResources.get(group) ?? [];

    // Group header pseudo-row
    result.push({
      _key: `__group__${group}`,
      _group: group,
      _resource: group,
      _isGroupHeader: true,
      _groupCount: resources.length,
    });

    // Data rows — omitted when the group is collapsed
    if (!collapsedGroups.value.has(group)) {
      for (const resource of resources) {
        const row: MatrixRow = {
          _key: `${group}::${resource}`,
          _group: group,
          _resource: resource,
        };
        for (const action of actions.value) {
          row[action] = lookup.get(`${group}::${resource}::${action}`) ?? false;
        }
        result.push(row);
      }
    }
  }
  return result;
});

// Pre-compute per-group alternating stripe index (resets per group, skips headers)
const stripeMap = computed(() => {
  const map = new Map<string, boolean>();
  let idx = 0;
  for (const row of rows.value) {
    if (row._isGroupHeader) {
      idx = 0;
    } else {
      map.set(row._key, idx % 2 === 1);
      idx++;
    }
  }
  return map;
});

const toggleGroup = (group: string) => {
  const next = new Set(collapsedGroups.value);
  if (next.has(group)) next.delete(group);
  else next.add(group);
  collapsedGroups.value = next;
};

const columns = computed((): TableColumn<MatrixRow>[] => {
  // Resource column — sticky left, no expand-spacer sibling so it lands at left-0
  const resourceCol: TableColumn<MatrixRow> = {
    id: "_resource",
    header: "Resource",
    minWidth: 140,
    sticky: "left",
    sortable: false,
    resizable: false,
    hideable: false,
    stickyBackgroundFn: (row) =>
      row._isGroupHeader ? "bg-neutral-50 dark:bg-neutral-800/40" : undefined,
    render: (row) => {
      if (row._isGroupHeader) {
        return h("span", { class: "inline-flex items-center gap-2" }, [
          ChevronSvg({ expanded: !collapsedGroups.value.has(row._group) }),
          h(
            "span",
            {
              class: "font-semibold text-neutral-700 dark:text-neutral-200",
            },
            row._resource,
          ),
          h(Badge, { count: row._groupCount as number, tone: props.tone }),
        ]);
      }
      return h(
        "span",
        { class: "pl-2 text-sm text-neutral-700 dark:text-neutral-200" },
        row._resource,
      );
    },
  };

  // One column per unique action
  const actionCols: TableColumn<MatrixRow>[] = actions.value.map((action) => ({
    id: action,
    header: action,
    align: "center" as const,
    sortable: false,
    resizable: false,
    hideable: false,
    render: (row: MatrixRow) => {
      if (row._isGroupHeader) return null;
      return row[action] === true ? EnabledCell() : DisabledCell();
    },
  }));

  return [resourceCol, ...actionCols];
});

const rowKeyFn = (row: MatrixRow) => row._key;

const onRowClick = (row: MatrixRow) => {
  if (row._isGroupHeader) toggleGroup(row._group);
};

const rowClassNameFn = (row: MatrixRow) => {
  if (row._isGroupHeader) {
    return "cursor-pointer select-none border-b border-neutral-100 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/50";
  }
  return props.striped && stripeMap.value.get(row._key)
    ? "bg-neutral-100 dark:bg-neutral-800/40"
    : "";
};
</script>

<template>
  <div
    :class="classNames(fullHeight && 'h-full flex flex-col', classAttr)"
    v-bind="restAttrs"
  >
    <Table
      :columns="columns"
      :data="rows"
      :variant="variant"
      :tone="tone"
      :row-key="rowKeyFn"
      :striped="striped"
      :no-borders="noBorders"
      :hoverable="hoverable"
      :full-height="fullHeight"
      :class="fullHeight ? 'flex-1 min-h-0' : undefined"
      sticky-header
      :row-class-name="rowClassNameFn"
      @row-click="onRowClick"
    />
    <div v-if="hiddenCount > 0" class="mt-3 flex justify-center">
      <Button
        variant="ghost"
        color="blue"
        size="sm"
        :trailing-icon="expanded ? 'ArrowUp' : 'ArrowDown'"
        @click="expanded = !expanded"
      >
        {{
          expanded
            ? "Show less"
            : `Show ${hiddenCount} more ${hiddenCount === 1 ? "group" : "groups"}`
        }}
      </Button>
    </div>
  </div>
</template>
