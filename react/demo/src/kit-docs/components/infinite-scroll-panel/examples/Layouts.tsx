import { InfiniteScrollPanel } from "@cjlapao/ui-kit";
import type { InfiniteScrollLayout } from "@cjlapao/ui-kit";

const ITEMS = Array.from({ length: 12 }, (_, index) => index);

const LAYOUTS: InfiniteScrollLayout[] = [
  "masonry",
  "grid",
  "columns",
  "list",
];

const LABELS: Record<InfiniteScrollLayout, string> = {
  masonry: "Masonry",
  grid: "Grid — reads left to right",
  columns: "Columns — reads down each column",
  list: "List",
};

export default function Layouts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {LAYOUTS.map((layout) => (
        <div key={layout}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            {LABELS[layout]}
          </p>
          <InfiniteScrollPanel<number>
            items={ITEMS}
            hasMore={false}
            onLoadMore={async () => {}}
            variant="outlined"
            layout={layout}
            maxColumns={3}
            minColumnWidth={80}
            height={260}
            endMessage="End of list"
            getItemKey={(item) => item}
            renderItem={(item) => (
              <div
                className="w-full rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900/60"
                style={
                  layout === "masonry" ? { height: `${64 + (item % 4) * 28}px` } : undefined
                }
              >
                {item + 1}
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
}
