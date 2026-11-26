import type { SurfaceCorner, SurfaceTone } from "@cjlapao/ui-kit";
import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import React, { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ActivityFeed,
  Button,
  IconButton,
  Input,
  Menu,
  Panel,
  Pill,
  type ActivityFeedItem,
  type ActivityFeedLoaderType,
  type ActivityFeedSubItem,
  type ButtonVariant,
  type MenuItem,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  panelCornerOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const FILTER_VARIANT_OPTIONS = [
  { value: "", label: "Auto" },
  ...surfaceVariantOptions,
];

const CTA_VARIANT_OPTIONS = [
  { value: "", label: "Auto" },
  { value: "solid", label: "Solid" },
  { value: "soft", label: "Soft" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost" },
  { value: "link", label: "Link" },
];

// Clickable through the row's own `onClick` — the hover wash and cursor are
// the Table's clickable-row grammar. Synthesised `load more` rows skip it,
// so the contrast shows.
const BASE_ITEMS: ActivityFeedItem[] = [
  { id: "1", title: "rotated the signing keys", actor: "Ada", timestamp: "2m ago", tone: "amber", category: "security", onClick: () => {} },
  { id: "2", title: "closed as won", actor: "Sales Bot", timestamp: "18m ago", tone: "green", category: "crm", code: "DEAL-2211", onClick: () => {} },
  { id: "3", title: "deployed the release", actor: "CI", timestamp: "1h ago", tone: "blue", category: "deploys", code: "#412", count: 3, onClick: () => {} },
  { id: "4", title: "flagged a slow query", actor: "Watchdog", timestamp: "2h ago", tone: "rose", category: "alerts", description: "GET /api/invoices p95 crossed 1.2s on eu-west.", onClick: () => {} },
  { id: "5", title: "invited two reviewers", actor: "Grace", timestamp: "3h ago", tone: "neutral", category: "crm", onClick: () => {} },
];

const FILTERS = [
  { label: "Deploys", value: "deploys" },
  { label: "CRM", value: "crm" },
  { label: "Security", value: "security" },
  { label: "Alerts", value: "alerts" },
];

const AGENTS = ["CI", "Ada", "Grace", "Watchdog"];
const VERBS = ["restarted a pod", "pruned stale branches", "archived an audit export", "cleared the feature flag"];

// The `actions` zone, shown as its common use: a ghost DotsVertical
// IconButton triggering a Menu popup. The zone swallows clicks and keys,
// so opening a menu never folds the row nor fires its action — menus are
// on rows and sub-rows below, in both disclosure modes.
const dotsMenu = (label: string, items: MenuItem[]) => (
  <Menu
    popup
    items={items}
    trigger={<IconButton icon="DotsVertical" variant="ghost" size="xs" srLabel={label} />}
  />
);

const DEPLOY_MENU: MenuItem[] = [
  { id: "view", label: "View deployment", icon: "Eye" },
  { id: "copy", label: "Copy id", icon: "Copy" },
  { id: "sep", type: "separator" },
  { id: "archive", label: "Archive", icon: "Archive", danger: true },
];

const POD_MENU: MenuItem[] = [
  { id: "logs", label: "View logs", icon: "Code" },
  { id: "restart", label: "Restart pods", icon: "Restart", danger: true },
];

const CACHE_MENU: MenuItem[] = [
  { id: "pause", label: "Pause warm-up", icon: "Settings" },
  { id: "skip", label: "Skip", icon: "Close1" },
];

const SEC_MENU: MenuItem[] = [
  { id: "rotate", label: "Rotate now", icon: "Refresh" },
  { id: "revoke", label: "Revoke key", icon: "Trash", danger: true },
];

// Sub-items for the two rows the playground opens: the deploy row gives
// its click up (the row becomes the toggle, chevron as decoration), the
// security row keeps its click (the chevron becomes a button of its own).
const DEPLOY_SUBS: ActivityFeedSubItem[] = [
  {
    actor: "api",
    title: "rolled 4 pods",
    count: 4,
    code: "svc/api",
    timestamp: "58m ago",
    // A zone on a sub-row: open this menu and the row stays put.
    actions: dotsMenu("Pod actions", POD_MENU),
  },
  // Its own `onClick`: the wash turns into a button and the click fires
  // alone — the deploy row, the toggle, stays open through it.
  {
    actor: "web",
    title: "rolled 3 pods",
    count: 3,
    code: "svc/web",
    timestamp: "57m ago",
    onClick: () => {},
  },
  {
    // A custom sub-row: any node fills the indent column the same. The
    // wash is the wrapper's, so it gets one too — emerald, its bar's hue.
    // The zone rides alongside the custom body.
    hoverTone: "emerald",
    actions: dotsMenu("Cache actions", CACHE_MENU),
    body: (
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 truncate text-sm font-medium">
            <span className="font-semibold">cache </span>warming up
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
];

const SEC_SUBS: ActivityFeedSubItem[] = [
  // A sub's click stays its own even while the row carries an `onClick`
  // — the chevron folds, the row activates, and neither happens here.
  {
    title: "staging keys rotated",
    code: "env/staging",
    timestamp: "2m ago",
    onClick: () => {},
  },
  {
    title: "production keys queued",
    description: "awaiting the approval window",
    code: "env/prod",
    timestamp: "1m ago",
    tone: "amber",
  },
];

export const ActivityFeedPlayground: React.FC = () => {
  const [items, setItems] = useState(BASE_ITEMS);
  const [filters, setFilters] = useState(true);
  const [tag, setTag] = useState(true);
  // The header count's noun, the way the kit lets callers take it: empty is
  // the feed's own "event(s)", any other string rides verbatim, and turning
  // the row off drops the count from the header altogether.
  const [countLabel, setCountLabel] = useState("");
  const [showCount, setShowCount] = useState(true);
  const [link, setLink] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  // Infinite is the feed's default loading mode; the button tail stays one
  // choice away. The list caps at 26 so the playground can reach the end.
  const [loadMode, setLoadMode] = useState<"scroll" | "button">("scroll");
  // On by default so Load more is seen doing its job: the card holds its
  // height, the rows scroll, and the tail button stays pinned under it.
  const [scroll, setScroll] = useState(true);
  // Row states ride straight to the row Panel: `active` becomes its
  // selection rim, `attention` its pulse. Marked on Ada (the current row)
  // and Watchdog (a slow query is exactly what attention is for).
  const [activeRow, setActiveRow] = useState(false);
  const [attentionRow, setAttentionRow] = useState(false);
  // The row's state hue, on the Panel's own terms: `borderColor ?? tone`
  // with the blue floor — empty is the inherit that rule describes, not a
  // colour. It rides the row Panel's `borderColor`, so the attention glow
  // and the selection rim agree, as they always do on a Panel.
  const [attentionTone, setAttentionTone] = useState("");
  const [loading, setLoading] = useState(false);
  // The three loading styles the feed speaks, like the Table: skeleton
  // rewrites the body, spinner/progress pin a Loader over the real rows.
  const [loaderType, setLoaderType] = useState<ActivityFeedLoaderType>("skeleton");
  // The per-item `body` override: on, and every item swaps its whole
  // content for a custom node — the default row disappears entirely.
  const [customBody, setCustomBody] = useState(false);
  // The disclosure: on, the security row grows sub-items around its
  // existing click (chevron-button mode) and the deploy row opens into
  // per-service lines with its click handed to the toggle (row-as-toggle
  // mode). The seed toggle ships the deploy row already open.
  const [subItems, setSubItems] = useState(false);
  const [subsExpanded, setSubsExpanded] = useState(true);
  // Each override carries a Panel of its own, so the row surface can be
  // played with independently of the card's variant and tone.
  const [bodyVariant, setBodyVariant] = useState<SurfaceVariant>("elevated");
  const [bodyTone, setBodyTone] = useState<SurfaceTone>("none");
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<SurfaceTone>("none");
  // Flip it when the card and its background agree on the same tint and the
  // card stops being findable — this forces the ladder's first step back in.
  const [raisedSurface, setRaisedSurface] = useState(false);
  // The rows are Panels too — `rowVariant`/`rowTone` play their surface
  // independently of the card's. Tone starts by following the card, the
  // kit's own default.
  const [itemVariant, setItemVariant] = useState<SurfaceVariant>("none");
  const [itemTone, setItemTone] = useState<SurfaceTone>("none");
  const [itemToneFollowsCard, setItemToneFollowsCard] = useState(true);
  // The two state hues, kept deliberately away from Item tone: the resting row
  // can stay neutral ink while the pointer's answer and the current row wear a
  // colour of their own. Empty is the auto each one documents — the row's own
  // hue, and for hover the Panel's rule (the active row follows the selection).
  const [rowHoverTone, setRowHoverTone] = useState("");
  const [rowActiveTone, setRowActiveTone] = useState("");
  // `rounded` is the corner scale's xs step — the row's own default.
  const [itemCorner, setItemCorner] = useState<SurfaceCorner>("rounded");
  // The sub-row washes corner and pad through the kit's own scales; the
  // defaults are the feed's (the corner scale's sm step, padding `md`).
  const [subCorner, setSubCorner] = useState<SurfaceCorner>("rounded-sm");
  const [subPadding, setSubPadding] = useState<SurfacePadding>("md");
  const [ctaVariant, setCtaVariant] = useState("");
  const [loadMoreVariant, setLoadMoreVariant] = useState("");
  const [filterVariant, setFilterVariant] = useState("");
  const [padding, setPadding] = useState<SurfacePadding>("md");
  const [controlsTone, setControlsTone] = useState("");
  const [filterTone, setFilterTone] = useState("");

  // Load more synthesises older entries so the tail does something. The
  // delay is the page fetch: with infinite mode it makes the tiny spinner
  // at the feed's end visible while the next three arrive.
  const loadMore = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `x${prev.length + i}`,
        title: VERBS[(prev.length + i) % VERBS.length],
        actor: AGENTS[(prev.length + i) % AGENTS.length],
        timestamp: `${prev.length + i + 1}h ago`,
        tone: (["neutral", "blue", "slate"] as const)[i % 3],
      })),
    ]);
  };

  // On, and every item hands its whole content to `body` — dot, actor,
  // title, description, code and timestamp all stop being drawn. The
  // wrapper stays the kit's: same padding, dividers and, with `onClick`,
  // the clickable-row grammar. Inside it sits a Panel of the chosen
  // variant and tone, proving the override can host real kit surfaces.
  const shownItems = useMemo(() => {
    const override = (item: ActivityFeedItem): ReactNode => (
      <Panel variant={bodyVariant} tone={bodyTone} padding="sm" className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="min-w-0 truncate text-sm">
            <span className="font-semibold">{item.actor}</span>{" "}
            <span className="font-medium">{item.title}</span>
          </span>
          <Pill tone={item.tone ?? "neutral"} size="sm">
            {item.code ?? item.category ?? "custom"}
          </Pill>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">body override</span>
          <Button variant="ghost" size="sm" className="ms-auto" onClick={() => {}}>
            Open
          </Button>
        </div>
      </Panel>
    );
    // The row states reach the row's own Panel; the body override reaches
    // inside it. The two are independent — an active row is active whatever
    // its content is.
    return items.map((item) => ({
      ...item,
      active: activeRow && item.id === "1",
      attention: attentionRow && item.id === "4",
      attentionTone: (attentionRow && item.id === "4"
        ? attentionTone || undefined
        : undefined) as ActivityFeedItem["attentionTone"],
      // The disclosure is independent of the content override: a row may
      // carry a custom body and still fold open.
      ...(subItems
        ? item.id === "3"
          ? {
              onClick: undefined,
              defaultExpanded: subsExpanded,
              subItems: DEPLOY_SUBS,
              // Row-as-toggle mode: the dots open a menu and the
              // disclosure never flinches.
              actions: dotsMenu("Deployment actions", DEPLOY_MENU),
            }
          : item.id === "1"
            ? {
                subItems: SEC_SUBS,
                // Chevron-button mode: the zone sits between the
                // content and the caret.
                actions: dotsMenu("Security actions", SEC_MENU),
              }
            : {}
        : {}),
      ...(customBody ? { body: override(item) } : {}),
    }));
  }, [items, customBody, bodyVariant, bodyTone, activeRow, attentionRow, attentionTone, subItems, subsExpanded]);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "parts",
                title: "Parts",
                // Open on mount — the feed's whole point is the parts and
                // the surface, and a collapsed accordion hides them.
                defaultOpen: true,
                controls: (
                  <>
                    <ToggleRow label="filters" checked={filters} onChange={setFilters} />
                    <ToggleRow label="tag" checked={tag} onChange={setTag} />
                    <ToggleRow label="count label" checked={showCount} onChange={setShowCount} />
                    {showCount && (
                      <Control label="Count noun">
                        <Input
                          size="sm"
                          value={countLabel}
                          placeholder="events (default)"
                          onChange={(event) => setCountLabel(event.target.value)}
                        />
                      </Control>
                    )}
                    <ToggleRow label="link" checked={link} onChange={setLink} />
                    <ToggleRow label="hasMore" checked={hasMore} onChange={setHasMore} />
                    <SelectControl label="Load mode" options={[{ value: "scroll", label: "Scroll (infinite)" }, { value: "button", label: "Button" }]} value={loadMode}
                      onChange={(v) => setLoadMode(v as "scroll" | "button")} />
                    <ToggleRow label="scroll (max-h)" checked={scroll} onChange={setScroll} />
                    <ToggleRow label="active row" checked={activeRow} onChange={setActiveRow} />
                    <ToggleRow label="attention row" checked={attentionRow} onChange={setAttentionRow} />
                    {attentionRow && (
                      <SelectControl label="Attention tone" options={[{ value: "", label: "(follow row tone)" }, ...trueColorOptions]} value={attentionTone}
                        onChange={setAttentionTone} />
                    )}
                    <ToggleRow label="loading" checked={loading} onChange={setLoading} />
                    <SelectControl label="Loader type" options={[{ value: "skeleton", label: "Skeleton (default)" }, { value: "spinner", label: "Spinner" }, { value: "progress", label: "Progress" }]} value={loaderType}
                      onChange={(v) => setLoaderType(v as ActivityFeedLoaderType)} />
                    <ToggleRow label="custom body" checked={customBody} onChange={setCustomBody} />
                    {customBody && (
                      <>
                        <SelectControl label="Body variant" options={surfaceVariantOptions} value={bodyVariant}
                          onChange={(v) => setBodyVariant(v as SurfaceVariant)} />
                        <SurfaceToneControl label="Body tone" value={bodyTone} onChange={setBodyTone} />
                      </>
                    )}
                    <ToggleRow label="sub-items" checked={subItems} onChange={setSubItems} />
                    {subItems && (
                      <ToggleRow label="sub-items open" checked={subsExpanded} onChange={setSubsExpanded} />
                    )}
                  </>
                ),
              },
              {
                id: "surface",
                title: "Surface",
                defaultOpen: true,
                controls: (
                  <>
                    <SelectControl label="Variant" options={surfaceVariantOptions} value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)} />
                    <SurfaceToneControl label="Surface tone" value={tone} onChange={setTone} />
                    <SelectControl label="Item variant" options={surfaceVariantOptions} value={itemVariant}
                      onChange={(v) => setItemVariant(v as SurfaceVariant)} />
                    <SelectControl label="Item corner" options={panelCornerOptions} value={itemCorner}
                      onChange={(v) => setItemCorner(v as SurfaceCorner)} />
                    <SelectControl label="Sub-row corner" options={panelCornerOptions} value={subCorner}
                      onChange={(v) => setSubCorner(v as SurfaceCorner)} />
                    <SelectControl label="Sub-row padding" options={panelPaddingOptions} value={subPadding}
                      onChange={(v) => setSubPadding(v as SurfacePadding)} />
                    <ToggleRow label="item tone follows card" checked={itemToneFollowsCard} onChange={setItemToneFollowsCard} />
                    {!itemToneFollowsCard && (
                      <SurfaceToneControl label="Item tone" value={itemTone} onChange={setItemTone} />
                    )}
                    <SelectControl label="Row hover hue" options={[{ value: "", label: "(follow row tone)" }, ...trueColorOptions]} value={rowHoverTone}
                      onChange={(v) => setRowHoverTone(v)} />
                    <SelectControl label="Row active hue" options={[{ value: "", label: "(follow row hue)" }, ...trueColorOptions]} value={rowActiveTone}
                      onChange={(v) => setRowActiveTone(v)} />
                    <SelectControl label="Controls tone" options={[{ value: "", label: "(inherit)" }, ...trueColorOptions]} value={controlsTone}
                      onChange={(v) => setControlsTone(v)} />
                    <SelectControl label="CTA variant" options={CTA_VARIANT_OPTIONS} value={ctaVariant} onChange={setCtaVariant} />
                    <SelectControl label="Load more variant" options={CTA_VARIANT_OPTIONS} value={loadMoreVariant} onChange={setLoadMoreVariant} />
                    <SelectControl label="Filter variant" options={FILTER_VARIANT_OPTIONS} value={filterVariant} onChange={setFilterVariant} />
                    <SelectControl label="Filter tone" options={[{ value: "", label: "(inherit)" }, ...trueColorOptions]} value={filterTone}
                      onChange={(v) => setFilterTone(v)} />
                    <SelectControl label="Padding" options={panelPaddingOptions} value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)} />
                    <ToggleRow label="Raised surface" checked={raisedSurface} onChange={setRaisedSurface} />
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Filters match an item's <code>category</code>, falling back to its{" "}
            <code>tone</code> — an item with neither only ever shows under All.
            With <strong>scroll</strong> on, <code>maxHeight</code> caps the
            body in a <code>ScrollArea</code>: Load more grows the list, the
            card doesn't. <strong>Custom body</strong> hands every row's
            whole content to <code>item.body</code> — the kit keeps the
            wrapper, while each row brings a <code>Panel</code> of its own
            variant and tone. The kit's own rows are Panels too:{" "}
            <strong>Item variant</strong> and <strong>Item tone</strong>
            drive <code>rowVariant</code> / <code>rowTone</code> /
            <code>rowCorner</code>, so the row
            surface can move under the card — hover wash included. Away
            from <code>none</code>, the list dividers make way for a
            vertical gap. <strong>Row hover hue</strong> and{" "}
            <strong>Row active hue</strong> then split the two states off that
            surface: leave Item variant on <code>none</code> and Item tone
            following the card, name both, and every row stays neutral ink while
            the pointer's wash, the current row's rim and its fill wear your
            colour — the active row hovers in the hue its selection wears, its
            neighbours do not, and the sub-rows under a disclosure wash in the
            hover hue as well unless a sub brings its own <code>hoverTone</code>.
            A row can carry <code>hoverTone</code> / <code>activeTone</code> of
            its own to beat either. <strong>Active row</strong> and{" "}
            <strong>attention row</strong> hand the row Panel its{" "}
            <code>active</code> rim and <code>pulse</code> glow — selection
            and demand, layering with the hover and with each other — and{" "}
            <strong>attention tone</strong> moves that hue the Panel's own
            way: <code>borderColor ?? tone</code>, blue floor, one hue for
            rim and glow. <strong>Sub-items</strong> opens the security row
            around its existing click — the chevron takes the disclosure as
            a button of its own — and the deploy row hands its click to the
            toggle, so the whole row folds open with InfoRow's grid-rows
            animation; <strong>sub-items open</strong> seeds that row
            expanded, and its third line is a custom <code>body</code>.
          </p>
        </div>
      }
      preview={
        <div className="mx-auto w-full max-w-xl">
          <ActivityFeed
            title="Workspace activity"
            tag={tag ? "live" : ""}
            items={shownItems}
            filters={filters ? FILTERS : []}
            linkLabel={link ? "Full audit log" : ""}
            totalCount={98}
            countLabel={showCount ? countLabel || undefined : false}
            loading={loading}
            loaderType={loaderType}
            loaderProgress={loaderType === "progress" ? 62 : undefined}
            hasMore={hasMore && items.length < 26}
            onLoadMore={loadMore}
            loadMode={loadMode}
            maxHeight={scroll ? 280 : undefined}
            variant={variant}
            tone={tone}
            raisedSurface={raisedSurface}
            rowVariant={itemVariant}
            rowTone={itemToneFollowsCard ? undefined : itemTone}
            rowHoverTone={(rowHoverTone || undefined) as TrueColor | undefined}
            rowActiveTone={(rowActiveTone || undefined) as TrueColor | undefined}
            rowCorner={itemCorner}
            subRowCorner={subCorner}
            subRowPadding={subPadding}
            ctaVariant={(ctaVariant || undefined) as ButtonVariant | undefined}
            loadMoreVariant={(loadMoreVariant || undefined) as ButtonVariant | undefined}
            filterVariant={(filterVariant || undefined) as SurfaceVariant | undefined}
            padding={padding}
            controlsTone={(controlsTone || undefined) as TrueColor | undefined}
            filterTone={(filterTone || undefined) as TrueColor | undefined}
          />
        </div>
      }
    />
  );
};
