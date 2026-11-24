import {
  ActivityFeed,
  type ActivityFeedItem,
} from "@cjlapao/ui-kit";

/**
 * Some events have a story under them. `subItems` opens a row into a
 * disclosure — InfoRow's grid-rows animation, one level deep —
 * and each entry is either the feed's own row template or a custom `body`
 * node, sitting one indent in. A sub may carry its own `onClick`: the wash
 * turns into a real button and the click fires alone — it never folds the
 * parent nor reaches the row's action, while a sub without one still
 * reads as the row's own context.
 * Sub-row dots sit one step off the parent's
 * in both themes — darker on light, lighter on dark — each sub rests one
 * depth step off the surface it nestles in, the nested panels' own ladder,
 * so subs read as their own rows; and every sub-row washes under the
 * pointer, in its own tone or a `hoverTone` of its own; the custom sub
 * wears emerald to match its bar. The toggle is hybrid: the
 * deploy row has no `onClick` of its own, so the whole row is the control
 * and the chevron is decoration; the alert row keeps its action, so the
 * chevron becomes a separate button and the two never interfere.
 * `defaultExpanded` seeds the open row; the feed remembers the rest per
 * row id.
 */
export default function SubItems() {
  const items: ActivityFeedItem[] = [
    {
      id: "deploy",
      title: "deployed the release",
      actor: "CI",
      timestamp: "1h ago",
      tone: "blue",
      category: "deploys",
      code: "#412",
      count: 3,
      defaultExpanded: true,
      // No `onClick`: the row is the toggle, chevron and all.
      subItems: [
        {
          actor: "api",
          title: "rolled 4 pods",
          count: 4,
          code: "svc/api",
          timestamp: "59m ago",
        },
        {
          actor: "web",
          title: "rolled 3 pods",
          count: 3,
          code: "svc/web",
          timestamp: "58m ago",
          // Hover in a hue of its own; the row above washes in its own
          // tone by default, so only this one needs the field.
          hoverTone: "amber",
          // Its own `onClick`: the wash is a real button, and the click
          // fires alone — the row, which is the toggle here, stays open.
          onClick: () => {},
        },
        {
          // A sub-row may be any node — the indent column holds it the
          // same, so a custom sub sits in the same rhythm as the
          // template ones. The wash is the wrapper's, so even a custom
          // sub gets one: emerald, to match its bar.
          hoverTone: "emerald",
          body: (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="min-w-0 truncate text-sm font-medium">
                  <span className="font-semibold">cache </span>
                  warming up
                </span>
                <span className="ms-auto shrink-0 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
                  82%
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full w-4/5 rounded-full bg-emerald-500" />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "alerts",
      title: "flagged three slow queries",
      actor: "Watchdog",
      timestamp: "2h ago",
      tone: "rose",
      category: "alerts",
      // The row has its own action, so the chevron takes the disclosure
      // as a button of its own — clicking the row opens the report,
      // clicking the chevron opens the list.
      onClick: () => {},
      subItems: [
        {
          title: "GET /api/invoices",
          code: "p95 1.2s",
          timestamp: "2h ago",
          // A sub's own click stays separate from the row's: clicking this
          // opens the query, not the report the row's `onClick` opens.
          onClick: () => {},
        },
        { title: "POST /api/checkout", code: "p95 940ms", timestamp: "2h ago" },
        {
          title: "GET /api/search",
          description: "cross-region fan-out, eu-west → us-east",
          code: "p95 870ms",
          timestamp: "1h ago",
        },
      ],
    },
    {
      id: "plain",
      title: "merged the release branch",
      actor: "Grace",
      timestamp: "3h ago",
      tone: "green",
      category: "deploys",
      code: "#411",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
      <ActivityFeed
        title="Release night"
        items={items}
        filters={[
          { label: "Deploys", value: "deploys" },
          { label: "Alerts", value: "alerts" },
        ]}
      />
    </div>
  );
}
