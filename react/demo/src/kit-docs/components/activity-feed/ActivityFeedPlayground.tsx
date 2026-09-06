import React, { useState } from "react";
import {
  ActivityFeed,
  type ActivityFeedItem,
  type ButtonVariant,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { panelPaddingOptions, surfaceVariantOptions, trueColorOptions } from "../../shared/options";

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

const BASE_ITEMS: ActivityFeedItem[] = [
  { id: "1", title: "rotated the signing keys", actor: "Ada", timestamp: "2m ago", tone: "amber", category: "security" },
  { id: "2", title: "closed as won", actor: "Sales Bot", timestamp: "18m ago", tone: "green", category: "crm", code: "DEAL-2211" },
  { id: "3", title: "deployed the release", actor: "CI", timestamp: "1h ago", tone: "blue", category: "deploys", code: "#412", count: 3 },
  { id: "4", title: "flagged a slow query", actor: "Watchdog", timestamp: "2h ago", tone: "rose", category: "alerts", description: "GET /api/invoices p95 crossed 1.2s on eu-west." },
  { id: "5", title: "invited two reviewers", actor: "Grace", timestamp: "3h ago", tone: "neutral", category: "crm" },
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
  const [link, setLink] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState("neutral");
  const [ctaVariant, setCtaVariant] = useState("");
  const [loadMoreVariant, setLoadMoreVariant] = useState("");
  const [filterVariant, setFilterVariant] = useState("");
  const [padding, setPadding] = useState<SurfacePadding>("md");

  // Load more synthesises older entries so the tail does something.
  const loadMore = () =>
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

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "parts",
                title: "Parts",
                controls: (
                  <>
                    <ToggleRow label="filters" checked={filters} onChange={setFilters} />
                    <ToggleRow label="tag" checked={tag} onChange={setTag} />
                    <ToggleRow label="link" checked={link} onChange={setLink} />
                    <ToggleRow label="hasMore" checked={hasMore} onChange={setHasMore} />
          <ToggleRow label="loading" checked={loading} onChange={setLoading} />
                  </>
                ),
              },
              {
                id: "surface",
                title: "Surface",
                controls: (
                  <>
                    <SelectControl label="Variant" options={surfaceVariantOptions} value={variant}
                      onChange={(v) => setVariant(v as SurfaceVariant)} />
                    <SelectControl label="Tone" options={trueColorOptions} value={tone} onChange={setTone} />
                    <SelectControl label="CTA variant" options={CTA_VARIANT_OPTIONS} value={ctaVariant} onChange={setCtaVariant} />
                    <SelectControl label="Load more variant" options={CTA_VARIANT_OPTIONS} value={loadMoreVariant} onChange={setLoadMoreVariant} />
                    <SelectControl label="Filter variant" options={FILTER_VARIANT_OPTIONS} value={filterVariant} onChange={setFilterVariant} />
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
          </p>
        </div>
      }
      preview={
        <div className="mx-auto w-full max-w-xl">
          <ActivityFeed
            title="Workspace activity"
            tag={tag ? "live" : ""}
            items={items}
            filters={filters ? FILTERS : []}
            linkLabel={link ? "Full audit log" : ""}
            totalCount={98}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            variant={variant}
            tone={tone as TrueColor}
            ctaVariant={(ctaVariant || undefined) as ButtonVariant | undefined}
            loadMoreVariant={(loadMoreVariant || undefined) as ButtonVariant | undefined}
            filterVariant={(filterVariant || undefined) as SurfaceVariant | undefined}
            padding={padding}
          />
        </div>
      }
    />
  );
};
