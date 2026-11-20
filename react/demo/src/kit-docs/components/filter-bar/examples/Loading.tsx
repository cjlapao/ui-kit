import { useState } from "react";
import { FilterBar, MultiToggle, Toggle, type FilterBarLoaderType, type FilterBarValue } from "@cjlapao/ui-kit";

const devices = [
  { name: "MacBook Pro", status: "online" },
  { name: "Build server", status: "offline" },
  { name: "Design workstation", status: "online" },
];

export default function Loading() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<FilterBarValue>({ status: ["online"] });
  const [loading, setLoading] = useState(true);
  const [loaderType, setLoaderType] = useState<FilterBarLoaderType>("skeleton");
  const results = devices.filter(device =>
    device.name.toLowerCase().includes(query.toLowerCase()) &&
    (!value.status?.length || value.status.includes(device.status)),
  );
  return <div className="w-full space-y-3">
    {/* The whole control speaks the Table/ActivityFeed loading family:
        skeleton — the default — rewrites the bar's pieces in placeholder
        ink, while spinner and progress dim the live bar under a labelled
        overlay. Same strip height in every state, nothing jumps when
        results land. */}
    <FilterBar
      loading={loading}
      loaderType={loaderType}
      loaderProgress={loaderType === "progress" ? 62 : undefined}
      loadingMessage="Fetching devices"
      searchProps={{ onSearch: setQuery, debounceMs: 300, placeholder: "Search devices" }}
      filters={[{
        id: "status", label: "Status", options: [
          { value: "online", label: "Online", count: 2 },
          { value: "offline", label: "Offline", count: 1 },
        ],
      }]}
      value={value}
      onChange={setValue}
      filteredCount={results.length}
      totalCount={devices.length}
      itemLabel="devices"
    />
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <Toggle label="Loading" checked={loading} onChange={event => setLoading(event.target.checked)} />
      <MultiToggle
        aria-label="Loader type"
        options={[
          { value: "skeleton", label: "Skeleton (default)" },
          { value: "spinner", label: "Spinner" },
          { value: "progress", label: "Progress" },
        ]}
        value={loaderType}
        onChange={next => setLoaderType(next as FilterBarLoaderType)}
      />
    </div>
    <ul className="space-y-2 text-sm">{results.map(device => <li key={device.name}>{device.name} · {device.status}</li>)}</ul>
  </div>;
}
