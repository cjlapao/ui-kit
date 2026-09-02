import React, { useCallback, useMemo, useState } from "react";
import {
  Gantt,
  MultiToggle,
  Select,
  sampleGanttLanes,
  sampleGanttLinks,
  sampleGanttTasks,
} from "@cjlapao/ui-kit";
import type {
  GanttLane,
  GanttLink,
  GanttSnap,
  GanttTask,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

const SNAPS: GanttSnap[] = ["none", "hour", "day", "week"];

const ACCENTS: TrueColor[] = ["blue", "emerald", "violet", "amber", "rose", "cyan"];

const initialLanes: GanttLane[] = sampleGanttLanes;
const initialTasks: GanttTask[] = sampleGanttTasks();
const initialLinks: GanttLink[] = sampleGanttLinks();

interface LogEntry {
  id: number;
  label: string;
}

let logSeq = 0;

export const GanttDemo: React.FC = () => {
  const [lanes] = useState<GanttLane[]>(initialLanes);
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);
  const [links, setLinks] = useState<GanttLink[]>(initialLinks);
  const [rowOrder, setRowOrder] = useState<string[] | undefined>(undefined);
  const [color, setColor] = useState<TrueColor>("blue");
  const [snap, setSnap] = useState<GanttSnap>("day");
  const [log, setLog] = useState<LogEntry[]>([]);

  const pushLog = useCallback((label: string) => {
    logSeq += 1;
    const id = logSeq;
    setLog((prev) => [{ id, label }, ...prev].slice(0, 6));
  }, []);

  const onTasksChange = useCallback(
    (next: GanttTask[]) => {
      setTasks(next);
      pushLog("Dates / progress edited");
    },
    [pushLog],
  );
  const onLinksChange = useCallback(
    (next: GanttLink[]) => {
      setLinks(next);
      pushLog(`Dependencies → ${next.length}`);
    },
    [pushLog],
  );
  const onReorder = useCallback(
    (order: string[]) => {
      setRowOrder(order);
      pushLog("Rows reordered");
    },
    [pushLog],
  );
  const onSelect = useCallback(
    (id: string | null) => pushLog(id ? `Selected “${id}”` : "Selection cleared"),
    [pushLog],
  );

  const reset = () => {
    setTasks(initialTasks);
    setLinks(initialLinks);
    setRowOrder(undefined);
    setLog([]);
  };

  const stats = useMemo(() => {
    const milestones = tasks.filter((t) => t.type === "milestone").length;
    const groups = tasks.filter((t) => tasks.some((c) => c.parent === t.id)).length;
    return { tasks: tasks.length, links: links.length, milestones, groups };
  }, [tasks, links]);

  return (
    <PlaygroundSection
      title="Gantt Chart"
      label="Schedule, swimlanes, dependencies & drag-to-edit"
      description="A fully interactive, feature-rich Gantt. Drag bars to move, drag the edges to resize, drag the row grip to reorder, drag the right-edge handle to create a dependency, and drag the progress knob. Keyboard: arrows nudge dates, Shift+arrows resize, Delete removes a selected dependency."
      controls={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Accent
            </span>
            <MultiToggle
              options={trueColorOptions.filter((o) => ACCENTS.includes(o.value))}
              value={color}
              onChange={(v) => setColor(v as TrueColor)}
              size="sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Snap
            </span>
            <Select value={snap} onChange={(e) => setSnap(e.target.value as GanttSnap)}>
              {SNAPS.map((s) => (
                <option key={s} value={s}>
                  {s === "none" ? "Free (no snap)" : s}
                </option>
              ))}
            </Select>
          </div>
          <button
            type="button"
            onClick={reset}
            className="self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Reset sample data
          </button>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Live stats
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {stats.tasks} tasks · {stats.groups} groups · {stats.milestones} milestones ·{" "}
              {stats.links} dependencies
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Event log
            </span>
            {log.length === 0 ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Interact with the chart to see events.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {log.map((l) => (
                  <li
                    key={l.id}
                    className="rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"
                  >
                    {l.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      }
      preview={
        <div className="flex h-[520px] w-full flex-col gap-3">
          <Gantt
            tasks={tasks}
            links={links}
            lanes={lanes}
            rowOrder={rowOrder}
            color={color}
            snap={snap}
            onTasksChange={onTasksChange}
            onLinksChange={onLinksChange}
            onReorder={onReorder}
            onSelect={onSelect}
            height={430}
          />
          <p className="px-1 text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
            Tip: hover a bar to reveal resize / progress / link handles · use the floating
            toolbar (top-right) for Day/Week/Month/Quarter zoom · Ctrl/Cmd + scroll to pinch
            zoom at the cursor.
          </p>
        </div>
      }
    />
  );
};

