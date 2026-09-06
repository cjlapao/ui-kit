import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ActivityFeedPlayground } from "./ActivityFeedPlayground";
import AuditLog from "./examples/AuditLog";
import auditLogCode from "./examples/AuditLog.tsx?raw";
import DeployStream from "./examples/DeployStream";
import deployStreamCode from "./examples/DeployStream.tsx?raw";

export const ActivityFeedPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Activity Feed"
      description="The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows are dense on purpose — feeds are skimmed, not read."
    />
    <ActivityFeedPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Audit Log" description="The full trail — filterable, counted, with a door to the long form." code={auditLogCode} filename="AuditLog.tsx"><AuditLog /></ExampleCard>
      <ExampleCard title="Deploy Stream" description="No filters, no link, just events and a tail — the leanest the component gets." code={deployStreamCode} filename="DeployStream.tsx"><DeployStream /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>title</code>, <code>items</code>{" "}
          (<code>{`{ id, title, description?, code?, actor?, timestamp, tone?, category?, count? }`}</code>),{" "}
          <code>filters</code> with <code>defaultFilter</code> /{" "}
          <code>onFilterChange</code> (the <code>filterChange</code> event in
          Vue), <code>tag</code>, <code>linkLabel</code> / <code>onLink</code>,{" "}
          <code>hasMore</code> / <code>onLoadMore</code> /{" "}
          <code>loadMoreLabel</code>, <code>loading</code> (the feed's own row
          rhythm in placeholder ink — filters and tail waiting quietly until
          the events land), <code>totalCount</code>,{" "}
          <code>ctaVariant</code> / <code>loadMoreVariant</code> /{" "}
          <code>filterVariant</code> — every control on the card follows the
          card's own variant by default (the filter track speaks the same
          surface vocabulary) unless told otherwise — and the usual card
          surface. The card's{" "}
          <code>tone</code> is not only the surface: untoned entries inherit
          it for their dots, and the filters, the link and the tail button all
          wear it, while a neutral card stays quiet. The All segment is
          implicit and always first; filters
          match <code>category</code> first and <code>tone</code> second, and{" "}
          <code>timestamp</code> is deliberately pre-formatted — feeds show
          what the server said, not what the clock is doing. An empty filter
          result is a state, not an error: the feed shows a quiet empty state.
        </p>
      </div>
    </section>
  </div>
);

export default ActivityFeedPage;
