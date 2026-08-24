import React, { useState } from "react";
import { Table, MultiToggle } from "@cjlapao/ui-kit";
import type {
  SurfaceVariant,
  TableDensity,
  PanelTone,
  TrueColor,
  TableColumn,
  TableSettings,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  surfaceVariantOptions,
  tableDensityOptions,
  trueColorOptions,
} from "../../shared/options";

type ServiceRow = {
  id: string;
  service: string;
  owner: string;
  region: "eu-west" | "us-east";
  status: "healthy" | "degraded";
  uptime: number;
};

const ROWS: ServiceRow[] = [
  { id: "1", service: "api-gateway", owner: "platform", region: "eu-west", status: "healthy", uptime: 99.99 },
  { id: "2", service: "billing", owner: "payments", region: "eu-west", status: "degraded", uptime: 98.21 },
  { id: "3", service: "search", owner: "discovery", region: "us-east", status: "healthy", uptime: 99.95 },
  { id: "4", service: "notifications", owner: "comms", region: "us-east", status: "healthy", uptime: 99.87 },
  { id: "5", service: "auth", owner: "platform", region: "eu-west", status: "healthy", uptime: 100 },
];

const COLUMNS: TableColumn<ServiceRow>[] = [
  { id: "service", header: "Service", accessor: "service", sortable: true, groupable: true },
  { id: "owner", header: "Owner", accessor: "owner", sortable: true, groupable: true },
  { id: "region", header: "Region", accessor: "region", sortable: true },
  {
    id: "uptime",
    header: "Uptime",
    accessor: "uptime",
    sortable: true,
    className: "text-right",
    render: (row) => `${row.uptime.toFixed(2)}%`,
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    render: (row) => (
      <span
        className={
          row.status === "healthy"
            ? "inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400"
            : "inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400"
        }
      >
        <span
          className={
            row.status === "healthy"
              ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
              : "h-1.5 w-1.5 rounded-full bg-amber-500"
          }
        />
        {row.status === "healthy" ? "Healthy" : "Degraded"}
      </span>
    ),
  },
];

export const TablePlayground: React.FC = () => {
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<PanelTone>("neutral");
  // "" = the interior controls follow the table tone.
  const [controlTone, setControlTone] = useState("");
  const [density, setDensity] = useState<TableDensity>("default");
  const [bordered, setBordered] = useState(false);
  const [striped, setStriped] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [columnSelector, setColumnSelector] = useState(true);
  const [groupable, setGroupable] = useState(true);
  const [stickyColumns, setStickyColumns] = useState(true);
  const [resizable, setResizable] = useState(true);
  // ON by default so a page reload restores the last session's settings —
  // the toggle is there to show the opt-in in action.
  const [persist, setPersist] = useState(true);
  const [saved, setSaved] = useState<TableSettings | null>(null);

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Surface (variant)"
            options={surfaceVariantOptions}
            value={variant}
            onChange={(value) => setVariant(value as SurfaceVariant)}
          />
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(value) => setTone(value as PanelTone)}
          />
          <SelectControl
            label="Control tone"
            options={[
              { label: "Follow tone", value: "" },
              ...trueColorOptions,
            ]}
            value={controlTone}
            onChange={setControlTone}
          />
          <Control label="Density">
            <MultiToggle
              fullWidth
              size="sm"
              options={tableDensityOptions}
              value={density}
              onChange={(value) => setDensity(value as TableDensity)}
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Bordered grid" checked={bordered} onChange={setBordered} />
            <ToggleRow label="Striped rows" checked={striped} onChange={setStriped} />
            <ToggleRow label="Row hover" checked={hoverable} onChange={setHoverable} />
            <ToggleRow
              label="Column selector"
              checked={columnSelector}
              onChange={setColumnSelector}
            />
            <ToggleRow label="Group by" checked={groupable} onChange={setGroupable} />
            <ToggleRow
              label="Sticky columns"
              checked={stickyColumns}
              onChange={setStickyColumns}
            />
            <ToggleRow label="Column resize" checked={resizable} onChange={setResizable} />
            <ToggleRow label="Persist settings" checked={persist} onChange={setPersist} />
          </div>
          <p className="text-xs opacity-70">
            With <code>storageKey</code> set, column visibility, column widths,
            group-by, pinned columns and the active view are written to{" "}
            <code>localStorage</code> under{" "}
            <code>ui-kit:table:playground</code> and restored on the next mount.
            {saved ? ` Last save: ${JSON.stringify(saved)}` : ""}
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <Table<ServiceRow>
            columns={COLUMNS}
            data={ROWS}
            rowKey={(row) => row.id}
            variant={variant}
            tone={tone}
            color={controlTone ? (controlTone as TrueColor) : undefined}
            density={density}
            bordered={bordered}
            striped={striped}
            hoverable={hoverable}
            showColumnSelector={columnSelector}
            groupable={groupable}
            userStickyColumns={stickyColumns}
            resizableColumns={resizable}
            showGroupHeader
            storageKey={persist ? "playground" : undefined}
            onTableSettingsChange={setSaved}
            maxHeight={420}
            footer={<span>{ROWS.length} services</span>}
          />
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
