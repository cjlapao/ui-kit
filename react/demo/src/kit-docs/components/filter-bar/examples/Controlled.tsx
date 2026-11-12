import { useState } from "react";
import { FilterBar, type FilterBarValue } from "@cjlapao/ui-kit";

const devices = [
  { name: "MacBook Pro", status: "online" },
  { name: "Build server", status: "offline" },
  { name: "Design workstation", status: "online" },
];

export default function Controlled() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterBarValue>({});
  const results = devices.filter(device =>
    device.name.toLowerCase().includes(query.toLowerCase()) &&
    (!filters.status?.length || filters.status.includes(device.status)),
  );
  return <div className="w-full space-y-3">
    <FilterBar
      searchProps={{ onSearch: setQuery, debounceMs: 300, placeholder: "Search devices" }}
      filters={[{
        id: "status", label: "Status", options: [
          { value: "online", label: "Online", count: 2 },
          { value: "offline", label: "Offline", count: 1 },
        ],
      }]}
      value={filters}
      onChange={setFilters}
      filteredCount={results.length}
      totalCount={devices.length}
      itemLabel="devices"
    />
    <ul className="space-y-2 text-sm">{results.map(device => <li key={device.name}>{device.name} · {device.status}</li>)}</ul>
  </div>;
}
