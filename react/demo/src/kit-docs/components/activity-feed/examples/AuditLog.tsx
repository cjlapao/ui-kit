import { ActivityFeed, type ActivityFeedItem } from "@cjlapao/ui-kit";

const items: ActivityFeedItem[] = [
  { id: "1", title: "rotated the signing keys", actor: "Ada", timestamp: "2m ago", tone: "amber", category: "security" },
  { id: "2", title: "closed as won", actor: "Sales Bot", timestamp: "18m ago", tone: "green", category: "crm", code: "DEAL-2211" },
  { id: "3", title: "deployed the release", actor: "CI", timestamp: "1h ago", tone: "blue", category: "deploys", code: "#412", count: 3 },
  { id: "4", title: "flagged a slow query", actor: "Watchdog", timestamp: "2h ago", tone: "rose", category: "alerts", description: "GET /api/invoices p95 crossed 1.2s on eu-west." },
  { id: "5", title: "invited two reviewers", actor: "Grace", timestamp: "3h ago", tone: "neutral", category: "crm" },
  { id: "6", title: "paused the nightly job", actor: "Ops", timestamp: "5h ago", tone: "slate", category: "deploys" },
];

const filters = [
  { label: "Deploys", value: "deploys" },
  { label: "CRM", value: "crm" },
  { label: "Security", value: "security" },
  { label: "Alerts", value: "alerts" },
];

/**
 * The full audit trail, one panel: toned dots say what kind of thing it
 * was, the segment control says which kind to look at, and the tail says
 * there is more below.
 */
export default function AuditLog() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <ActivityFeed
        title="Workspace activity"
        tag="last 24h"
        items={items}
        filters={filters}
        linkLabel="Full audit log"
        totalCount={98}
        hasMore
      />
    </div>
  );
}
