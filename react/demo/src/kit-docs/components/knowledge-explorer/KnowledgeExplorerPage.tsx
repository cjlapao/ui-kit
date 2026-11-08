import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, A11yCode, KeyboardSupportTable, PropsTable } from "../../shared/A11ySections";
import { KnowledgeExplorerPlayground } from "./KnowledgeExplorerPlayground";
import Standalone from "./examples/Standalone";
import standaloneCode from "./examples/Standalone.tsx?raw";
import MapOverview from "./examples/MapOverview";
import mapCode from "./examples/MapOverview.tsx?raw";
import Harness from "./examples/Harness";
import harnessCode from "./examples/Harness.tsx?raw";

export default function KnowledgeExplorerPage() {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="Knowledge Explorer" description="A memory library first. Compose readable lessons, a quiet spatial map, source details, and agent traces—or use each component on its own." />
    <KnowledgeExplorerPlayground />
    <ExampleCard title="Independent pieces, shared selection" description="MemoryCard, MemoryLibrary, KnowledgeMap, and MemoryDetail need no provider or explorer. These illustrative supplied coordinates demonstrate a projection contract; they are not real embeddings." code={standaloneCode} filename="Standalone.tsx"><Standalone /></ExampleCard>
    <ExampleCard title="Coding harness · memories and traces" description="Explicit links connect trace steps to memories. Retrieving a memory highlights it; selecting a memory exposes all linked steps. Pin and archive callbacks update this demo's local records." code={harnessCode} filename="Harness.tsx"><Harness /></ExampleCard>
    <ExampleCard title="Map alone · density fixture" description="A standalone map with 600 or 3,000 generated records. Inspect cluster glow, pan/zoom, topic context, and paginated list selection. This is a density fixture, not a frame-rate guarantee." code={mapCode} filename="MapOverview.tsx"><MapOverview /></ExampleCard>
    <A11ySection>
      <A11yTopic title="Screen reader"><p>Native selection buttons expose pressed state. Inputs and selects have visible labels. Explorer regions have accessible names. Canvas help describes keyboard navigation, and the expandable list provides the same memory selection without spatial navigation. Loading states expose busy and status announcements.</p><A11yCode code={'<MemoryLibrary memories={memories} aria-label="Project lessons" />\n<KnowledgeMap memories={memories} aria-label="Project knowledge" />'} /></A11yTopic>
      <A11yTopic title="Keyboard Support"><KeyboardSupportTable bindings={[
        { keys: ["Tab"], action: "Move among inputs, selection buttons, actions, and map controls." },
        { keys: ["Enter / Space"], action: "Activate native buttons and the map list disclosure." },
        { keys: ["Arrow keys"], action: "Pan when the map canvas has focus." },
        { keys: ["+ / −"], action: "Zoom when the map canvas has focus." },
        { keys: ["Home"], action: "Fit the map when its canvas has focus." },
        { keys: ["Escape"], action: "Clear map selection when its canvas has focus." },
      ]} /></A11yTopic>
      <A11yTopic title="Map navigation"><p>Cards use native selection buttons with independent action buttons. Map controls support fit and zoom. Focus the canvas and use arrows to pan, +/− to zoom, Home to fit, and Escape to clear selection. The expandable list supports search and pages of 24 selectable memories. Topic buttons filter the library. Mobile exposes one region at a time through labeled view buttons. There is no continuous animation.</p></A11yTopic>
      <A11yTopic title="Similarity and evidence"><p>Without points, the map uses stable illustrative topic placement; distance does not measure similarity. Supply a projection from your backend when available. Dashed lines show only explicit relationships and their labels appear when either endpoint is selected. Retrieval counts measure access, not usefulness. Sources and feedback remain separate evidence.</p></A11yTopic>
      <A11yTopic title="Internationalization"><p>Your application owns embedding generation, persistence, remote search, record updates, and trace links. Action callbacks request changes without silently mutating data. Source URLs accept HTTP, HTTPS, root-relative paths, and anchors; unsafe URLs remain plain text. Built-in controls use kit.knowledge in all five locales, with labels overrides. Record content is consumer-owned plain text; renderContent can supply rich content. Controls follow document direction and use logical text alignment. Spatial coordinates remain unchanged in RTL; arrow keys pan in screen directions.</p></A11yTopic>
    </A11ySection>
    <PropsTable title="Shared selection and surface options" props={[
      { name: "selectedId / defaultSelectedId / onSelectionChange", type: "string | null / string | null / (id) => void", default: "undefined / null", description: "Library, map, and explorer. Controlled selection wins; defaults seed independent local state." },
      { name: "labels", type: "KnowledgeLabels", description: "Override control text, kinds.lesson and other kind keys, and statuses.active and other status keys." },
      { name: "PanelProps", type: 'Omit<PanelProps, "children" | "onSelect">', default: 'tone="neutral", variant="outlined", padding="none"', description: "All components forward native section attributes and Panel surface, corner, tone, background, loader, loading, and disabled options. Explorer defaults to variant=simple. Surface styling applies to that component's own Panel." },
    ]} />
    <PropsTable title="MemoryCard and MemoryDetail" props={[
      { name: "MemoryCard: memory", type: "MemoryRecord", description: "Required record. id/title/summary/kind are required. topic, scope, status, pinned, sources, content, relatedIds, usage, and metadata are optional." },
      { name: "MemoryCard: layout / selected / highlighted", type: '"compact" | "expanded" / boolean / boolean', default: '"expanded" / false / false', description: "Compact reduces spacing and hides retrieval counts. Selection ring and retrieval marker are independent." },
      { name: "MemoryCard: onSelect", type: "(memory: MemoryRecord) => void", description: "Adds a native selection button. No callback renders a noninteractive summary." },
      { name: "MemoryDetail: memory", type: "MemoryRecord | null", description: "Missing records render a selection prompt. content is plain text by default." },
      { name: "MemoryDetail: relatedMemories / onRelatedSelect", type: "readonly MemoryRecord[] / (id: string) => void", default: "[]", description: "Explicit related records with optional navigation; labels remain readable without a callback." },
      { name: "MemoryDetail: renderContent", type: "(memory: MemoryRecord) => ReactNode", description: "Replace plain-text full content with consumer-owned rendering." },
      { name: "onEdit / onPinChange / onArchive", type: "(memory) => void / (memory, pinned) => void / (memory) => void", description: "Card, detail, library, and explorer. Missing callbacks hide actions. Disabled components disable their action buttons. Already archived memories omit Archive." },
    ]} />
    <PropsTable title="MemoryLibrary" props={[
      { name: "memories", type: "readonly MemoryRecord[]", description: "Records to present. Default status is active when absent." },
      { name: "query / defaultQuery / onQueryChange", type: "string / string / (query) => void", default: 'undefined / ""', description: "Controlled or uncontrolled search. Whitespace-separated search terms must all match." },
      { name: "filters / defaultFilters / onFiltersChange", type: "MemoryFilters / MemoryFilters / (filters) => void", default: "undefined / {}", description: "Optional kind, status, and topic filters. Clear resets both filters and query." },
      { name: "remote", type: "boolean", default: "false", description: "Display supplied records without local search/filtering; callbacks allow the app to fetch results." },
      { name: "view / defaultView / onViewChange", type: '"cards" | "list" / "cards" | "list" / (view) => void', default: 'undefined / "cards"', description: "Controlled or uncontrolled presentation." },
      { name: "groupByTopic", type: "boolean", default: "true", description: "Group records by topic in first-appearance order; missing topics use Other." },
      { name: "highlightedIds", type: "readonly string[]", default: "[]", description: "Show a retrieval marker separately from selected memory." },
      { name: "renderMemory", type: "(memory, { selected, highlighted, select }) => ReactNode", description: "Replace default cards. Consumer owns the accessibility of custom content." },
      { name: "emptyState", type: "ReactNode", description: "Replace empty/no-results content. Loading always uses a loading state." },
    ]} />
    <PropsTable title="KnowledgeMap" props={[
      { name: "memories / points", type: "readonly MemoryRecord[] / readonly KnowledgePoint[]", description: "Points reference memoryId and finite x/y, with optional clusterId. An explicit empty points array produces an empty map." },
      { name: "relationships", type: "readonly KnowledgeRelationship[]", default: "[]", description: "id/source/target/label for explicit relations. Endpoints reference memory ids. Missing endpoints are skipped." },
      { name: "highlightedIds", type: "readonly string[]", default: "[]", description: "Additional memory rings independent of selection." },
      { name: "selectedTopic / onTopicSelect", type: "string | null / (topic: string | null) => void", description: "Topic context dims other map points. Callback enables topic filter buttons; All emits null." },
      { name: "height / glow", type: "number / boolean", default: "360 / true", description: "Canvas height in CSS pixels, minimum 120. Optional static cluster halos." },
      { name: "onDiagnostics", type: "(diagnostics: readonly KnowledgeDiagnostic[]) => void", description: "Reports duplicate ids, invalid coordinates, unknown memories, and missing relation endpoints." },
    ]} />
    <PropsTable title="KnowledgeExplorer" props={[
      { name: "memories / points / relationships", type: "MemoryRecord[] / KnowledgePoint[] / KnowledgeRelationship[] (readonly)", description: "Records and optional map geometry. Map positions remain stable while searching/filtering." },
      { name: "query / defaultQuery / onQueryChange", type: "string / string / callback", default: 'undefined / ""', description: "Shared library search and matching-map highlights." },
      { name: "filters / defaultFilters / onFiltersChange", type: "MemoryFilters / MemoryFilters / callback", default: "undefined / {}", description: "Shared library filters and map topic context." },
      { name: "trace / traceLinks", type: "TraceGraphProps / readonly MemoryTraceLink[]", default: "undefined / []", description: "TraceGraph data/options and explicit traceNodeId/memoryId links. Trace appears only with trace data or a replacement region." },
      { name: "selectedTraceId / defaultSelectedTraceId / onTraceSelectionChange", type: "string | null / string | null / callback", default: "undefined / null", description: "Controlled or uncontrolled trace selection. Selecting a trace highlights all linked memories without choosing one." },
      { name: "regions", type: "Partial<Record<KnowledgeRegion, boolean>>", description: "Hide library, map, detail, or trace by setting false. Remaining regions still work independently." },
      { name: "renderRegion", type: "Partial<Record<KnowledgeRegion, (context) => ReactNode>>", description: "Replace any enabled region. Context includes selectedMemory, selectedId/selectMemory, query/setQuery, filters/setFilters, highlightedIds, selectedTraceId/selectTrace." },
    ]} />
  </div>;
}
