<script setup lang="ts">
import { ref } from "vue";
import {
  Table,
  Button,
  IconButton,
  MultiToggle,
  Toggle,
  Select,
  type TableVariant,
  type TableDensity,
  type TableSortState,
  type TableColumn,
  type TableSettings,
  type SurfaceCorner,
  type PanelTone,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  tableVariantOptions,
  tableDensityOptions,
  surfaceCornerOptions,
  trueColorOptions,
} from "../constants";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  lastSeen: string;
};

const filledData: UserRow[] = [
  {
    id: "1",
    name: "Sasha G.",
    email: "sasha@company.com",
    role: "Admin",
    lastSeen: "2 hours ago",
  },
  {
    id: "2",
    name: "Kim C.",
    email: "kim@company.com",
    role: "Editor",
    lastSeen: "Yesterday",
  },
  {
    id: "3",
    name: "Lee R.",
    email: "lee@company.com",
    role: "Viewer",
    lastSeen: "Just now",
  },
  {
    id: "4",
    name: "Mia P.",
    email: "mia@company.com",
    role: "Editor",
    lastSeen: "3 days ago",
  },
  {
    id: "5",
    name: "Omar F.",
    email: "omar@company.com",
    role: "Admin",
    lastSeen: "Last week",
  },
  {
    id: "6",
    name: "Nina K.",
    email: "nina@company.com",
    role: "Viewer",
    lastSeen: "5 hours ago",
  },
];

const emptyData: UserRow[] = [];

const columns: TableColumn<UserRow>[] = [
  { id: "name", header: "User", accessor: "name", sortable: true, minWidth: 160 },
  { id: "email", header: "Email", accessor: "email", sortable: true, minWidth: 190 },
  { id: "role", header: "Role", accessor: "role", sortable: true, minWidth: 120 },
  { id: "lastSeen", header: "Last Seen", accessor: "lastSeen", sortable: true, minWidth: 140 },
];

const sort = ref<TableSortState | null>({
  columnId: "name",
  direction: "asc",
});
const loading = ref(false);
const data = ref<UserRow[]>(filledData);
const tableVariant = ref<TableVariant>("outlined");
const tableDensity = ref<TableDensity>("default");
const tableCorner = ref<SurfaceCorner>("rounded-md");
const tableBordered = ref(false);
const tableTone = ref<PanelTone>("neutral");
const tableStriped = ref(true);
const tableHoverable = ref(true);
const tableGroupable = ref(true);
const tableStickyColumns = ref(true);
const tableResizable = ref(true);
const persist = ref(false);
const storedSettings = ref<TableSettings | null>(null);

const handleRefresh = () => {
  loading.value = true;
  if (data.value.length === 0) {
    data.value = filledData;
  }
  setTimeout(() => (loading.value = false), 500);
};

const handleClear = () => {
  loading.value = true;
  data.value = emptyData;
  setTimeout(() => (loading.value = false), 500);
};

const handleRowClick = (row: UserRow) => {
  console.log("row clicked", row);
};

const handleSettingsChange = (settings: TableSettings) => {
  storedSettings.value = settings;
};
</script>

<template>
  <PlaygroundSection
    title="Table"
    label="[Table]"
    description="Data grid on a panel surface, with sorting, density, group-by, sticky columns, column resize, and optional built-in settings persistence."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-2">
          <span>Surface (variant)</span>
          <MultiToggle
            full-width
            :options="tableVariantOptions"
            :model-value="tableVariant"
            size="sm"
            @update:model-value="
              (value: string) => (tableVariant = value as TableVariant)
            "
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Density</span>
          <MultiToggle
            full-width
            :options="tableDensityOptions"
            :model-value="tableDensity"
            size="sm"
            @update:model-value="
              (value: string) => (tableDensity = value as TableDensity)
            "
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Corner</span>
          <MultiToggle
            full-width
            :options="surfaceCornerOptions"
            :model-value="tableCorner"
            size="sm"
            @update:model-value="
              (value: string) => (tableCorner = value as SurfaceCorner)
            "
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Tone</span>
          <Select
            :model-value="tableTone"
            @update:model-value="tableTone = $event as PanelTone"
          >
            <option
              v-for="option in trueColorOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </Select>
        </label>
        <div class="grid gap-2 md:grid-cols-2">
          <label class="flex items-center justify-between">
            <span>Bordered grid</span>
            <Toggle size="sm" v-model="tableBordered" />
          </label>
          <label class="flex items-center justify-between">
            <span>Striped rows</span>
            <Toggle size="sm" v-model="tableStriped" />
          </label>
          <label class="flex items-center justify-between">
            <span>Hover state</span>
            <Toggle size="sm" v-model="tableHoverable" />
          </label>
          <label class="flex items-center justify-between">
            <span>Group by</span>
            <Toggle size="sm" v-model="tableGroupable" />
          </label>
          <label class="flex items-center justify-between">
            <span>Sticky columns</span>
            <Toggle size="sm" v-model="tableStickyColumns" />
          </label>
          <label class="flex items-center justify-between">
            <span>Column resize</span>
            <Toggle size="sm" v-model="tableResizable" />
          </label>
          <label class="flex items-center justify-between">
            <span>Persist settings</span>
            <Toggle size="sm" v-model="persist" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <Table
        :columns="columns"
        :data="data"
        :variant="tableVariant"
        :density="tableDensity"
        :corner="tableCorner"
        :bordered="tableBordered"
        :tone="tableTone"
        :striped="tableStriped"
        :hoverable="tableHoverable"
        :groupable="tableGroupable"
        :user-sticky-columns="tableStickyColumns"
        :resizable-columns="tableResizable"
        :max-height="360"
        :loading="loading"
        loading-message="Syncing users..."
        :loader-progress="loading ? 42 : undefined"
        :sort-state="sort"
        :row-key="(row: UserRow) => row.id"
        show-column-selector
        :storage-key="persist ? 'uxdemo-table' : undefined"
        :empty-state="'No users found'"
        @sort-change="(value: TableSortState | null) => (sort = value)"
        @row-click="handleRowClick"
        @table-settings-change="handleSettingsChange"
      >
        <template #headerActions>
          <Button size="sm" variant="soft" color="blue" @click="handleRefresh">
            Refresh
          </Button>
          <IconButton
            icon="Trash"
            size="sm"
            variant="ghost"
            color="blue"
            @click="handleClear"
          />
        </template>
        <template #footer>
          <span>
            Showing {{ data.length }} users
            <template v-if="persist && storedSettings">
              · saved {{ JSON.stringify(storedSettings) }}
            </template>
          </span>
        </template>
      </Table>
    </template>
  </PlaygroundSection>
</template>
