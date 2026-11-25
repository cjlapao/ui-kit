import { useState } from "react";
import { Button, Pill, SidePanel } from "@cjlapao/ui-kit";

const FILTERS = ["all", "open", "done"] as const;
type Filter = (typeof FILTERS)[number];

const TASKS: { label: string; state: Exclude<Filter, "all"> }[] = [
  { label: "Wire the export endpoint", state: "open" },
  { label: "Review the resize-handle notes", state: "done" },
  { label: "Draft the release checklist", state: "open" },
  { label: "Triage the inbox", state: "done" },
  { label: "Book the venue", state: "open" },
  { label: "Retire the legacy flag", state: "open" },
  { label: "Sign off the audit", state: "done" },
];

/**
 * The two fixed regions around the scrolling body: `subHeader` is a strip
 * that belongs to the panel as a whole — filters here — and stays put while
 * the list scrolls under it. `headerPills` carries the status count and a
 * quick toggle, centred with the close button; `headerActions` stays free
 * for the panel's real buttons. The footer never scrolls either.
 */
export default function ActionsAndPills() {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const rows = TASKS.filter((t) => filter === "all" || t.state === filter);
  const openCount = TASKS.filter((t) => t.state === "open").length;

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
        <p className="font-medium">Project page</p>
        <p className="mt-1">The inspector overlays this — filters stay put while the list scrolls.</p>
        <Button className="mt-3" size="xs" variant="outline" color="blue" onClick={() => setOpen((v) => !v)}>
          {open ? "Close inspector" : "Open inspector"}
        </Button>
      </div>
      <SidePanel
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Tasks"
        subtitle="Sprint 24"
        width={300}
        headerPills={
          <>
            <Pill size="xs" tone="blue">
              {openCount} open
            </Pill>
            <Pill
              size="xs"
              tone="green"
              variant="outline"
              icon="Check"
              onClick={() => setFilter(filter === "done" ? "all" : "done")}
            >
              {filter === "done" ? "Showing done" : "Quick done"}
            </Pill>
          </>
        }
        subHeader={
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <Button
                key={f}
                size="xs"
                variant={filter === f ? "solid" : "ghost"}
                color="blue"
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button size="xs" variant="ghost" color="slate">
              Cancel
            </Button>
            <Button size="xs" variant="solid" color="blue">
              Save
            </Button>
          </div>
        }
      >
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {rows.map((t) => (
            <li key={t.label} className="flex items-center gap-2 px-4 py-2.5 text-sm">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  t.state === "done" ? "bg-green-500" : "bg-blue-500"
                }`}
              />
              <span className={t.state === "done" ? "text-neutral-400 line-through dark:text-neutral-500" : ""}>
                {t.label}
              </span>
            </li>
          ))}
        </ul>
      </SidePanel>
    </div>
  );
}
