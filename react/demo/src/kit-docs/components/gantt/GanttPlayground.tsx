import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import type { SurfaceTone, SurfaceVariant } from "@cjlapao/ui-kit";
import React, { useState } from "react";
import {
  Gantt,
  Rocket,
  SURFACE_TONES,
  sampleGantt,
  type GanttCorner,
  type GanttLane,
  type GanttLink,
  type GanttPadding,
  type GanttSnap,
  type GanttTask,
  type GanttVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";

const ACCENTS: TrueColor[] = ["blue", "emerald", "violet", "amber", "rose", "cyan"];
const SNAPS: { label: string; value: GanttSnap }[] = [
  { label: "Free (no snap)", value: "none" },
  { label: "Hour", value: "hour" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
];
const VARIANTS: { label: string; value: GanttVariant }[] = [
  { label: "None (no card)", value: "none" },
  { label: "Elevated", value: "elevated" },
  { label: "Outlined", value: "outlined" },
  { label: "Subtle", value: "subtle" },
  { label: "Tonal", value: "tonal" },
  { label: "Default (glassy)", value: "default" },
  { label: "Glass", value: "glass" },
  { label: "Liquid glass", value: "liquid-glass" },
  { label: "Simple", value: "simple" },
];
// The zoom pill may follow the chart's surface ("Follow chart" → prop left
// unset) or pin one of its own — e.g. an `elevated` pill on a `none` chart.
const CONTROL_VARIANTS: { label: string; value: string }[] = [
  { label: "Follow chart", value: "auto" },
  ...VARIANTS,
];
const CONTROL_TONES: { label: string; value: string }[] = [
  { label: "Follow chart", value: "auto" },
  ...SURFACE_TONES.map((t) => ({
    label: t === "none" ? "None — no tint" : t[0].toUpperCase() + t.slice(1),
    value: t,
  })),
];

const CORNERS: { label: string; value: GanttCorner }[] = [
  { label: "Sharp (none)", value: "none" },
  { label: "Slight (rounded)", value: "rounded" },
  { label: "Soft (rounded-sm)", value: "rounded-sm" },
  { label: "Medium (rounded-md)", value: "rounded-md" },
  { label: "Large (rounded-lg)", value: "rounded-lg" },
  { label: "Extra (rounded-xl)", value: "rounded-xl" },
];
const PADDINGS: { label: string; value: GanttPadding }[] = [
  { label: "None", value: "none" },
  { label: "Extra small", value: "xs" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra large", value: "xl" },
];
const HEADER_ALIGN: { label: string; value: string }[] = [
  { label: "End — beside the zoom pill", value: "end" },
  { label: "Start — left, after the title", value: "start" },
];
const LANES: GanttLane[] = sampleGantt.lanes;
const INITIAL_TASKS = sampleGantt.tasks();
const INITIAL_LINKS = sampleGantt.links();

export const GanttPlayground: React.FC = () => {
  const [surfaceTone, setSurfaceTone] = useState<SurfaceTone>("none");
  const [tasks, setTasks] = useState<GanttTask[]>(INITIAL_TASKS);
  const [links, setLinks] = useState<GanttLink[]>(INITIAL_LINKS);
  const [rowOrder, setRowOrder] = useState<string[] | undefined>(undefined);
  const [accent, setAccent] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<GanttVariant>("elevated");
  const [controlsVariant, setControlsVariant] = useState<SurfaceVariant | "auto">("auto");
  const [controlsTone, setControlsTone] = useState<SurfaceTone | "auto">("auto");
  const [fullHeight, setFullHeight] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [columnEdges, setColumnEdges] = useState(false);
  const [corner, setCorner] = useState<GanttCorner>("rounded-sm");
  const [padding, setPadding] = useState<GanttPadding>("none");
  const [snap, setSnap] = useState<GanttSnap>("day");
  const [editable, setEditable] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [resizableCols, setResizableCols] = useState(true);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [showTitle, setShowTitle] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [showPill, setShowPill] = useState(true);
  const [headerActionsAlign, setHeaderActionsAlign] = useState<"start" | "end">("end");
  const [groupBy, setGroupBy] = useState<"epic" | "priority">("epic");
  const [log, setLog] = useState<{ id: number; label: string }[]>([]);
  const [seq, setSeq] = useState(0);

  const pushLog = (label: string) => {
    setSeq((s) => s + 1);
    setLog((prev) => [{ id: seq + 1, label }, ...prev].slice(0, 6));
  };

  const reset = () => {
    setTasks(INITIAL_TASKS);
    setLinks(INITIAL_LINKS);
    setRowOrder(undefined);
    setVariant("elevated");
    setControlsVariant("auto");
    setControlsTone("auto");
    setFullHeight(false);
    setFullWidth(false);
    setColumnEdges(false);
    setCorner("rounded-sm");
    setPadding("none");
    setColumnWidths({});
    setShowTitle(true);
    setShowIcon(true);
    setShowPill(true);
    setHeaderActionsAlign("end");
    setGroupBy("epic");
    setLog([]);
  };

  return (
    <PlaygroundPanel
      controls={
        <div className="flex flex-col gap-4">
          <SurfaceToneControl label="Surface tone" value={surfaceTone} onChange={setSurfaceTone} />
          <Control label="Accent">
            <div className="flex flex-wrap gap-1.5">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Accent ${c}`}
                  onClick={() => setAccent(c)}
                  className={`h-6 w-6 rounded-full ring-2 ring-offset-1 transition dark:ring-offset-neutral-900 ${
                    accent === c
                      ? "ring-neutral-400 dark:ring-neutral-500"
                      : "ring-transparent"
                  }`}
                  style={{ backgroundColor: `var(--color-${c}-500)` }}
                />
              ))}
            </div>
          </Control>
          <SelectControl
            label="Surface variant"
            options={VARIANTS}
            value={variant}
            onChange={(v) => setVariant(v as GanttVariant)}
          />
          <SelectControl
            label="Controls variant (zoom pill)"
            options={CONTROL_VARIANTS}
            value={controlsVariant}
            onChange={(v) => setControlsVariant(v as SurfaceVariant | "auto")}
          />
          <SelectControl
            label="Controls tone (zoom pill)"
            options={CONTROL_TONES}
            value={controlsTone}
            onChange={(v) => setControlsTone(v as SurfaceTone | "auto")}
          />
          <SelectControl
            label="Snap"
            options={SNAPS}
            value={snap}
            onChange={(v) => setSnap(v as GanttSnap)}
          />
          <SelectControl
            label="Corner"
            options={CORNERS}
            value={corner}
            onChange={(v) => setCorner(v as GanttCorner)}
          />
          <SelectControl
            label="Padding"
            options={PADDINGS}
            value={padding}
            onChange={(v) => setPadding(v as GanttPadding)}
          />
          <div className="flex flex-col gap-2.5">
            <ToggleRow
              label="Editable (drag / resize / reorder)"
              checked={editable}
              onChange={setEditable}
            />
            <ToggleRow label="Today marker" checked={showToday} onChange={setShowToday} />
            <ToggleRow
              label="Full height (fill parent, height = min)"
              checked={fullHeight}
              onChange={setFullHeight}
            />
            <ToggleRow label="Full width" checked={fullWidth} onChange={setFullWidth} />
            <ToggleRow
              label="Column edges (box the fixed table)"
              checked={columnEdges}
              onChange={setColumnEdges}
            />
            <ToggleRow
              label="Resizable columns (drag a header edge)"
              checked={resizableCols}
              onChange={setResizableCols}
            />
            <ToggleRow label="Header title / subtitle" checked={showTitle} onChange={setShowTitle} />
            <ToggleRow label="Header icon" checked={showIcon} onChange={setShowIcon} />
            <ToggleRow label="Live pill (actions)" checked={showPill} onChange={setShowPill} />
          </div>
          <SelectControl
            label="Header actions align"
            options={HEADER_ALIGN}
            value={headerActionsAlign}
            onChange={(v) => setHeaderActionsAlign(v as "start" | "end")}
          />
          <button
            type="button"
            onClick={reset}
            className="self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Reset sample data
          </button>
          <Control label="Event log">
            {/* Fixed height: log entries (e.g. the drag-start selection) must
                never reflow the page mid-drag. */}
            <ul className="flex h-[168px] flex-col gap-1 overflow-y-auto">
              {log.length === 0 && (
                <li className="text-xs text-neutral-400 dark:text-neutral-500">
                  Interact with the chart to see events.
                </li>
              )}
              {log.map((l) => (
                <li
                  key={l.id}
                  className="rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"
                >
                  {l.label}
                </li>
              ))}
            </ul>
          </Control>
        </div>
      }
      preview={
        <div className="w-full">
          {/* When full height is on, this box is the bounded parent the
              Gantt fills — otherwise `h-full` has nothing to resolve
              against and only the min-height would show. */}
          <div className={fullHeight ? "h-[560px]" : undefined}>
          <Gantt
            tone={surfaceTone}
            tasks={tasks}
            links={links}
            lanes={LANES}
            rowOrder={rowOrder}
            color={accent}
            variant={variant}
            controlsVariant={controlsVariant === "auto" ? undefined : controlsVariant}
            controlsTone={controlsTone === "auto" ? undefined : controlsTone}
            fullHeight={fullHeight}
            fullWidth={fullWidth}
            columnEdges={columnEdges}
            corner={corner}
            padding={padding}
            snap={snap}
            editable={editable}
            showToday={showToday}
            resizableColumns={resizableCols}
            columnWidths={columnWidths}
            onColumnWidthChange={(widths) => {
              setColumnWidths(widths);
              pushLog("Columns resized");
            }}
            height={440}
            icon={
              showIcon ? (
                <Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              ) : undefined
            }
            subtitle={showTitle ? "VENDOR ONBOARDING · REQ-4128" : undefined}
            title={showTitle ? "Northwind Logistics GmbH" : undefined}
            actions={
              showPill ? (
                <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  LIVE · read-only view
                </div>
              ) : undefined
            }
            headerActions={
              <div className="flex items-center gap-1.5">
                {(["epic", "priority"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setGroupBy(k)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      groupBy === k
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    By {k}
                  </button>
                ))}
              </div>
            }
            headerActionsAlign={headerActionsAlign}
            onTasksChange={(next) => {
              setTasks(next);
              pushLog("Dates / progress edited");
            }}
            onLinksChange={(next) => {
              setLinks(next);
              pushLog(`Dependencies → ${next.length}`);
            }}
            onReorder={(order) => {
              setRowOrder(order);
              pushLog("Rows reordered");
            }}
            onSelect={(id) => pushLog(id ? `Selected “${id}”` : "Selection cleared")}
          />
          </div>
          <p className="px-1 pt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
            Hover a bar to reveal resize / progress / link handles · drag the right-edge handle to
            draw a dependency · drag the row grip to reorder · Ctrl/Cmd + scroll to pinch zoom ·
            click the chart, then use ↑/↓ · Home/End to walk rows and +/− to zoom.
          </p>
        </div>
      }
    />
  );
};
