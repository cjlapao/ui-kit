<script setup lang="ts">
import { ref } from "vue";
import {
  Table,
  Button,
  IconButton,
  MultiToggle,
  Toggle,
  type TableVariant,
  type TableSortState,
  type TableColumn,
  type PanelTone,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { tableVariantOptions, tableToneOptions } from "../constants";

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
];

const emptyData: UserRow[] = [];

const columns: TableColumn<UserRow>[] = [
  { id: "name", header: "User", sortable: true },
  { id: "email", header: "Email", sortable: true },
  { id: "role", header: "Role", sortable: true },
  { id: "lastSeen", header: "Last Seen", sortable: true },
];

const sort = ref<TableSortState | null>({
  columnId: "name",
  direction: "asc",
});
const loading = ref(false);
const data = ref<UserRow[]>(filledData);
const tableVariant = ref<TableVariant>("default");
const tableTone = ref<PanelTone>("neutral");
const tableStriped = ref(true);
const tableHoverable = ref(true);

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
</script>

<template>
  <PlaygroundSection
    title="Table"
    label="[Table]"
    description="Data grid with sorting, loading, and tones."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-2">
          <span>Variant</span>
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
          <span>Tone</span>
          <MultiToggle
            full-width
            :options="tableToneOptions"
            :model-value="tableTone"
            size="sm"
            @update:model-value="
              (value: string) => (tableTone = value as PanelTone)
            "
          />
        </label>
        <div class="grid gap-2 md:grid-cols-2">
          <label class="flex items-center justify-between">
            <span>Striped rows</span>
            <Toggle size="sm" v-model="tableStriped" />
          </label>
          <label class="flex items-center justify-between">
            <span>Hover state</span>
            <Toggle size="sm" v-model="tableHoverable" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <Table
        :columns="columns"
        :data="data"
        :variant="tableVariant"
        :tone="tableTone"
        :striped="tableStriped"
        :hoverable="tableHoverable"
        :max-height="360"
        :loading="loading"
        loading-message="Syncing users..."
        :loader-progress="loading ? 42 : undefined"
        :sort-state="sort ?? undefined"
        :row-key="(row: UserRow) => row.id"
        empty-state="No users found"
        @sort-change="(value: TableSortState | null) => (sort = value)"
        @row-click="handleRowClick"
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
          <span>Showing {{ data.length }} users</span>
        </template>
      </Table>
    </template>
  </PlaygroundSection>
</template>
