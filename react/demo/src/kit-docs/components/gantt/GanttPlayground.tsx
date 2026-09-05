import React, { useState } from "react";
import {
  Gantt,
  Rocket,
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
  { label: "Elevated", value: "elevated" },
  { label: "Outlined", value: "outlined" },
  { label: "Subtle", value: "subtle" },
  { label: "Tonal", value: "tonal" },
  { label: "Default (glassy)", value: "default" },
  { label: "Glass", value: "glass" },
  { label: "Liquid glass", value: "liquid-glass" },
  { label: "Simple", value: "simple" },
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
const LANES: GanttLane[] = sampleGantt.lanes;
const INITIAL_TASKS = sampleGantt.tasks();
const INITIAL_LINKS = sampleGantt.links();

export const GanttPlayground: React.FC = () => {
  const [tasks, setTasks] = useState<GanttTask[]>(INITIAL_TASKS);
  const [links, setLinks] = useState<GanttLink[]>(INITIAL_LINKS);
  const [rowOrder, setRowOrder] = useState<string[] | undefined>(undefined);
  const [accent, setAccent] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<GanttVariant>("elevated");
  const [corner, setCorner] = useState<GanttCorner>("rounded-sm");
  const [padding, setPadding] = useState<GanttPadding>("none");
  const [snap, setSnap] = useState<GanttSnap>("day");
  const [editable, setEditable] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [resizableCols, setResizableCols] = useState(true);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
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
    setCorner("rounded-sm");
    setPadding("none");
    setColumnWidths({});
    setLog([]);
  };

  return (
    <PlaygroundPanel
      controls={
        <div className="flex flex-col gap-4">
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
              label="Resizable columns (drag a header edge)"
              checked={resizableCols}
              onChange={setResizableCols}
            />
          </div>
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
          <Gantt
            tasks={tasks}
            links={links}
            lanes={LANES}
            rowOrder={rowOrder}
            color={accent}
            variant={variant}
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
            icon={<Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            subtitle="VENDOR ONBOARDING · REQ-4128"
            title="Northwind Logistics GmbH"
            actions={
              <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                LIVE · read-only view
              </div>
            }
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
          <p className="px-1 pt-2 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
            Hover a bar to reveal resize / progress / link handles · drag the right-edge handle to
            draw a dependency · drag the row grip to reorder · Ctrl/Cmd + scroll to pinch zoom.
          </p>
        </div>
      }
    />
  );
};
