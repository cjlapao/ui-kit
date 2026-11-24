import { useState } from "react";
import { FilterBar, type FilterBarValue } from "@cjlapao/ui-kit";

const devices = [
  { name: "MacBook Pro", status: "online", enrollment: "enabled" },
  { name: "Build server", status: "offline", enrollment: "disabled" },
  { name: "Design workstation", status: "online", enrollment: "partial" },
  { name: "USAAL2ELEKORP.local", status: "online", enrollment: "enabled" },
];

export default function SingleSelect() {
  const [filters, setFilters] = useState<FilterBarValue>({});
  const results = devices.filter(device =>
    (!filters.enrollment?.length || filters.enrollment[0] === device.enrollment)
    && (!filters.status?.length || filters.status.includes(device.status)),
  );
  return <div className="w-full space-y-3">
    <FilterBar
      searchProps={{ onSearch: () => {}, placeholder: "Search devices" }}
      filters={[
        // A valueset that can only hold one value: the drill-down is a
        // checkmark menu, activating a row applies it and closes the popup,
        // and re-clicking the checked row takes the category back to none.
        // No Done — nothing is staged.
        {
          id: "enrollment", label: "Enrollment", type: "single", options: [
            { value: "enabled", label: "Enabled", count: 2 },
            { value: "partial", label: "Partial", count: 1 },
            { value: "disabled", label: "Disabled", count: 1 },
          ],
        },
        // The checkbox arm beside it, for contrast: many values at once,
        // staged until Done.
        {
          id: "status", label: "Status", options: [
            { value: "online", label: "Online", count: 3 },
            { value: "offline", label: "Offline", count: 1 },
          ],
        },
      ]}
      value={filters}
      onChange={setFilters}
      filteredCount={results.length}
      totalCount={devices.length}
      itemLabel="devices"
    />
    <ul className="space-y-2 text-sm">{results.map(device => <li key={device.name}>{device.name} · {device.enrollment} · {device.status}</li>)}</ul>
  </div>;
}
