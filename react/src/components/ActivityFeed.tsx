import { getSurfaceAccentColor, getSurfaceTriggerTokens } from "../theme/Theme";
import type { SurfaceTone } from "../theme/Theme";
import { useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import Button, { type ButtonVariant } from "./Button";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import MultiToggle from "./MultiToggle";
import Panel, { SkeletonBar } from "./Panel";
import Pill from "./Pill";
import ScrollArea from "./ScrollArea";
import Spinner from "./Spinner";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useKitT } from "../i18n";
import {
  getTrueColorDotClass,
  getTrueColorSubDotClass,
  getSubItemHoverClasses,
  getSurfaceCornerClass,
  SURFACE_TO_BUTTON_VARIANT,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme";
import { NESTED_PANEL_WASH, SUB_ROW_PADDING } from "../../../common/theme/nestedPanel";

/** One entry in the feed. */
export interface ActivityFeedItem {
  id: string;
  /** What happened, in one line. */
  title: string;
  /** Supporting copy. */
  description?: string;
  /** A monospaced reference — a PR number, a ticket id. */
  code?: string;
  /** Who did it. */
  actor?: string;
  /** Pre-formatted ("3m ago", "09:12") — feeds rarely want live clocks. */
  timestamp: string;
  /** Status dot tone. @default "neutral" */
  tone?: TrueColor;
  /** Group this entry belongs to. Filters match it (falling back to `tone`). */
  category?: string;
  /** Entries this one aggregates — rendered as a count badge. */
  count?: number;
  /**
   * Makes the row clickable. The row is a Panel, and this becomes its card
   * action: pointer cursor, toned hover wash, focus ring, `role="button"`,
   * tabIndex and Enter/Space — the Panel API, not copied row classes.
   */
  onClick?: () => void;
  /**
   * Marks the row as the current one. The row's Panel takes the Panel API's
   * `active`: a 2px inset rim in the row's hue plus a light tone-tinted
   * fill, layered under the hover wash rather than replacing it.
   */
  active?: boolean;
  /**
   * Asks for the reader's attention. The row's Panel takes the Panel API's
   * `pulse`: a glow swelling inward from the row's own rim in the same hue
   * the selection rim would wear, following the corner radius and spilling
   * into no layout.
   */
  attention?: boolean;
  /**
   * Overrides the hue that attention wears — the Panel's own override,
   * handed to the row Panel's `borderColor`: `borderColor ?? tone` with the
   * kit's blue as floor, and the selection rim shares the hue, so an active
   * and pulsing row always agrees. Unset follows the row's tone. On bordered
   * row variants the hairline follows the override too, as it does on any
   * Panel given a `borderColor`.
   */
  attentionTone?: TrueColor;
  /**
   * Replaces the row's entire content. Set and the dot, actor, title,
   * description, code and timestamp all stop being drawn — the node you
   * give is rendered inside the row instead, for complex UI the fixed
   * layout can't express. The row itself stays the kit's: the same Panel,
   * so the same `xs` inset, dividers and — with `onClick` — hover, focus
   * and click behaviour. `undefined` or `null` draws the default row.
   */
  body?: ReactNode;
  /**
   * The row's extra right-side zone — menus, icon buttons, anything.
   * Rendered after the content (custom `body` included) and before the
   * disclosure chevron. Clicks and keys inside the zone never activate the
   * row or fold its disclosure: the feed swallows them at the zone's edge,
   * so a menu trigger opens its menu and nothing else. Drawn only when set.
   */
  actions?: ReactNode;
  /**
   * Rows nested under this one, revealed by the row's disclosure. The
   * disclosure — and its chevron — exists iff this is non-empty. Sub-items
   * are read-only context rows: they never filter (filters match this row),
   * never carry the row's own `onClick`/`active`/`attention`, and never
   * nest further — the `body` escape hatch is how a sub-row gets interactive.
   */
  subItems?: ActivityFeedSubItem[];
  /**
   * Initial open state for uncontrolled use. The feed keys its open-set by
   * `id`, so this seeds a row only while its id is absent from the set —
   * a row appended by Load more still honours it.
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * Controlled open state, InfoRow's `expanded` carried on the data item —
   * feed rows are data, not components. Pair with `onToggle`; while this is
   * a boolean the feed's internal open-set never speaks for the row.
   */
  expanded?: boolean;
  /** Called with the next open state whenever the row's disclosure toggles. */
  onToggle?: (expanded: boolean) => void;
}

/**
 * One row nested under an item, revealed by the row's disclosure — either
 * the kit's standard sub-row (dot + actor/title + description + code chip +
 * timestamp, the feed's own row grammar indented to the title's edge) or a
 * custom `body`, the same "type one or the custom one" split top-level rows
 * have. A sub-row's `body` replaces the standard fields entirely, keeping
 * the indent — the escape hatch for anything interactive, since sub-rows
 * carry no `onClick` of their own.
 */
export interface ActivityFeedSubItem {
  /** What happened, in one line — the standard sub-row's title. */
  title?: string;
  /** Supporting copy. */
  description?: string;
  /** A monospaced reference — the same chip the main row draws. */
  code?: string;
  /** Who did it. */
  actor?: string;
  /**
   * Pre-formatted ("3m ago", "09:12"); optional here where the main row
   * always has one — a sub-line is context, not necessarily a clock.
   */
  timestamp?: string;
  /**
   * Status dot tone. Unset follows the parent item's `tone`, then the
   * card's accent — the same ladder the dots always climbed. Wherever the
   * tone comes from, a sub-row's dot sits one step off the parent's in both
   * themes — darker on light, lighter on dark (`TRUE_COLOR_SUB_DOT_CLASSES`)
   * — so nesting reads even when the tone is inherited.
   */
  tone?: TrueColor;
  /**
   * The hue the sub-row wears under the pointer: a toned row wash and a dot
   * lifted to full strength. Unset inherits the tone the dot resolves to, so
   * every template sub-row is hoverable in its own colour by default.
   */
  hoverTone?: TrueColor;
  /** Entries this sub-row aggregates — the same ×n pill grammar as the main row. */
  count?: number;
  /**
   * Replaces the sub-row's entire content — the top-level `body` one level
   * in. Set and the fields above stop being drawn; the node renders inside
   * the region at the title's edge. `undefined` or `null` draws the standard
   * sub-row.
   */
  body?: ReactNode;
  /**
   * The sub-row's extra right-side zone — the row's `actions` one level in.
   * Rendered after the content (custom `body` included), at the sub-row's
   * right edge; clicks and keys inside never reach the row's toggle or
   * action. Drawn only when set.
   */
  actions?: ReactNode;
}

/** A feed filter; the value `"all"` always matches. */
export interface ActivityFeedFilter {
  label: string;
  value: string;
}

/**
 * The three loading styles a feed can show, matching Table and Panel.
 * `"spinner"` and `"progress"` draw a Loader overlay pinned to the feed
 * body; `"skeleton"` replaces the body with pulsing placeholders.
 */
export type ActivityFeedLoaderType = "spinner" | "progress" | "skeleton";

export interface ActivityFeedProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  /** @default "Recent activity" */
  title?: string;
  items: ActivityFeedItem[];
  /** Filter segment control; an "All" segment is prepended for you. */
  filters?: ActivityFeedFilter[];
  /** @default "all" */
  defaultFilter?: string;
  onFilterChange?: (value: string) => void;
  /** A pill beside the title (a source name, a state). */
  tag?: string;
  /** Trailing header link (to the full log). */
  linkLabel?: string;
  onLink?: () => void;
  /**
   * The link's button variant. Follows the card's own `variant` by default —
   * an outlined card offers an outlined button.
   * @default SURFACE_TO_BUTTON_VARIANT[variant]
   */
  ctaVariant?: ButtonVariant;
  /**
   * The Load-more button variant. Follows the card's own `variant` by default.
   * @default SURFACE_TO_BUTTON_VARIANT[variant]
   */
  loadMoreVariant?: ButtonVariant;
  /**
   * The filter's track variant — the same surface vocabulary the card wears.
   * Follows the card's own `variant`, so the track reads as a slice of the card.
   * @default variant
   */
  filterVariant?: SurfaceVariant;
  /**
   * The tone the filter track and selected segment wear. Falls back to
   * `controlsTone`, then to the card's accent — name it only when the filter
   * should carry a different tone than the buttons and pill around it.
   */
  filterTone?: TrueColor;
  /** Tail button; rendered only when both are provided. */
  onLoadMore?: () => void | Promise<void>;
  hasMore?: boolean;
  /**
   * How the next page is requested.
   *
   * `"scroll"` (default) is infinite — the kit's shared `useInfiniteScroll`
   * watch: a sentinel at the feed's end is observed inside the capped
   * `ScrollArea` with a `rootMargin` lookahead, so the next page is already
   * in flight while the current one is being read, and it keeps filling
   * until the viewport is full. It needs `maxHeight` — an uncapped feed has
   * no scroller to watch, and degrades to the button. `"button"` is the
   * explicit Load-more tail.
   * @default "scroll"
   */
  loadMode?: "scroll" | "button";
  /** How far below the fold the sentinel is watched, in px. @default 320 */
  rootMargin?: number;
  /**
   * Keep fetching until at least this many rows are loaded, so a short page
   * still fills the capped body. @default 0
   */
  minItems?: number;
  /** Change when the underlying dataset is replaced wholesale (a refetch). */
  scrollResetKey?: string | number;
  /** Fires when a page fetch rejects, alongside the inline retry state. */
  onError?: (error: unknown) => void;
  /**
   * The tone the controls wear — filter track, tag pill, CTA and Load-more.
   * By default they follow the card's own accent, and an untoned card leaves
   * them at each control's default (blue); name a tone here to pick,
   * including `neutral` for a deliberately grey control set the fallback
   * alone cannot reach.
   */
  controlsTone?: TrueColor;
  /**
   * Draws the feed's own shape in placeholder ink while the events are in
   * flight — same row rhythm, nothing jumps when they land. The style is
   * `loaderType`'s call.
   * @default false
   */
  loading?: boolean;
  /**
   * Style of the loading indicator, matching Table and Panel:
   * - `"spinner"` / `"progress"` — a Loader overlay pinned to the feed
   *   body: the rows (or the empty state) stay beneath it while the
   *   header, tag and filters hold their places, so nothing jumps when
   *   the events land.
   * - `"skeleton"` — the body is replaced by pulsing placeholders shaped
   *   like the feed's own rows.
   * @default "skeleton"
   */
  loaderType?: ActivityFeedLoaderType;
  /** The bar fill for `loaderType="progress"`, 0–100. */
  loaderProgress?: number;
  /** The label the spinner/progress overlay publishes. */
  loadingMessage?: string;
  /**
   * Placeholder rows drawn by `loaderType="skeleton"`. Unset follows the
   * pending page — `min(max(items.length, 3), 6)`.
   */
  skeletonRows?: number;
  /** @default "Load more" */
  loadMoreLabel?: string;
  /** Shown in the header when the caller knows the true total. */
  totalCount?: number;
  /**
   * The word that follows the header count. Unset, the count reads
   * `<n> events` — or `<n> of <totalCount> events` while a filter is
   * applied — with the noun singular at one. A string substitutes the noun
   * verbatim, so `countLabel="deprecation"` reads `1 deprecation` and
   * `countLabel="deployments"` reads `9 deployments`; the kit never
   * pluralises your noun, and the `<n> of <total>` form stays available.
   * Pass `""` for the number alone, or `false` to drop the count from the
   * header entirely — the title, tag and link then stand alone.
   */
  countLabel?: string | false;
  /**
   * Caps the feed's body and lets it scroll — a px number or any CSS
   * length. Unset, the feed grows to its full height exactly as before; set,
   * the rows (and the loading skeleton) scroll inside the card, with a right
   * gutter appearing when the bar does, while the header, filters and
   * Load-more stay pinned outside.
   */
  maxHeight?: number | string;
  /** Surface, as every card in the kit takes it. @default "outlined" */
  variant?: SurfaceVariant;
  /** @default "neutral" */
  tone?: SurfaceTone;
  /** @default "md" */
  padding?: SurfacePadding;
  corner?: SurfaceCorner;
  /**
   * The surface every template row's Panel wears. @default "none"
   */
  rowVariant?: SurfaceVariant;
  /**
   * The tone every template row's Panel wears. Unset follows the feed's
   * own `tone`, so rows wear the card's hue (and its toned hover wash).
   */
  rowTone?: SurfaceTone;
  /**
   * The corner every template row's Panel wears.
   * @default "rounded" — the corner scale's xs step
   */
  rowCorner?: SurfaceCorner;
  /**
   * The corner every sub-row wash wears, through the same corner scale as
   * `rowCorner` — rows rest on its xs step, washes one step up on sm.
   * @default "rounded-sm" — the corner scale's sm step
   */
  subRowCorner?: SurfaceCorner;
  /**
   * The padding ladder every sub-row wash rides — bleed, row gap, and the
   * column's gutter and clip-room padding move in lockstep (see
   * `SUB_ROW_PADDING`).
   * @default "md"
   */
  subRowPadding?: SurfacePadding;
  /** Forwarded to the body Panel — forces at least the first nested-panels depth step so a tinted card stays visible on a matching background. See Panel's `raisedSurface`. @default false */
  raisedSurface?: boolean;
}

/** The fields the standard row template draws, shared by rows and sub-rows. */
interface EntryFields {
  title?: string;
  description?: string;
  code?: string;
  actor?: string;
  timestamp?: string;
  count?: number;
}

/**
 * The standard row content, shared verbatim by the feed's rows and its
 * sub-rows — dot, actor/title, count pill, description, code chip, time.
 * `dotClass` arrives resolved because the ladder differs per level: rows
 * climb `item.tone` then the card's accent, sub-rows climb `sub.tone`, the
 * parent's `tone`, then the card. The `<time>` draws only when there is a
 * timestamp — a sub-line is context, not necessarily a clock.
 */
const entryContent = (entry: EntryFields, dotClass: string) => (
  <>
    <span
      className={classNames(dotClass, "mt-1.5 size-2 shrink-0 rounded-full")}
      aria-hidden="true"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="min-w-0 truncate text-sm font-medium">
          {entry.actor && <span className="font-semibold">{entry.actor} </span>}
          {entry.title}
        </span>
        {entry.count !== undefined && entry.count > 1 && (
          <Pill size="sm" tone="neutral">
            ×{entry.count}
          </Pill>
        )}
      </div>
      {entry.description && (
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {entry.description}
        </p>
      )}
      {entry.code && (
        <code className="mt-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {entry.code}
        </code>
      )}
    </div>
    {entry.timestamp && (
      <time className="shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
        {entry.timestamp}
      </time>
    )}
  </>
);

/**
 * InfoRow's disclosure chevron, one step from rotating: muted, and never
 * its own story. The `h-5` band is the title's own line box — the caret
 * centers on the first line, as the time and the actions zone do.
 */
const CHEVRON_BASE =
  "flex h-5 shrink-0 items-center text-neutral-400 transition-transform duration-300 dark:text-neutral-500";

/**
 * The extra right-side zone's containment. The kit swallows click and
 * keydown here so a menu trigger never fires the row's action or folds its
 * disclosure — the Vue Panel guards nothing and React's guard covers only
 * the card action's clicks, so the wrapper is what makes both kits agree.
 * Menu popups portal out of the row, so opening them is unaffected. The
 * `h-5 items-center` grammar centers its controls on the title's first
 * line — controls taller than the band (an `xs` IconButton is a 28px box)
 * spill evenly, so their optical centers ride the same line as the time
 * and the caret.
 */
const ACTIONS_WRAPPER = "flex h-5 shrink-0 items-center gap-1";
const ZONE_SWALLOW = {
  onClick: (event: React.MouseEvent) => event.stopPropagation(),
  onKeyDown: (event: React.KeyboardEvent) => event.stopPropagation(),
};
const actionsZone = (actions: React.ReactNode) => (
  <div className={ACTIONS_WRAPPER} {...ZONE_SWALLOW}>
    {actions}
  </div>
);

/**
 * One row: the feed's Panel, its content (template or `body`) and — when the
 * item carries `subItems` — the disclosure. The toggle is hybrid, and both
 * of its modes ride the Panel API rather than hand-rolled button semantics:
 *
 * - **No `onClick`**: the toggle goes to the row Panel as its card action,
 *   so the cursor, toned wash, focus ring, Enter/Space and the descendant
 *   guard are all the Panel's; the chevron is an `aria-hidden` span and the
 *   row carries `aria-expanded`/`aria-controls`.
 * - **With `onClick`**: the row keeps its action untouched and the chevron
 *   is the toggle — a real button, natively keyboard-operable, stopping its
 *   own click so the row action stays a stranger to it.
 *
 * Inside the region, clicks never fold the row: while the row is the toggle
 * the grid wrapper stops click and keydown — reading or selecting sub-item
 * content is not an activation, InfoRow's body rule carried here. A row
 * without `subItems` renders exactly the tree it rendered before the
 * disclosure existed: no chevron, no region, no new tab stops.
 */
const FeedRow = ({
  item,
  rowVariant,
  rowTone,
  rowCorner,
  subRowCorner,
  subRowPadding,
  cardSurfaceTone,
  cardAccent,
  open,
  onToggle,
}: {
  item: ActivityFeedItem;
  rowVariant: SurfaceVariant;
  /** Unset rows follow the card's own surface tone. */
  rowTone?: SurfaceTone;
  rowCorner: SurfaceCorner;
  /** The corner every sub-row wash wears. */
  subRowCorner: SurfaceCorner;
  /** The padding ladder every sub-row wash rides. */
  subRowPadding: SurfacePadding;
  cardSurfaceTone: SurfaceTone;
  cardAccent: TrueColor;
  open: boolean;
  onToggle: () => void;
}) => {
  const t = useKitT();
  const renderIcon = useIconRenderer();
  const headerId = useId();
  const contentId = useId();
  const subItems = item.subItems;
  const hasSubs = !!subItems?.length;
  const rowIsToggle = hasSubs && !item.onClick;
  // The dot ladder's floor, the row's standing rule: neutral cards keep
  // neutral dots.
  const dotFloor = cardAccent === "neutral" ? "neutral" : cardAccent;
  const chevron = hasSubs ? (
    rowIsToggle ? (
      <span
        className={classNames(CHEVRON_BASE, open ? "rotate-180" : "rotate-0")}
        aria-hidden="true"
      >
        {renderIcon("ArrowDown", "sm")}
      </span>
    ) : (
      <button
        type="button"
        className={classNames(
          CHEVRON_BASE,
          "rounded-sm border-0 bg-transparent p-0",
          getSurfaceTriggerTokens(cardAccent).focusRing,
          open ? "rotate-180" : "rotate-0",
        )}
        aria-label={
          open
            ? t("kit.activityfeed.hideSubitems")
            : t("kit.activityfeed.showSubitems")
        }
        aria-expanded={open}
        aria-controls={contentId}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
      >
        {renderIcon("ArrowDown", "sm")}
      </button>
    )
  ) : null;

  return (
    // The template row is a Panel, not hand-rolled chrome: `rowVariant`
    // (default `none`), `rowTone` (default: the component's own tone) and
    // `rowCorner` (default `rounded`, the corner scale's xs step) on `xs`
    // padding. Hover, focus and activation come from the Panel API rather
    // than copied row classes — the toggle, like an `onClick`, is the
    // Panel's guarded card action, and a click that belongs to a nested
    // control — the link, a custom body's buttons — stays that control's.
    <Panel
      variant={rowVariant}
      tone={rowTone ?? cardSurfaceTone}
      corner={rowCorner}
      padding="xs"
      onClick={item.onClick ?? (hasSubs ? onToggle : undefined)}
      active={item.active}
      pulse={item.attention}
      borderColor={item.attentionTone}
      {...(rowIsToggle
        ? { "aria-expanded": open, "aria-controls": contentId }
        : undefined)}
    >
      <div id={headerId} className="flex items-start gap-3">
        {item.body != null
          ? item.body
          : entryContent(
              item,
              getTrueColorDotClass(item.tone ?? dotFloor),
            )}
        {item.actions != null && actionsZone(item.actions)}
        {chevron}
      </div>
      {hasSubs && (
        // InfoRow's grid-rows gesture, class for class: `0fr → 1fr` plus
        // opacity, never `hidden` — `inert` while collapsed keeps the
        // region unfocusable and unannounced without snapping the
        // transition.
        <div
          className={classNames(
            "grid cursor-auto transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0",
          )}
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          {...(rowIsToggle
            ? {
                onClick: (event: React.MouseEvent) => event.stopPropagation(),
                onKeyDown: (event: React.KeyboardEvent) =>
                  event.stopPropagation(),
              }
            : undefined)}
        >
          <div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            aria-hidden={open ? undefined : true}
            // React 18's types predate `inert`; the cast that predates it
            // in InfoRow ships again.
            {...(open ? {} : ({ inert: true } as Record<string, unknown>))}
            className="min-h-0 overflow-hidden"
          >
            {/* Dot (size-2) + gap-3 puts the column at the title's leading
                edge — sub-rows read as the row's own, one level in. The
                map's `column` carries the row gap and the clip-room
                padding (bleed + the actions zone's 4px button spill) in
                lockstep — see `SUB_ROW_PADDING` in nestedPanel. */}
            <div className={classNames("flex flex-col pl-5", SUB_ROW_PADDING[subRowPadding].column)}>
              {subItems?.map((sub, index) => {
                // The tone ladder ends here; the dot then steps one off the
                // parent's in both themes, and the hover hue is the sub's
                // `hoverTone` or the tone the dot resolved to — so every
                // template sub-row washes by default. The wrapper is the
                // `group` the dot's hover reads from; negative margins let
                // the wash breathe into the column's gap without moving the
                // row. The resting fill is the nested panels' own depth step
                // — one step off whatever surface the row nestles on — so
                // each sub reads as its own row, not flat ink.
                const subTone = sub.tone ?? item.tone ?? dotFloor;
                const hover = getSubItemHoverClasses(sub.hoverTone ?? subTone);
                return (
                  <div
                    key={index}
                    className={classNames(
                      "group flex items-start gap-3 transition-colors duration-200 motion-reduce:transition-none",
                      SUB_ROW_PADDING[subRowPadding].row,
                      getSurfaceCornerClass(subRowCorner),
                      NESTED_PANEL_WASH[1],
                      hover.wash,
                    )}
                  >
                    {sub.body != null
                      ? sub.body
                      : entryContent(
                          sub,
                          classNames(
                            getTrueColorSubDotClass(subTone),
                            "transition-colors duration-200 motion-reduce:transition-none",
                            hover.dot,
                          ),
                        )}
                    {sub.actions != null && actionsZone(sub.actions)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
};

/**
 * The audit log as a living feed: newest first, toned dots for what
 * happened, a segment control for who or what kind, and a tail that says
 * there is more. Rows are dense on purpose — feeds are skimmed, not read.
 */
export const ActivityFeed = ({
  title = "Recent activity",
  items,
  filters = [],
  defaultFilter = "all",
  onFilterChange,
  tag = "",
  linkLabel = "",
  onLink,
  ctaVariant,
  loadMoreVariant,
  filterVariant,
  filterTone,
  onLoadMore,
  hasMore = false,
  loadMode = "scroll",
  rootMargin,
  minItems,
  scrollResetKey,
  onError,
  controlsTone,
  loading = false,
  loaderType = "skeleton",
  loaderProgress,
  loadingMessage,
  skeletonRows,
  loadMoreLabel = "Load more",
  totalCount,
  countLabel,
  maxHeight,
  variant = "outlined",
  tone: surfaceTone = "none",
  padding = "md",
  corner,
  rowVariant = "none",
  rowTone,
  rowCorner = "rounded",
  subRowCorner = "rounded-sm",
  subRowPadding = "md",
  raisedSurface = false,
  className = "",
  ...rest
}: ActivityFeedProps) => {
  const t = useKitT();
  const tone = getSurfaceAccentColor(surfaceTone);
  // The controls' accent, once. Unset inherits each control's own default —
  // `undefined` on a neutral card, so Button and MultiToggle keep their blue,
  // exactly as before. The pill needs a concrete tone, so it spells the same
  // fallback the hardcoded `blue` used to.
  const controlColor = controlsTone ?? (tone === "neutral" ? undefined : tone);
  const pillTone = controlsTone ?? (tone === "neutral" ? "blue" : tone);
  // The filter sits one level below `controlsTone` in the chain: give it a
  // tone of its own and only the filter moves.
  const filterColor = filterTone ?? controlColor;
  const [active, setActive] = useState(defaultFilter);
  // The disclosure's uncontrolled open-set, keyed by item id — a row seeds
  // from `defaultExpanded` only while its id is absent, so Load-more rows
  // keep their ask. Ids key the list too, so the set survives filter
  // switches: hide a row and it returns as open as you left it.
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const options = useMemo(
    () => [{ label: "All", value: "all" }, ...filters],
    [filters],
  );

  const visible = useMemo(
    () =>
      active === "all"
        ? items
        : items.filter((item) => (item.category ?? item.tone) === active),
    [items, active],
  );

  // The header count: the caller's true total when it knows one, else what
  // the feed is actually drawing.
  const count = totalCount ?? visible.length;

  const pick = (value: string) => {
    setActive(value);
    onFilterChange?.(value);
  };

  // Infinite loading rides the kit's shared `useInfiniteScroll` — the same
  // watch the Table and `InfiniteScrollPanel` run: a sentinel observed inside
  // the ScrollArea's viewport with a `rootMargin` lookahead, so a page is
  // already in flight before the reader reaches the end, and the under-fill
  // pass keeps fetching until the body is full. It only engages with a
  // capped body — an uncapped feed has no scroller to watch, and the
  // Load-more button covers it.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const infinite = loadMode === "scroll" && maxHeight !== undefined && !!onLoadMore;
  const scroll = useInfiniteScroll({
    rootRef: viewportRef,
    sentinelRef,
    hasMore: infinite && hasMore,
    isLoading: loading,
    onLoadMore: async () => {
      await onLoadMore?.();
    },
    itemCount: visible.length,
    minItems,
    rootMargin,
    // Switching filters swaps the dataset, and the watch resets with it.
    resetKey: `${active}:${scrollResetKey ?? ""}`,
    onError,
  });

  // The scroll tail: a bare spinner while a page is in flight, a one-line
  // retry on failure. Silent on success — the rows just arrive.
  const scrollTail = infinite ? (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      {scroll.error ? (
        <div
          data-slot="activity-feed-scroll-error"
          className="flex items-center justify-center gap-2 py-2 text-xs text-rose-600 dark:text-rose-400"
        >
          Couldn't load more
          <Button size="xs" variant="link" onClick={() => void scroll.loadMore()}>
            Try again
          </Button>
        </div>
      ) : scroll.isLoadingMore ? (
        <div
          data-slot="activity-feed-scroll-loading"
          className="flex justify-center py-2"
          role="status"
          aria-label="Loading more"
        >
          <Spinner size="xs" color={controlColor} />
        </div>
      ) : null}
    </>
  ) : null;

  // The body is built before the layout so the three states — rows, skeleton
  // and empty — share one scroller when `maxHeight` caps the card. Swapping
  // states never resizes the card or drops the scroll area around them, and
  // the Load-more button stays outside, pinned under the card: you scroll the
  // feed, not the affordance.
  // Only the skeleton mode replaces content; spinner/progress keep the real
  // rows and controls in place beneath the Loader overlay, so the card's
  // shape holds from the first frame to the last.
  const showSkeleton = loading && loaderType === "skeleton";
  // Placeholder count: the caller's say-so, or a read on the pending page.
  const skeletonRowCount = Math.max(
    1,
    skeletonRows ?? Math.min(Math.max(items.length, 3), 6),
  );
  const body = showSkeleton ? (
    // A placeholder shaped like the feed itself: dot, title bar on the
    // Table's width ladder, a description line on alternate rows, a code
    // chip on every third, and the time bar pinned right — skim it and
    // you'd read a real feed half-written.
    <div
      className="flex flex-col divide-y divide-neutral-100 animate-pulse motion-reduce:animate-none dark:divide-neutral-800"
      aria-hidden="true"
    >
      {Array.from({ length: skeletonRowCount }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 px-2 py-3 first:pt-1 last:pb-0">
          <SkeletonBar className="mt-1.5 size-2 shrink-0 rounded-full" height="h-2" />
          <div className="min-w-0 flex-1">
            <SkeletonBar width={`${[100, 83, 80, 75][index % 4]}%`} />
            {index % 2 === 0 && (
              <SkeletonBar
                className="mt-1.5"
                height="h-2"
                width={`${[66, 74, 58, 70][index % 4]}%`}
              />
            )}
            {index % 3 === 2 && (
              <SkeletonBar className="mt-2 w-12" />
            )}
          </div>
          <SkeletonBar className="mt-0.5 h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  ) : visible.length === 0 ? (
    <EmptyState
      icon="Log"
      title="Nothing here"
      subtitle="No events match this filter yet."
    />
  ) : (
    <ol
      className={classNames(
        // On the shared `none` surface the list's own dividers draw the
        // lines between rows. Give the rows a surface of their own and
        // those lines get in the way — they'd cut straight through each
        // row's Panel — so they make way for a little vertical air
        // instead, matching the `xs` inset the rows carry.
        rowVariant === "none"
          ? "divide-y divide-neutral-100 dark:divide-neutral-800"
          : "space-y-2",
      )}
    >
      {visible.map((item) => {
        // Controlled rows — InfoRow's `expanded` carried on the data —
        // answer only to the caller; uncontrolled rows ride the feed's
        // open-set. `onToggle` fires either way: a controlled row's
        // caller is the only one who can move it.
        const controlled = typeof item.expanded === "boolean";
        const open = controlled
          ? (item.expanded as boolean)
          : (openMap[item.id] ?? item.defaultExpanded ?? false);
        return (
          <li key={item.id}>
            <FeedRow
              item={item}
              rowVariant={rowVariant}
              rowTone={rowTone}
              rowCorner={rowCorner}
              subRowCorner={subRowCorner}
              subRowPadding={subRowPadding}
              cardSurfaceTone={surfaceTone}
              cardAccent={tone}
              open={open}
              onToggle={() => {
                if (!controlled) {
                  setOpenMap((map) => ({ ...map, [item.id]: !open }));
                }
                item.onToggle?.(!open);
              }}
            />
          </li>
        );
      })}
    </ol>
  );

  return (
    <Panel
      {...rest}
      variant={variant}
      tone={surfaceTone}
      padding={padding}
      corner={corner}
      raisedSurface={raisedSurface}
      className={classNames("w-full", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          {tag && !loading && (
            <Pill tone={pillTone} size="sm">
              {tag}
            </Pill>
          )}
          {countLabel !== false && (
            <span
              className={classNames(
                "text-xs text-neutral-500 dark:text-neutral-400",
                loading && "invisible",
              )}
              aria-hidden={loading || undefined}
            >
              {count}
              {totalCount !== undefined && filters.length > 0 && active !== "all"
                ? ` of ${totalCount}`
                : ""}
              {typeof countLabel === "string"
                ? countLabel && ` ${countLabel}`
                : ` ${count === 1 ? "event" : "events"}`}
            </span>
          )}
          {linkLabel && !loading && (
            <Button
              variant={ctaVariant ?? SURFACE_TO_BUTTON_VARIANT[variant]}
              color={controlColor}
              size="sm"
              className="ms-auto"
              trailingIcon="ChevronRight"
              onClick={onLink}
            >
              {linkLabel}
            </Button>
          )}
        </div>

        {filters.length > 0 && !loading && (
          <MultiToggle
            options={options}
            value={active}
            onChange={pick}
            variant={filterVariant ?? variant}
            size="sm"
            tone={filterColor}
          />
        )}

        {/* Spinner/progress modes pin the Loader to this wrapper, not the
            ScrollArea below — inside a scroll container an `absolute
            inset-0` overlay scrolls away with the content (Table's rule).
            `skeleton` never reaches the overlay branch. */}
        <div className="relative" aria-busy={loading || undefined}>
          {loading && loaderType !== "skeleton" && (
            <Loader
              overlay
              variant={loaderType === "progress" ? "progress" : "spinner"}
              size="lg"
              label={loadingMessage ?? t("kit.spinner.loading")}
              progress={loaderProgress}
              color={controlColor}
              className="rounded-none"
            />
          )}
          {maxHeight === undefined ? (
            body
          ) : (
            <ScrollArea
              horizontal={false}
              viewportRef={viewportRef}
              style={{
                maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
              }}
            >
              {body}
              {scrollTail}
            </ScrollArea>
          )}
        </div>

        {/* The button tail: explicit `"button"` mode, or an uncapped feed
            where scroll mode has no scroller to watch. */}
        {hasMore && onLoadMore && !loading && !infinite && (
          <Button
            variant={loadMoreVariant ?? SURFACE_TO_BUTTON_VARIANT[variant]}
            color={controlColor}
            size="sm"
            className="self-center"
            onClick={onLoadMore}
          >
            {loadMoreLabel}
          </Button>
        )}
      </div>
    </Panel>
  );
};

ActivityFeed.displayName = "ActivityFeed";

export default ActivityFeed;
