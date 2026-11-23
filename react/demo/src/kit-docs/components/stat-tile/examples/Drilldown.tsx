import { useRef, useState } from "react";
import {
  Button,
  CustomIcon,
  Pill,
  StatCard,
  type StatCardDrilldownItem,
} from "@cjlapao/ui-kit";

/**
 * The drilldown: a tile whose number hides a whole paginated list. The tile
 * IS the trigger — click it (or Enter on the keyboard) and a solid-surface
 * dropdown opens, rows streaming in a page at a time as the scrollbar
 * reaches the bottom. Nothing is fetched until the first open, and the
 * chevron-free affordance stays the tile itself.
 *
 * `fetchItems` below is the contract an app implements: page in, items out,
 * plus `hasMore` and (optionally) a `total` for the header chip. It is given
 * an `AbortSignal` — honour it and stale responses never land.
 */

/* ------------------------------------------------------------------ */
/*  A fake paginated API: 41 alerts and 128 loops, 250–600 ms per page  */
/* ------------------------------------------------------------------ */

interface AlertItem extends StatCardDrilldownItem {
  age: string;
}

const ALERT_TITLES = [
  "Loop stuck in retry",
  "Escalated deploy gate",
  "Flaky assertion on nightly",
  "Quota alarm on inference",
  "Token budget exceeded",
  "Webhook backlog growing",
  "Stale cache after deploy",
  "Rate-limited upstream",
  "Retry storm in dispatcher",
  "Memory watermark breached",
];

const ALERT_POOL: AlertItem[] = Array.from({ length: 41 }, (_, i) => ({
  id: `alr-${i}`,
  title: ALERT_TITLES[i % ALERT_TITLES.length],
  subtitle: `capsule-${(i % 9) + 1} · queue ${String.fromCharCode(65 + (i % 4))}`,
  icon: (["Bug", "Warning", "Shield", "CloudOff"] as const)[i % 4],
  tone: (["rose", "amber", "violet", "blue"] as const)[i % 4],
  count: ((i * 7) % 23) + 1,
  age: `${((i * 13) % 58) + 2}m ago`,
}));

interface LoopItem extends StatCardDrilldownItem {
  duration: string;
}

const LOOP_POOL: LoopItem[] = Array.from({ length: 128 }, (_, i) => ({
  id: `lp-${i}`,
  title: `loop-${String(i).padStart(4, "0")}`,
  subtitle: (["nightly", "hourly", "on-change", "canary"] as const)[i % 4],
  duration: `${(i % 17) + 1}m ${String((i * 7) % 60).padStart(2, "0")}s`,
  count: ((i * 3) % 40) + 1,
}));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const paged = async <T extends StatCardDrilldownItem>(
  pool: T[],
  { page, pageSize }: { page: number; pageSize: number },
  flakyRef: { current: boolean },
  signal: AbortSignal | undefined,
  onOutageConsumed: () => void,
) => {
  await wait(250 + Math.random() * 350);
  // Stale requests (the tile closed or reloaded mid-flight) are abandoned —
  // and the armed outage stays armed for the request that actually counts.
  if (signal?.aborted) throw new Error("aborted");
  if (flakyRef.current) {
    flakyRef.current = false;
    onOutageConsumed();
    throw new Error("simulated outage");
  }
  const start = page * pageSize;
  return {
    items: pool.slice(start, start + pageSize),
    hasMore: start + pageSize < pool.length,
    total: pool.length,
  };
};

/* ------------------------------------------------------------------ */
/*  The demo                                                            */
/* ------------------------------------------------------------------ */

export default function Drilldown() {
  const [opened, setOpened] = useState<string | null>(null);
  const [flaky, setFlaky] = useState(false);
  const flakyRef = useRef(false);

  const armOutage = () => {
    flakyRef.current = true;
    setFlaky(true);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {/* The alert tile: rows are real buttons via `onItemClick`, the
            footer carries navigation, and each page reports its `total`. */}
        <StatCard
          label="Needs you"
          value={41}
          icon="Warning"
          tone="amber"
          variant="elevated"
          corner="rounded-lg"
          hoverEffect
          drilldown={{
            title: "Needs you — oldest first",
            pageSize: 8,
            fetchItems: ({ page, pageSize, signal }) =>
              paged(ALERT_POOL, { page, pageSize }, flakyRef, signal, () => setFlaky(false)),
            onItemClick: (item) =>
              setOpened(`${String(item.title)} · ${item.subtitle ?? ""}`),
            footer: (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Escalations auto-close after 24h
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  color="amber"
                  trailingIcon="ChevronRight"
                  onClick={() => setOpened("View all alerts")}
                >
                  View all
                </Button>
              </div>
            ),
          }}
        />

        {/* The loops tile: `renderItem` replaces the built-in row entirely —
            same pagination chrome, completely different row anatomy. */}
        <StatCard
          label="Loops at work"
          value={128}
          icon="Activity"
          tone="blue"
          variant="elevated"
          corner="rounded-lg"
          hoverEffect
          drilldown={{
            title: "Running loops",
            pageSize: 10,
            emptyMessage: "No loops are running right now",
            fetchItems: ({ page, pageSize, signal }) =>
              paged(LOOP_POOL, { page, pageSize }, flakyRef, signal, () => setFlaky(false)),
            renderItem: (item) => (
              <div className="flex w-full items-center gap-3 rounded-md px-3 py-2.5">
                <CustomIcon
                  icon="Rocket"
                  size="sm"
                  className="flex-none text-blue-500 dark:text-blue-400"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[13px] text-neutral-900 dark:text-white">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                    trigger · {String(item.subtitle ?? "—")}
                  </span>
                </span>
                <span className="flex-none font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                  {item.duration}
                </span>
                <Pill tone="blue" size="xs" variant="soft">
                  ×{String(item.count ?? 1)}
                </Pill>
              </div>
            ),
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
        <Button
          size="sm"
          variant={flaky ? "solid" : "outline"}
          color="rose"
          leadingIcon="CloudOff"
          onClick={armOutage}
        >
          {flaky ? "Next request will fail" : "Simulate an outage"}
        </Button>
        <span>
          {opened ? (
            <>
              Opened <strong className="text-neutral-700 dark:text-neutral-200">{opened}</strong>
            </>
          ) : (
            "Click a tile to open its list; keep scrolling to page in more. The outage button fails the next page once — the list shows its retry."
          )}
        </span>
      </div>
    </div>
  );
}
