import {
  ActivityFeed,
  Button,
  Pill,
  type ActivityFeedItem,
} from "@cjlapao/ui-kit";

/**
 * Events the fixed row can't express. An item's `body` replaces the row's
 * entire content — dot, text and timestamp all stop being drawn and you
 * draw whatever the event deserves instead. The feed keeps drawing the
 * row itself: same padding, same dividers, and with `onClick` the same
 * clickable grammar — so custom rows sit in the feed's rhythm next to the
 * default ones instead of fighting it.
 */
export default function CustomRows() {
  const items: ActivityFeedItem[] = [
    {
      id: "sev",
      title: "checkout-api error rate spiked",
      timestamp: "2m ago",
      category: "incidents",
      body: (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Pill size="sm" tone="rose">
              SEV-2
            </Pill>
            <span className="min-w-0 truncate text-sm font-medium">
              checkout-api error rate spiked
            </span>
            <span className="ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
              2m ago
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            5xx ratio at 11.4% in eu-west — mitigation in progress.
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="h-full w-2/3 rounded-full bg-rose-500" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button size="xs" variant="outline" color="rose">
              Acknowledge
            </Button>
            <Button size="xs" variant="link">
              Open incident
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "pr",
      title: "requested your review",
      timestamp: "26m ago",
      category: "reviews",
      onClick: () => {},
      body: (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="min-w-0 truncate text-sm font-medium">
              <span className="font-semibold">Ada </span>
              requested your review
            </span>
            <code className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              #413
            </code>
            <span className="ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
              26m ago
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Pill size="sm" tone="emerald">
              +312
            </Pill>
            <Pill size="sm" tone="rose">
              −44
            </Pill>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              14 files · payments-service
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "plain",
      title: "merged the release branch",
      actor: "CI",
      timestamp: "1h ago",
      tone: "green",
      category: "incidents",
      code: "#412",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
      <ActivityFeed
        title="On-call"
        items={items}
        filters={[
          { label: "Incidents", value: "incidents" },
          { label: "Reviews", value: "reviews" },
        ]}
      />
    </div>
  );
}
