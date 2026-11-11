import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import React, { useRef, useState } from "react";
import { Table, MultiToggle, IconButton } from "@cjlapao/ui-kit";
import type {
  SurfaceVariant,
  TableDensity,
  TrueColor,
  TableColumn,
  TableLoaderType,
  TableSettings,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
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
  {
    id: "1",
    service: "api-gateway",
    owner: "platform",
    region: "eu-west",
    status: "healthy",
    uptime: 99.99,
  },
  {
    id: "2",
    service: "billing",
    owner: "payments",
    region: "eu-west",
    status: "degraded",
    uptime: 98.21,
  },
  {
    id: "3",
    service: "search",
    owner: "discovery",
    region: "us-east",
    status: "healthy",
    uptime: 99.95,
  },
  {
    id: "4",
    service: "notifications",
    owner: "comms",
    region: "us-east",
    status: "healthy",
    uptime: 99.87,
  },
  {
    id: "5",
    service: "auth",
    owner: "platform",
    region: "eu-west",
    status: "healthy",
    uptime: 100,
  },
];

const PREVIEW_ROWS = Array.from({ length: 20 }, (_, index) =>
  ROWS.map((row) => ({ ...row, id: `${row.id}-${index}`, service: index ? `${row.service}-${index + 1}` : row.service })),
).flat();

const COLUMNS: TableColumn<ServiceRow>[] = [
  {
    id: "service",
    header: "Service",
    minWidth: 240,
    accessor: "service",
    sortable: true,
    groupable: true,
  },
  {
    id: "owner",
    header: "Owner",
    minWidth: 140,
    accessor: "owner",
    sortable: true,
    groupable: true,
  },
  { id: "region", minWidth: 120, header: "Region", accessor: "region", sortable: true },
  {
    id: "uptime",
    header: "Uptime",
    minWidth: 120,
    accessor: "uptime",
    sortable: true,
    className: "text-right",
    render: (row) => `${row.uptime.toFixed(2)}%`,
  },
  {
    id: "status",
    header: "Status",
    minWidth: 140,
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
  // "auto" = the toolbar menus follow the table's surface.
  const [panelVariant, setPanelVariant] = useState<string>("auto");
  const [tone, setTone] = useState<SurfaceTone>("none");
  // "" = the interior controls follow the table tone.
  const [controlTone, setControlTone] = useState("");
  const [density, setDensity] = useState<TableDensity>("default");
  const [fullHeight, setFullHeight] = useState(true);
  const [dataMode, setDataMode] = useState("paginated");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loadedCount, setLoadedCount] = useState(20);
  const datasetGeneration = useRef(0);
  const changeDataMode = (value: string) => {
    datasetGeneration.current += 1;
    setDataMode(value);
    setPage(1);
    setLoadedCount(pageSize);
  };
  const [bordered, setBordered] = useState(false);
  const [striped, setStriped] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [columnSelector, setColumnSelector] = useState(true);
  const [groupable, setGroupable] = useState(true);
  const [stickyActions, setStickyActions] = useState(true);
  const [stickyColumns, setStickyColumns] = useState(true);
  const [resizable, setResizable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState<TableLoaderType>("spinner");
  const [loaderProgress, setLoaderProgress] = useState(50);
  // ON by default so a page reload restores the last session's settings —
  // the toggle is there to show the opt-in in action.
  const [persist, setPersist] = useState(true);
  const [saved, setSaved] = useState<TableSettings | null>(null);
  const [log, pushLog] = useEventLog();

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl
                      label="Surface (variant)"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as SurfaceVariant)}
                    />
                    <SelectControl
                      label="Menus surface"
                      options={[
                        {
                          label: "Auto (follows the table)",
                          value: "auto",
                        },
                        ...surfaceVariantOptions,
                      ]}
                      value={panelVariant}
                      onChange={setPanelVariant}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <SurfaceToneSwatches value={tone} onSelect={setTone} />
                    </Control>
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
                  </>
                ),
              },
              {
                id: "loader",
                title: "Loader",
                controls: (
                  <>
                    <Control label="Loader (while loading)">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={[
                          { label: "Spinner", value: "spinner" },
                          { label: "Progress", value: "progress" },
                          { label: "Skeleton", value: "skeleton" },
                        ]}
                        value={loaderType}
                        onChange={(value) =>
                          setLoaderType(value as TableLoaderType)
                        }
                      />
                    </Control>
                    {loaderType === "progress" && (
                      <SelectControl
                        label="Progress"
                        options={[
                          { label: "25%", value: "25" },
                          { label: "50%", value: "50" },
                          { label: "75%", value: "75" },
                        ]}
                        value={String(loaderProgress)}
                        onChange={(value) => setLoaderProgress(Number(value))}
                      />
                    )}
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <SelectControl label="Data loading" options={[{ value: "paginated", label: "Paginated" }, { value: "infinite", label: "Infinite scroll" }]} value={dataMode} onChange={changeDataMode} />
                    <ToggleRow label="Fill parent" checked={fullHeight} onChange={setFullHeight} />
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <ToggleRow
                      label="Bordered grid"
                      checked={bordered}
                      onChange={setBordered}
                    />
                    <ToggleRow
                      label="Striped rows"
                      checked={striped}
                      onChange={setStriped}
                    />
                    <ToggleRow
                      label="Row hover"
                      checked={hoverable}
                      onChange={setHoverable}
                    />
                    <ToggleRow
                      label="Column selector"
                      checked={columnSelector}
                      onChange={setColumnSelector}
                    />
                    <ToggleRow
                      label="Group by"
                      checked={groupable}
                      onChange={setGroupable}
                    />
                    <ToggleRow label="Fixed actions" checked={stickyActions} onChange={setStickyActions} />
                    <ToggleRow
                      label="Sticky columns"
                      checked={stickyColumns}
                      onChange={setStickyColumns}
                    />
                    <ToggleRow
                      label="Column resize"
                      checked={resizable}
                      onChange={setResizable}
                    />
                    <ToggleRow
                      label="Persist settings"
                      checked={persist}
                      onChange={setPersist}
                    />
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — callbacks report through here."
          />
          <p className="text-xs opacity-70">
            Enable <code>Fill parent</code> and drag the preview corner to resize both dimensions. The parent must provide a bounded height. Only the body scrolls.
            <br />
            Toggle <code>Loading</code> to preview the three Panel-style loaders
            — the spinner/progress overlay stays pinned to the card while the
            content scrolls (the preview has a fixed height, so scroll it to
            check), and the skeleton replaces the rows with pulsing
            placeholders.
            <br />
            With <code>storageKey</code> set, column visibility, column widths,
            group-by, pinned columns and the active view are written to{" "}
            <code>localStorage</code> under <code>ui-kit:table:playground</code>{" "}
            and restored on the next mount.
            {saved ? ` Last save: ${JSON.stringify(saved)}` : ""}
          </p>
        </div>
      }
      preview={
        <div className="w-full min-w-0 overflow-hidden" style={fullHeight ? { height: 480, resize: "both", maxWidth: "100%", minWidth: 240, minHeight: 200 } : undefined}>
          <Table<ServiceRow>
            columns={[...COLUMNS, {
              id: "actions",
              header: "Actions",
              width: 96,
              isActionsColumn: true,
              render: (row) => <IconButton icon="DotsVertical" variant="ghost" aria-label={`Actions for ${row.service}`} onClick={() => pushLog(`Actions: ${row.service}`)} />,
            }]}
            data={dataMode === "infinite" ? PREVIEW_ROWS.slice(0, loadedCount) : PREVIEW_ROWS.slice((page - 1) * pageSize, page * pageSize)}
            pagination={dataMode === "paginated" ? {
              page, pageSize, total: PREVIEW_ROWS.length,
              onPageChange: setPage,
              onPageSizeChange: (size) => { setPageSize(size); setPage(1); },
            } : undefined}
            infiniteScroll={dataMode === "infinite" ? {
              hasMore: loadedCount < PREVIEW_ROWS.length,
              resetKey: dataMode,
              onLoadMore: async () => {
                const generation = datasetGeneration.current;
                await new Promise((resolve) => setTimeout(resolve, 600));
                if (generation !== datasetGeneration.current) return;
                setLoadedCount((count) => Math.min(count + pageSize, PREVIEW_ROWS.length));
                pushLog("Loaded next page");
              },
            } : undefined}
            rowKey={(row) => row.id}
            variant={variant}
            panelVariant={panelVariant as "auto" | SurfaceVariant}
            tone={tone}
            color={controlTone ? (controlTone as TrueColor) : undefined}
            density={density}
            bordered={bordered}
            striped={striped}
            hoverable={hoverable}
            showColumnSelector={columnSelector}
            groupable={groupable}
            userStickyColumns={stickyColumns}
            stickyActions={stickyActions}
            resizableColumns={resizable}
            showGroupHeader
            storageKey={persist ? "playground" : undefined}
            onSortChange={(sort) =>
              pushLog(
                sort
                  ? `onSortChange \u2192 ${sort.columnId} ${
                      sort.direction === "asc" ? "\u2191" : "\u2193"
                    }`
                  : "onSortChange \u2192 cleared",
              )
            }
            onRowClick={(row) => pushLog(`onRowClick \u2192 ${row.service}`)}
            onTableSettingsChange={(next) => {
              setSaved(next);
              pushLog("onTableSettingsChange \u2192 saved");
            }}
            fullHeight={fullHeight}
            maxHeight={fullHeight ? undefined : 420}
            loading={loading}
            loadingMessage="Loading services…"
            loaderType={loaderType}
            loaderProgress={
              loaderType === "progress" ? loaderProgress : undefined
            }
          />
        </div>
      }
    ></PlaygroundPanel>
  );
};
