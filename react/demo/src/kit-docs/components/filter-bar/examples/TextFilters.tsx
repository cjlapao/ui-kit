import { useState } from "react";
import { DropdownButton, FilterBar, Toggle, type DropdownButtonOption, type FilterBarValue } from "@cjlapao/ui-kit";

const memories = [
  { title: "Retry policy lives in the gateway", tags: ["auth", "infra"], loop: "gateway-hardening", provenance: "agent", retracted: false },
  { title: "Retract the v1 cache note", tags: ["cache"], loop: "cache-audit", provenance: "human", retracted: true },
  { title: "Auth tokens rotate nightly", tags: ["auth"], loop: "gateway-hardening", provenance: "agent", retracted: false },
  { title: "Loop notes: schema migration", tags: ["db"], loop: "schema-drift", provenance: "human", retracted: false },
];

const provenances: DropdownButtonOption[] = [
  { value: "any", label: "any" },
  { value: "human", label: "human" },
  { value: "agent", label: "agent" },
];

export default function TextFilters() {
  const [provenance, setProvenance] = useState("any");
  const [retracted, setRetracted] = useState(false);
  const [value, setValue] = useState<FilterBarValue>({});
  // Text filters hold one trimmed term each: { tag: ["auth"], loop: ["slug"] }.
  // The leading dropdown and the trailing toggle are consumer-owned slot
  // content — the bar lays them out but never clears them with Clear all.
  const results = memories.filter(memory =>
    (provenance === "any" || memory.provenance === provenance) &&
    (retracted || !memory.retracted) &&
    (!value.tag?.length || memory.tags.includes(value.tag[0])) &&
    (!value.loop?.length || memory.loop === value.loop[0]),
  );
  return <div className="w-full space-y-3">
    <FilterBar
      searchProps={{ onSearch: () => {}, placeholder: "Search memories" }}
      leading={<DropdownButton variant="outline" label={`Provenance: ${provenance}`} options={provenances} onOptionSelect={option => setProvenance(option.value)} />}
      trailing={<Toggle label="Include retracted" checked={retracted} onChange={event => setRetracted(event.target.checked)} />}
      filters={[
        { id: "tag", label: "Tag", type: "text", inputProps: { placeholder: "Tag" } },
        { id: "loop", label: "Source loop", type: "text", display: "menu", inputProps: { placeholder: "Source loop slug" } },
      ]}
      value={value}
      onChange={setValue}
      filteredCount={results.length}
      totalCount={memories.length}
      itemLabel="memories"
    />
    <ul className="space-y-2 text-sm">{results.map(memory => <li key={memory.title}>{memory.title} · {memory.tags.join(", ")} · {memory.loop} · {memory.provenance}{memory.retracted ? " · retracted" : ""}</li>)}</ul>
  </div>;
}
