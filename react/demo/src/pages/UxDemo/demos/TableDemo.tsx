import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import { Table, Button, IconButton, MultiToggle, Toggle } from "@cjlapao/ui-kit";
import {
  type TableVariant,
  type TableDensity,
  type TableSortState,
  type TableColumn,
  type TableSettings,
} from "@cjlapao/ui-kit";
import { type PanelTone } from "@cjlapao/ui-kit";
import {
  tableVariantOptions,
  tableDensityOptions,
  tableToneOptions,
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
  { id: "name", header: "User", accessor: "name", sortable: true, minWidth: 240 },
  { id: "email", header: "Email", accessor: "email", sortable: true, minWidth: 240 },
  { id: "role", header: "Role", accessor: "role", sortable: true, minWidth: 240 },
  { id: "lastSeen", header: "Last Seen", accessor: "lastSeen", sortable: true, minWidth: 240 },
];

export const TableDemo: React.FC = () => {
  const [sort, setSort] = useState<TableSortState | null>({
    columnId: "name",
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserRow[]>(filledData);
  const [tableVariant, setTableVariant] = useState<TableVariant>("outlined");
  const [tableDensity, setTableDensity] = useState<TableDensity>("default");
  const [tableBordered, setTableBordered] = useState(false);
  const [tableTone, setTableTone] = useState<PanelTone>("neutral");
  const [tableStriped, setTableStriped] = useState(true);
  const [tableHoverable, setTableHoverable] = useState(true);
  const [tableGroupable, setTableGroupable] = useState(true);
  const [tableStickyColumns, setTableStickyColumns] = useState(true);
  const [tableResizable, setTableResizable] = useState(true);
  const [persist, setPersist] = useState(false);
  const [storedSettings, setStoredSettings] = useState<TableSettings | null>(
    null,
  );

  return (
    <PlaygroundSection
      title="Table"
      label="[Table]"
      description="Data grid on a panel surface, with sorting, density, group-by, sticky columns, column resize, and optional built-in settings persistence."
      controls={
        <div className="space-y-4 text-sm">
          <label className="flex flex-col gap-2">
            <span>Surface (variant)</span>
            <MultiToggle
              fullWidth
              options={tableVariantOptions}
              value={tableVariant}
              size="sm"
              onChange={(value) => setTableVariant(value as TableVariant)}
            />
          </label>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Density</span>
              <MultiToggle
                fullWidth
                options={tableDensityOptions}
                value={tableDensity}
                size="sm"
                onChange={(value) => setTableDensity(value as TableDensity)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Tone</span>
              <MultiToggle
                fullWidth
                options={tableToneOptions}
                value={tableTone}
                size="sm"
                onChange={(value) => setTableTone(value as PanelTone)}
              />
            </label>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex items-center justify-between">
              <span>Bordered grid</span>
              <Toggle
                size="sm"
                checked={tableBordered}
                onChange={(event) => setTableBordered(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Striped rows</span>
              <Toggle
                size="sm"
                checked={tableStriped}
                onChange={(event) => setTableStriped(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Hover state</span>
              <Toggle
                size="sm"
                checked={tableHoverable}
                onChange={(event) => setTableHoverable(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Group by</span>
              <Toggle
                size="sm"
                checked={tableGroupable}
                onChange={(event) => setTableGroupable(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Sticky columns</span>
              <Toggle
                size="sm"
                checked={tableStickyColumns}
                onChange={(event) => setTableStickyColumns(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Column resize</span>
              <Toggle
                size="sm"
                checked={tableResizable}
                onChange={(event) => setTableResizable(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Persist settings</span>
              <Toggle
                size="sm"
                checked={persist}
                onChange={(event) => setPersist(event.target.checked)}
              />
            </label>
          </div>
        </div>
      }
      preview={
        <Table<UserRow>
          columns={columns}
          data={data}
          variant={tableVariant}
          density={tableDensity}
          bordered={tableBordered}
          tone={tableTone}
           striped={tableStriped}
           hoverable={tableHoverable}
           groupable={tableGroupable}
           userStickyColumns={tableStickyColumns}
           resizableColumns={tableResizable}
           maxHeight={360}
          loading={loading}
          loadingMessage="Syncing users..."
          loaderProgress={loading ? 42 : undefined}
          sortState={sort}
          onSortChange={setSort}
          rowKey={(row) => row.id}
          onRowClick={(row) => console.log("row clicked", row)}
          showColumnSelector
          storageKey={persist ? "uxdemo-table" : undefined}
          onTableSettingsChange={setStoredSettings}
          headerActions={
            <>
              <Button
                size="sm"
                variant="soft"
                color="blue"
                onClick={() => {
                  setLoading(true);
                  if (data.length === 0) {
                    setData(filledData);
                  }
                  setTimeout(() => setLoading(false), 500);
                }}
              >
                Refresh
              </Button>
              <IconButton
                icon="Trash"
                size="sm"
                variant="ghost"
                color="blue"
                onClick={() => {
                  setLoading(true);
                  setData(emptyData);
                  setTimeout(() => setLoading(false), 500);
                }}
              />
            </>
          }
          footer={
            <span>
              Showing {data.length} users
              {persist && storedSettings
                ? ` · saved ${JSON.stringify(storedSettings)}`
                : ""}
            </span>
          }
          emptyState="No users found"
        />
      }
    />
  );
};
