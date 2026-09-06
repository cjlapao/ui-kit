import { ActivityFeed } from "@cjlapao/ui-kit";

/**
 * A narrow deploy feed — no filters, no header link, just events and a
 * tail: the leanest the component gets.
 */
export default function DeployStream() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <ActivityFeed
        title="Deploys"
        items={[
          { id: "a", title: "shipped v2.14.0 to production", timestamp: "now", tone: "green" },
          { id: "b", title: "canary promoted", timestamp: "4m", tone: "emerald" },
          { id: "c", title: "rollback armed on checkout-api", timestamp: "12m", tone: "amber" },
          { id: "d", title: "staging rebuilt", timestamp: "31m", tone: "blue" },
        ]}
      />
    </div>
  );
}
