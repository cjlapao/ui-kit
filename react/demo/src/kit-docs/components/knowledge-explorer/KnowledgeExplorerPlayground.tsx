import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import type { SurfaceTone, SurfaceVariant } from "@cjlapao/ui-kit";
import { useState } from "react";
import { KnowledgeExplorer, type KnowledgeRegion, type MemoryRecord, type PanelLoaderType } from "@cjlapao/ui-kit";
import { ChoiceControl } from "../../shared/PlaygroundPanel";
import { panelLoaderTypeOptions, surfaceVariantOptions } from "../../shared/options";
import { memories, nodes, edges, points, traceLinks } from "./examples/data";

export function KnowledgeExplorerPlayground() {
  const [surfaceTone, setSurfaceTone] = useState<SurfaceTone>("none");
  const [variant, setVariant] = useState<SurfaceVariant>("simple");
  const [regions, setRegions] = useState<Record<KnowledgeRegion, boolean>>({ library: true, map: true, detail: true, trace: false });
  const [projected, setProjected] = useState(false), [customDetail, setCustomDetail] = useState(false);
  const [selectedId, select] = useState<string | null>("refresh");
  const [records, setRecords] = useState<MemoryRecord[]>(memories);
  const [state, setState] = useState("ready");
  const [loaderType, setLoaderType] = useState<PanelLoaderType>("spinner");
  return <section className="w-full rounded-xl border border-neutral-200 p-5 text-neutral-800 dark:border-neutral-800 dark:text-neutral-200">
    <div className="mb-5 flex flex-wrap items-center gap-4 text-xs">
      <strong className="uppercase tracking-widest">Playground</strong>
      {(["library", "map", "detail", "trace"] as const).map(region => <label key={region} className="flex items-center gap-2"><input type="checkbox" checked={regions[region]} onChange={event => setRegions({ ...regions, [region]: event.target.checked })} />{region}</label>)}
      <label className="flex items-center gap-2"><input type="checkbox" checked={projected} onChange={event => setProjected(event.target.checked)} />Supplied coordinates</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={customDetail} onChange={event => setCustomDetail(event.target.checked)} />Replace detail</label>
      <label>State <select className="rounded border bg-transparent p-1" value={state} onChange={event => setState(event.target.value)}><option value="ready">Ready</option><option value="loading">Loading</option><option value="empty">Empty</option></select></label>
    </div>
    <div className="mb-4 grid gap-4 sm:grid-cols-2"><ChoiceControl label="Surface variant" options={surfaceVariantOptions} value={variant} onChange={value => setVariant(value as SurfaceVariant)} /><SurfaceToneControl value={surfaceTone} onChange={setSurfaceTone} /></div>
    {state === "loading" && <div className="mb-4"><ChoiceControl label="Loader type" options={panelLoaderTypeOptions} value={loaderType} onChange={value => setLoaderType(value as PanelLoaderType)} /></div>}
    <KnowledgeExplorer tone={surfaceTone} variant={variant} loaderType={loaderType} memories={state === "empty" ? [] : records} points={projected ? points : undefined} regions={regions} loading={state === "loading"} selectedId={selectedId} onSelectionChange={select}
      trace={{ nodes, edges, height: 260, animation: false }} traceLinks={traceLinks}
      relationships={[{ id: "replaces", source: "refresh", target: "legacy", label: "replaces" }]}
      onPinChange={(record, pinned) => setRecords(current => current.map(memory => memory.id === record.id ? { ...memory, pinned } : memory))}
      onArchive={record => setRecords(current => current.map(memory => memory.id === record.id ? { ...memory, status: "archived" } : memory))}
      renderRegion={customDetail ? { detail: ({ selectedMemory, selectMemory }) => <div className="rounded-xl border border-cyan-500/40 p-6"><p className="text-xs uppercase tracking-widest opacity-60">Your own detail region</p><h3 className="my-3 text-lg">{selectedMemory?.title ?? "Select a memory"}</h3><p className="text-sm opacity-70">{selectedMemory?.content ?? selectedMemory?.summary}</p><button type="button" className="mt-4 text-sm underline" onClick={() => selectMemory(null)}>Clear selection</button></div> } : undefined} />
  </section>;
}
