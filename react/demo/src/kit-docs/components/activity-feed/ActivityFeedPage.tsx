import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
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
      description="The audit log as a living feed: newest first, toned dots for what happened, a segment control for who or what kind, count badges for what aggregated, and a tail that says there is more. Rows fold open into one level of sub-items — InfoRow's own animation — when an event has a story under them. Rows are dense on purpose — feeds are skimmed, not read. `maxHeight` caps the body in a `ScrollArea`, so Load more grows the list while the card and the tail button stay put. `fullHeight` is the other direction: the card fills a parent that has a height, header and filters pinned and the rows scrolling inside."
    />
    <ActivityFeedPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Audit Log" description="The full trail — filterable, counted, with a door to the long form." code={auditLogCode} filename="AuditLog.tsx"><AuditLog /></ExampleCard>
      <ExampleCard title="Deploy Stream" description="No filters, no link, just events and a tail — the leanest the component gets." code={deployStreamCode} filename="DeployStream.tsx"><DeployStream /></ExampleCard>
      <ExampleCard title="Custom Rows" description="An item's body replaces the row's whole content — the feed keeps drawing the row itself, so complex UI sits in the same rhythm as the default rows." code={customRowsCode} filename="CustomRows.tsx"><CustomRows /></ExampleCard>
      <ExampleCard title="Sub-items" description="Some events have a story under them: subItems opens a row into a disclosure — one level — each entry either the feed's own row template or a custom body. A sub may carry its own onClick: the hover wash becomes a real button and its click fires alone, folding nothing and never reaching the row's action, while a plain sub stays the row's context. Sub-row dots sit one step off the parent's in both themes, each sub rests on the nested panels' depth step so the rows read as unique, and every sub-row washes under the pointer in its own tone or a hoverTone of its own. The row itself is the toggle when it has no onClick; with one, the chevron becomes a separate button." code={subItemsCode} filename="SubItems.tsx"><SubItems /></ExampleCard>
    </section>
    <PropsTable
      title="ActivityFeed"
      props={[
        {
          name: "items",
          type: "ActivityFeedItem[]",
          description:
            "The feed's data, newest first — the feed never sorts. Required, with `title`; everything else on the card is chrome.",
        },
        {
          name: "title",
          type: "string",
          default: '"Recent activity"',
          description:
            "The header's heading, with the tag pill, the count and the trailing link beside it.",
        },
        {
          name: "filters / defaultFilter / onFilterChange",
          type: "ActivityFeedFilter[] / string / (value) => void",
          default: '— / "all" / —',
          description:
            "A segment control for who or what kind — `{ label, value }` per segment, with the All segment implicit and always first. A filter matches an item's `category` first and its `tone` second, and never reaches into a sub-row. An empty result is a state, not an error: the feed draws a quiet empty state. Vue reports the same switch as the `filterChange` event.",
        },
        {
          name: "tag",
          type: "string",
          description:
            "A pill beside the title — a source name, a state. Part of the header, so it yields while `loading`.",
        },
        {
          name: "totalCount / countLabel",
          type: "number / string | false",
          description:
            "The header count. `totalCount` is the true total only the caller knows; `countLabel` is the noun after the number — `events`, or `event` at one, unless a string names it verbatim so `countLabel=\"deprecation\"` reads `1 deprecation`; `\"\"` leaves the bare number and `false` drops the count from the header entirely. The kit never pluralises your noun, and the `<n> of <totalCount>` form stays available while a filter is applied.",
        },
        {
          name: "linkLabel / onLink",
          type: "string / () => void",
          description:
            "The trailing header link — the door to the full log — and its handler.",
        },
        {
          name: "hasMore / onLoadMore / loadMoreLabel",
          type: "boolean / () => void | Promise<void> / string",
          default: '— / — / "Load more"',
          description:
            "The tail that says there is more, drawn only when both `hasMore` and `onLoadMore` are given. It is also where a `loadMode=\"scroll\"` feed falls back to when there is no scroller to watch.",
        },
        {
          name: "loadMode",
          type: '"scroll" | "button"',
          default: '"scroll"',
          description:
            "`scroll` is the kit's shared `useInfiniteScroll` watch: a sentinel at the feed's end observed with a `rootMargin` lookahead, so the next page is in flight while this one is being read, and it keeps filling until the viewport is full. It needs a scroller of its own — `maxHeight`, or `fullHeight` without one — and degrades to the button without either. `button` is the explicit tail.",
        },
        {
          name: "rootMargin / minItems / scrollResetKey / onError",
          type: "number / number / string | number / (error) => void",
          default: "320 / 0 / — / —",
          description:
            "The scroll watch's dials: how far below the fold the sentinel is watched, how many rows a short page must reach before the watch stops, the key to change when the dataset is replaced wholesale (a refetch), and the callback when a fetch rejects — the inline retry state comes with it.",
        },
        {
          name: "maxHeight",
          type: "number | string",
          description:
            "Caps the feed's body in a `ScrollArea` and lets it scroll — a px number or any CSS length. The rows, and the loading skeleton, scroll inside the card with a right gutter when the bar appears, while the header, the filters and the Load-more stay pinned outside. Unset, the feed grows to whatever its rows demand.",
        },
        {
          name: "fullHeight",
          type: "boolean",
          default: "false",
          description:
            "The other direction: the card fills a parent that already has a height — the `Table`'s contract, taken whole. The header, tag, filters and Load-more keep their size at the edges, the rows take the rest and scroll inside it, and scroll-mode paging counts that filled body as its viewport — so an infinite feed fills a bounded cell without a cap and without a button. `maxHeight` still wins the body when both are given: the card stretches, the cap holds inside it. The parent has to be able to shrink (`min-height: 0` in a flex or grid column); with no defined height to fill, the card stays content-sized, exactly as it is without the prop.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Draws the feed's own shape in placeholder ink while the events are in flight — same row rhythm, nothing jumps when they land. The header tag, the count and the filters hold their places until then.",
        },
        {
          name: "loaderType / loaderProgress / loadingMessage / skeletonRows",
          type: "ActivityFeedLoaderType / number / string / number",
          default: '"skeleton" / — / "Loading" / the pending page',
          description:
            "`spinner` and `progress` dim the real rows under a labelled Loader pinned beside the body — a sibling of the scroller, so it stays put while the rows move beneath it — with `loaderProgress` filling the bar (0–100) and `loadingMessage` publishing the overlay. `skeleton` rewrites the body with placeholders shaped like the feed's own rows, `skeletonRows` of them; unset follows the pending page, `min(max(items.length, 3), 6)`.",
        },
        {
          name: "variant / tone / padding / corner",
          type: "SurfaceVariant / SurfaceTone / SurfacePadding / SurfaceCorner",
          default: '"outlined" / "neutral" / "md" / —',
          description:
            "The card's surface, as every card in the kit takes it. `tone` is more than the surface: untoned entries inherit it for their dots, and the filters, the link and the tail button all wear it — while a neutral card stays quiet.",
        },
        {
          name: "rowVariant / rowTone / rowCorner",
          type: "SurfaceVariant / SurfaceTone / SurfaceCorner",
          default: '"none" / the card&rsquo;s tone / "rounded"',
          description:
            "The surface every template row's Panel wears — the card's hue by default, so a toned card hovers in its own tone, and the corner scale's xs step.",
        },
        {
          name: "subRowCorner / subRowPadding",
          type: "SurfaceCorner / SurfacePadding",
          default: '"rounded-sm" / "md"',
          description:
            "The sub-row washes, resting one step up from the rows on the same corner and padding scales; the bleed, the row gap, the column's gutter and the clip room all move in lockstep with it.",
        },
        {
          name: "rowHoverTone / rowActiveTone",
          type: "TrueColor / TrueColor",
          description:
            "The two *states* split off the row's surface: the hue every row's hover wash, pressed step and sub-row wash wears, and the hue the chosen row's 2px rim and tinted fill wear — a row beating either with its own `hoverTone` / `activeTone`. So a neutral feed can hover and select in colours of its own; naming a hue never paints the whole feed in the colour of a state one row holds.",
        },
        {
          name: "controlsTone / ctaVariant / loadMoreVariant / filterVariant / filterTone",
          type: "TrueColor / ButtonVariant / ButtonVariant / SurfaceVariant / TrueColor",
          default: "all follow the card",
          description:
            "Every control follows the card's own variant by default — the filter track speaks the same surface vocabulary, so it reads as a slice of the card. `controlsTone` picks the hue for the track, the tag, the CTA and the tail at once (`neutral` for a deliberately grey set the fallback cannot reach); `filterTone` names the track alone, falling back to `controlsTone` and then to the card's accent.",
        },
        {
          name: "raisedSurface",
          type: "boolean",
          default: "false",
          description:
            "Forces the card's first nested-panels depth step — the tinted-card-on-matching-background fix, straight from Panel.",
        },
      ]}
    />
    <PropsTable
      title="ActivityFeedItem"
      props={[
        {
          name: "id / title / timestamp",
          type: "string",
          description:
            "`id` keys the feed's open-set and every memo beside it; `title` is what happened, in one line; `timestamp` is deliberately pre-formatted (\"3m ago\", \"09:12\") — feeds show what the server said, not what the clock is doing.",
        },
        {
          name: "description / code / actor",
          type: "string",
          description:
            "Supporting copy, a monospaced reference (a PR number, a ticket id) and who did it.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"neutral"',
          description:
            "The status dot's tone; unset inherits the card's `tone`, so a toned card dots in its own hue.",
        },
        {
          name: "category",
          type: "string",
          description:
            "The group a filter matches — first, before `tone`. Sub-items never match a filter: filtering belongs to the row they sit under.",
        },
        {
          name: "count",
          type: "number",
          description:
            "Entries this one aggregates, drawn as a ×n pill beside the title.",
        },
        {
          name: "onClick",
          type: "() => void",
          description:
            "Makes the row clickable — and it is the Panel's card-action API doing it, not copied row classes: the pointer cursor, the toned hover wash, the focus ring, `role=\"button\"`, `tabIndex` and Enter/Space.",
        },
        {
          name: "active / activeTone",
          type: "boolean / TrueColor",
          default: "false / —",
          description:
            "Marks the current row: Panel's `active` — a 2px inset rim in the row's hue plus a light tone-tinted fill, layered under the hover wash rather than replacing it. `activeTone` names that hue for this row.",
        },
        {
          name: "attention / attentionTone",
          type: "boolean / TrueColor",
          default: "false / —",
          description:
            "Panel's `pulse`: a glow swelling inward from the row's own rim, following the corner radius and spilling into no layout. Unset, the glow wears the hue the selection rim would wear, so an active-and-pulsing row says both things in one colour; it stops sharing only when the row was given a selection hue of its own — demand and selection are two messages, and a caller who named both meant it.",
        },
        {
          name: "hoverTone",
          type: "TrueColor",
          description:
            "This row's own answer to being approached, whatever surface it rests on — beats the feed's `rowHoverTone`, and never the dot, which is `tone`'s.",
        },
        {
          name: "body",
          type: "ReactNode",
          description:
            "Replaces the row's entire content — dot, actor, title, description, code and timestamp all stop being drawn — while the feed keeps drawing the row itself, the same Panel at the same inset, so complex UI sits in the same rhythm as the default rows.",
        },
        {
          name: "actions",
          type: "ReactNode",
          description:
            "A right-aligned zone after the content (custom `body` included) and before the disclosure chevron — menus, icon buttons, anything. Clicks and keys inside it never activate the row or fold its disclosure: the feed swallows them at the zone's edge, so a menu trigger opens its menu and nothing else.",
        },
        {
          name: "subItems / defaultExpanded / expanded / onToggle",
          type:
            "ActivityFeedSubItem[] / boolean / boolean / (expanded) => void",
          default: "— / false / — / —",
          description:
            "One level of story under an event, on InfoRow's grid-rows disclosure — the disclosure and its chevron exist iff `subItems` is non-empty. `defaultExpanded` seeds the uncontrolled open state, which the feed remembers per `id` across filter switches (a row appended by Load more still honours it); `expanded` keeps a row controlled, so clicks only report intent through `onToggle`. Vue reports the same intent as the `toggle(id, expanded)` event.",
        },
      ]}
    />
    <PropsTable
      title="ActivityFeedSubItem"
      props={[
        {
          name: "title / description / code / actor / timestamp",
          type: "string",
          description:
            "The standard sub-row's fields — all optional here, where the main row needs a title and a time: a sub-line is context, not necessarily a clock.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: "the parent&rsquo;s tone",
          description:
            "Unset follows the parent item's `tone`, then the card's accent — and wherever the hue comes from, a sub-row's dot sits one step off the parent's in both themes, darker on light and lighter on dark, so nesting reads even when the tone is inherited.",
        },
        {
          name: "hoverTone",
          type: "TrueColor",
          description:
            "The hue the sub-row washes in under the pointer, with a dot lifted to full strength. The chain runs the sub's own, then the parent row's `hoverTone`, then the feed's `rowHoverTone`, then the hue the dot resolves to.",
        },
        {
          name: "onClick",
          type: "() => void",
          description:
            "The sub-row's own activation, firing alone: it never folds the parent's disclosure and never fires the parent row's `onClick`. Without one the sub-row stays a read-only context row and its clicks bubble on to the parent card.",
        },
        {
          name: "count / body / actions",
          type: "number / ReactNode / ReactNode",
          description:
            "The same ×n pill grammar, the same `body` escape hatch one level in (rendered at the title's edge, never its own filter match), and the same right-side zone — whose clicks and keys never reach the row's toggle or action.",
        },
      ]}
    />
  </div>
);

export default ActivityFeedPage;
