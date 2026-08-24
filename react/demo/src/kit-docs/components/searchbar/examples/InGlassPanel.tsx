import { Panel, SearchBar } from "@cjlapao/ui-kit";

export default function InGlassPanel() {
  return (
    <div className="w-full max-w-md">
      <Panel variant="liquid-glass" tone="slate" corner="rounded-md" padding="sm">
        <SearchBar
          placeholder="Search the library"
          color="slate"
          onSearch={() => {}}
        />
      </Panel>
    </div>
  );
}
