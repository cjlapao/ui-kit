import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ActivityFeedPlayground } from "./ActivityFeedPlayground";
import AuditLog from "./examples/AuditLog";
import auditLogCode from "./examples/AuditLog.tsx?raw";
import DeployStream from "./examples/DeployStream";
import deployStreamCode from "./examples/DeployStream.tsx?raw";
import CustomRows from "./examples/CustomRows";
import customRowsCode from "./examples/CustomRows.tsx?raw";
import SubItems from "./examples/SubItems";
import subItemsCode from "./examples/SubItems.tsx?raw";

export const ActivityFeedPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Activity Feed"
      description="The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows fold open into one level of sub-items — InfoRow's own animation — when an event has a story under them. Rows are dense on purpose — feeds are skimmed, not read. `maxHeight` caps the body in a `ScrollArea`, so Load more grows the list while the card and the tail button stay put."
    />
    <ActivityFeedPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Audit Log" description="The full trail — filterable, counted, with a door to the long form." code={auditLogCode} filename="AuditLog.tsx"><AuditLog /></ExampleCard>
      <ExampleCard title="Deploy Stream" description="No filters, no link, just events and a tail — the leanest the component gets." code={deployStreamCode} filename="DeployStream.tsx"><DeployStream /></ExampleCard>
      <ExampleCard title="Custom Rows" description="An item's body replaces the row's whole content — the feed keeps drawing the row itself, so complex UI sits in the same rhythm as the default rows." code={customRowsCode} filename="CustomRows.tsx"><CustomRows /></ExampleCard>
      <ExampleCard title="Sub-items" description="Some events have a story under them: subItems opens a row into a disclosure — one level — each entry either the feed's own row template or a custom body. A sub may carry its own onClick: the hover wash becomes a real button and its click fires alone, folding nothing and never reaching the row's action, while a plain sub stays the row's context. Sub-row dots sit one step off the parent's in both themes, each sub rests on the nested panels' depth step so the rows read as unique, and every sub-row washes under the pointer in its own tone or a hoverTone of its own. The row itself is the toggle when it has no onClick; with one, the chevron becomes a separate button." code={subItemsCode} filename="SubItems.tsx"><SubItems /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>title</code>, <code>items</code>{" "}
          (<code>{`{ id, title, description?, code?, actor?, timestamp, tone?, category?, count?, body?, actions?, onClick?, active?, attention?, attentionTone?, hoverTone?, activeTone?, subItems?, defaultExpanded?, expanded? }`}</code>),{" "}
          where <code>body</code> — a node in React, a VNode in Vue — replaces
          the row's entire content (dot, text and timestamp all stop being
          drawn) while the feed keeps drawing the row itself — a{" "}
          <code>Panel</code> on surface <code>none</code> at the component's
          tone, <code>rounded</code> corner, <code>xs</code> padding — and an{" "}
          <code>onClick</code> hands that Panel its card-action API: the
          cursor, the toned hover wash, and (React) the button semantics,{" "}
          while <code>rowVariant</code> / <code>rowTone</code> /
          <code>rowCorner</code> set that row Panel's surface (default{" "}
          <code>"none"</code>, the card's own tone, and the corner scale's
          xs step, <code>"rounded"</code>) — while <code>rowHoverTone</code> and{" "}
          <code>rowActiveTone</code> split the two <em>states</em> off that
          surface, so a neutral feed can hover and select in colours of its
          own: <code>rowHoverTone</code> is the hue every row's wash,{" "}
          pressed step and sub-row wash wear, <code>rowActiveTone</code> the hue
          the chosen row's rim and fill wear (and the hue it hovers in — its
          neighbours keep hovering in their own), a row beating either with its
          own <code>hoverTone</code> / <code>activeTone</code> —{" "}
          <code>subRowCorner</code> and{" "}
          <code>subRowPadding</code> dial the sub-row washes, resting on the
          corner scale's sm step (<code>"rounded-sm"</code>) and the padding
          ladder's <code>"md"</code> rung, with bleed, row gap, the column's
          gutter, and clip room moving in lockstep — and the row's own{" "}
          <code>active</code> / <code>attention</code> hand it the Panel's{" "}
          <code>active</code> rim and <code>pulse</code> glow — with{" "}
          <code>attentionTone</code> the Panel's own hue override (the row{" "}
          <code>borderColor</code>: <code>borderColor ?? tone</code>, blue
          floor), shared by rim and glow so a selected-and-pulsing row always
          agrees, until the row is given a selection hue of its own — at which
          point the glow keeps the hue you named for urgency,{" "}
          <code>subItems</code> with <code>defaultExpanded</code> /{" "}
          <code>expanded</code> / <code>onToggle</code> (the{" "}
          <code>toggle(id, expanded)</code> event in Vue) — InfoRow's
          grid-rows disclosure, one level deep: each
          sub-item — <code>{`{ title?, description?, code?, actor?, timestamp?, tone?, hoverTone?, onClick?, count?, body?, actions? }`}</code> — is
          either the feed's own row template (dot, actor, title,
          description, code, time, count badge) or a custom{" "}
          <code>body</code> node, indented to the title's edge and never
          its own filter match; an <code>onClick</code> turns the wash into
          its own button — the click fires alone, never folding the parent
          nor reaching the row's action, while a sub without one stays the
          row's own context and its clicks keep bubbling to the parent
          card; its dot sits one step off the parent's in
          both themes — darker on light, lighter on dark — each sub rests
          one depth step off the surface it nestles in, the nested panels'
          own ladder, so subs read as their own rows — and the
          row washes under the pointer in its resolved tone, or a{" "}
          <code>hoverTone</code> of its own; <code>actions</code> paints a
          right-aligned zone — menus, icon buttons, anything — after the
          content and before the caret (after a sub-row's time), and its
          clicks and keys never activate the row or fold its disclosure —
          with no{" "}
          <code>onClick</code> the row
          itself is the toggle (chevron as decoration, the{" "}
          <code>aria-expanded</code> pair riding the row's Panel), with
          one the row's action stays untouched and the chevron becomes a
          real button; <code>defaultExpanded</code> seeds the
          uncontrolled open state, which the feed remembers per row id
          across filter switches, while <code>expanded</code> keeps a row
          controlled and clicks only report intent,{" "}
          <code>filters</code> with <code>defaultFilter</code> /{" "}
          <code>onFilterChange</code> (the <code>filterChange</code> event in
          Vue), <code>tag</code>, <code>linkLabel</code> / <code>onLink</code>,{" "}
          <code>hasMore</code> / <code>onLoadMore</code> /{" "}
          <code>loadMoreLabel</code>, <code>loading</code> (the feed's own row
          rhythm in placeholder ink — filters and tail waiting quietly until
          the events land), whose style <code>loaderType</code> picks —{" "}
          <code>skeleton</code> (the default) rewrites the body, while{" "}
          <code>spinner</code> / <code>progress</code> dim the real rows under
          a labelled Loader; either way the header tag, the count and the
          filters yield until the events land,{" "}
          <code>loaderProgress</code> filling the bar,{" "}
          <code>loadingMessage</code> labelling the overlay (defaults to
          "Loading") and{" "}
          <code>skeletonRows</code> pinning the placeholder count —{" "}
          <code>totalCount</code> with <code>countLabel</code> beside it (the
          header's noun is <code>"events"</code> — or <code>"event"</code> at
          one — unless a string names it verbatim, <code>""</code> leaves the
          number alone and <code>false</code> drops the count from the header
          entirely),{" "}
          <code>ctaVariant</code> / <code>loadMoreVariant</code> /{" "}
          <code>filterVariant</code> — every control on the card follows the
          card's own variant by default (the filter track speaks the same
          surface vocabulary) unless told otherwise — and the usual card
          surface, plus <code>raisedSurface</code>, which forces the first
          nested-panels depth step — the tinted-card-on-matching-background
          fix. The card's{" "}
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
