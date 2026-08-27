import { SplitView, Pill } from "@cjlapao/ui-kit";

const replicas = (names: string[]) => (
  <ul className="space-y-1 py-2 pl-9 pr-4">
    {names.map((name) => (
      <li key={name} className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300">
        <span className="truncate">{name}</span>
        <Pill size="sm" tone="emerald" variant="soft">ready</Pill>
      </li>
    ))}
  </ul>
);

const ITEMS = [
  { id: "a", label: "api-gateway", subtitle: "2 replicas", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Gateway detail</div>,
    subContent: replicas(["gateway-7f4c", "gateway-9d21"]) },
  { id: "b", label: "worker-pool", subtitle: "3 replicas", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Worker detail</div>,
    subContent: replicas(["worker-01", "worker-02", "worker-03"]) },
  { id: "c", label: "batch-runner", subtitle: "1 replica", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Batch detail</div>,
    highlight: true,
    subContent: replicas(["batch-nightly"]) },
];

/**
 * `subContent` puts a nested list under a row, so the row can expand in place
 * rather than only filling the detail pane.
 *
 * With `autoExpand` (the default) the active row's sub-items open as part of
 * selecting it. With `autoExpand={false}` a caret appears on rows that have
 * sub-items and selection and expansion become separate gestures — click to
 * look at the pane, click the caret to drill in.
 *
 * The third row also carries `highlight`, which tints it and adds a pulsing
 * dot. `showHighlightIndicator={false}` keeps the tint and drops the dot.
 */
export default function SubItems() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          autoExpand — selecting opens the sub-items
        </span>
        <div className="h-72 overflow-hidden rounded-lg">
          <SplitView items={ITEMS} listTitle="Capsules" tone="blue" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          autoExpand=false — a caret drills in, no dot
        </span>
        <div className="h-72 overflow-hidden rounded-lg">
          <SplitView
            items={ITEMS}
            listTitle="Capsules"
            tone="violet"
            autoExpand={false}
            showHighlightIndicator={false}
          />
        </div>
      </div>
    </div>
  );
}
