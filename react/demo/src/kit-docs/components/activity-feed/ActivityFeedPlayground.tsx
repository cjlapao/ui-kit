import type { SurfaceCorner, SurfaceTone } from "@cjlapao/ui-kit";
import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import React, { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ActivityFeed,
  Button,
  Input,
  Panel,
  Pill,
  type ActivityFeedItem,
  type ActivityFeedLoaderType,
  type ButtonVariant,
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
  // Each override carries a Panel of its own, so the row surface can be
  // played with independently of the card's variant and tone.
  const [bodyVariant, setBodyVariant] = useState<SurfaceVariant>("elevated");
  const [bodyTone, setBodyTone] = useState<SurfaceTone>("none");
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<SurfaceTone>("none");
  // The rows are Panels too — `rowVariant`/`rowTone` play their surface
  // independently of the card's. Tone starts by following the card, the
  // kit's own default.
  const [itemVariant, setItemVariant] = useState<SurfaceVariant>("none");
  const [itemTone, setItemTone] = useState<SurfaceTone>("none");
  const [itemToneFollowsCard, setItemToneFollowsCard] = useState(true);
  // `rounded` is the corner scale's xs step — the row's own default.
  const [itemCorner, setItemCorner] = useState<SurfaceCorner>("rounded");
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
      ...(customBody ? { body: override(item) } : {}),
    }));
  }, [items, customBody, bodyVariant, bodyTone, activeRow, attentionRow, attentionTone]);

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
                    <ToggleRow label="item tone follows card" checked={itemToneFollowsCard} onChange={setItemToneFollowsCard} />
                    {!itemToneFollowsCard && (
                      <SurfaceToneControl label="Item tone" value={itemTone} onChange={setItemTone} />
                    )}
                    <SelectControl label="Controls tone" options={[{ value: "", label: "(inherit)" }, ...trueColorOptions]} value={controlsTone}
                      onChange={(v) => setControlsTone(v)} />
                    <SelectControl label="CTA variant" options={CTA_VARIANT_OPTIONS} value={ctaVariant} onChange={setCtaVariant} />
                    <SelectControl label="Load more variant" options={CTA_VARIANT_OPTIONS} value={loadMoreVariant} onChange={setLoadMoreVariant} />
                    <SelectControl label="Filter variant" options={FILTER_VARIANT_OPTIONS} value={filterVariant} onChange={setFilterVariant} />
                    <SelectControl label="Filter tone" options={[{ value: "", label: "(inherit)" }, ...trueColorOptions]} value={filterTone}
                      onChange={(v) => setFilterTone(v)} />
                    <SelectControl label="Padding" options={panelPaddingOptions} value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)} />
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
            vertical gap. <strong>Active row</strong> and{" "}
            <strong>attention row</strong> hand the row Panel its{" "}
            <code>active</code> rim and <code>pulse</code> glow — selection
            and demand, layering with the hover and with each other — and{" "}
            <strong>attention tone</strong> moves that hue the Panel's own
            way: <code>borderColor ?? tone</code>, blue floor, one hue for
            rim and glow.
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
            rowVariant={itemVariant}
            rowTone={itemToneFollowsCard ? undefined : itemTone}
            rowCorner={itemCorner}
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
