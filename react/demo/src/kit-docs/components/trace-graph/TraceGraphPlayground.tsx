import { useEffect, useMemo, useRef, useState } from "react";
import { ColorSwatches, TraceGraph, type TraceGraphProps, type TraceGraphHandle, type TraceGraphNode, type TraceFollowMode, type TraceGraphLayout, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { ChoiceControl, Control, PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
import { surfaceVariantOptions } from "../../shared/options";
import { createTraceFixture } from "./fixture";

export function TraceGraphPlayground() {
  const ref = useRef<TraceGraphHandle>(null);
  const [layout, setLayout] = useState<TraceGraphLayout>("dependency");
  const [turns, setTurns] = useState(6), [count, setCount] = useState(12);
  const [playing, setPlaying] = useState(false), [follow, setFollow] = useState<TraceFollowMode>("off");
  const [animation, setAnimation] = useState(true), [glow, setGlow] = useState<"all" | "active" | "none">("all"), [showLabels, setShowLabels] = useState(true);
  const [corner, setCorner] = useState<TraceGraphProps["corner"]>("auto"), [padding, setPadding] = useState<TraceGraphProps["padding"]>("none");
  const [untinted, setUntinted] = useState(false);
  const [junctionGlowIntensity, setJunctionGlowIntensity] = useState(1);
  const [sparkles, setSparkles] = useState(true), [sparkleIntensity, setSparkleIntensity] = useState(1), [sparkleSpeed, setSparkleSpeed] = useState(1), [pulseScale, setPulseScale] = useState(2.5);
  const [fallback, setFallback] = useState(false), [backend, setBackend] = useState("");
  const [tone, setTone] = useState<TrueColor>("violet"), [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [selected, setSelected] = useState<TraceGraphNode | null>(null);
  const [diagnostics, setDiagnostics] = useState(0);
  const fixture = useMemo(() => createTraceFixture(turns), [turns]);
  const data = useMemo(() => {
    const nodes = fixture.nodes.slice(0, count), ids = new Set(nodes.map(node => node.id));
    const edges = fixture.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target));
    const parents = new Set(edges.map(edge => edge.source));
    const active = nodes.filter(node => !parents.has(node.id));
    const activeIds = new Set(active.map(node => node.id));
    return { nodes: nodes.map(node => ({ ...node, status: activeIds.has(node.id) ? "running" as const : "done" as const })),
      edges: edges.map(edge => ({ ...edge, status: activeIds.has(edge.target) ? "running" as const : "done" as const })) };
  }, [fixture, count]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setCount(value => Math.min(fixture.nodes.length, value + 1)), 850);
    return () => window.clearInterval(timer);
  }, [playing, fixture.nodes.length]);

  return <PlaygroundPanel controls={<div className="space-y-4">
    <ChoiceControl label="Layout" options={[{ label: "Dependencies", value: "dependency" }, { label: "Timeline", value: "timeline" }]} value={layout} onChange={value => setLayout(value as TraceGraphLayout)} />
    <ChoiceControl label="History size" options={[{ label: "6 turns · 43 points", value: "6" }, { label: "100 turns · 701 points", value: "100" }, { label: "400 turns · 2,801 points", value: "400" }]}
      value={String(turns)} onChange={value => { const next = Number(value); setTurns(next); setCount(next * 7 + 1); setPlaying(false); setFollow("off"); setSelected(null); }} />
    <ChoiceControl label="Surface" options={surfaceVariantOptions} value={variant} onChange={value => setVariant(value as SurfaceVariant)} />
    <Control label="Tone"><ColorSwatches selectable size="sm" value={tone} onSelect={setTone} /></Control>
    <ToggleRow label="Tone: none (untinted)" checked={untinted} onChange={setUntinted} />
    <ChoiceControl label="Corner" options={["auto", "none", "rounded", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl"].map(value => ({ label: value, value }))} value={corner ?? "auto"} onChange={value => setCorner(value as TraceGraphProps["corner"])} />
    <ChoiceControl label="Padding" options={["none", "xs", "sm", "md", "lg"].map(value => ({ label: value, value }))} value={padding ?? "none"} onChange={value => setPadding(value as TraceGraphProps["padding"])} />
    <ToggleRow label="Play live events" checked={playing} onChange={value => { setPlaying(value); if (value && count >= fixture.nodes.length) setCount(1); if (value) setFollow("following"); }} />
    <ToggleRow label="Animation" checked={animation} onChange={setAnimation} />
    <ChoiceControl label="Glow" options={["all", "active", "none"].map(value => ({ label: value, value }))} value={glow} onChange={value => setGlow(value as "all" | "active" | "none")} />
    <Control label={`Junction glow intensity · ${junctionGlowIntensity}`}><input aria-label="Junction glow intensity" className="w-full" type="range" min="0" max="3" step="0.1" value={junctionGlowIntensity} onChange={event => setJunctionGlowIntensity(Number(event.target.value))} /></Control>
    <ToggleRow label="Activity pulses" checked={sparkles} onChange={setSparkles} />
    <Control label={`Spark intensity · ${sparkleIntensity}`}><input aria-label="Spark intensity" className="w-full" type="range" min="0" max="3" step="0.1" value={sparkleIntensity} onChange={event => setSparkleIntensity(Number(event.target.value))} /></Control>
    <Control label={`Spark speed · ${sparkleSpeed}×`}><input aria-label="Spark speed" className="w-full" type="range" min="0" max="4" step="0.1" value={sparkleSpeed} onChange={event => setSparkleSpeed(Number(event.target.value))} /></Control>
    <Control label={`Pulse size · ${Math.round(pulseScale * 100)}% of dot`}><input aria-label="Pulse size" className="w-full" type="range" min="0" max="6" step="0.1" value={pulseScale} onChange={event => setPulseScale(Number(event.target.value))} /></Control>
    <ToggleRow label="Labels on zoom" checked={showLabels} onChange={setShowLabels} />
    <ToggleRow label="Force Canvas fallback" checked={fallback} onChange={setFallback} />
    <button type="button" className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
      onClick={() => { setPlaying(false); setCount(1); setFollow("following"); setSelected(null); }}>Restart at origin</button>
  </div>} preview={<div className="w-full space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
      <span>{data.nodes.length.toLocaleString()} points · {data.edges.length.toLocaleString()} connections</span>
      <span>{backend || "initializing"} · Follow: {follow}{diagnostics ? ` · ${diagnostics} diagnostics` : ""}</span>
    </div>
    <div className="rounded-2xl bg-gradient-to-br from-violet-50/40 via-white to-cyan-50/30 dark:from-violet-950/30 dark:via-neutral-950 dark:to-cyan-950/20">
      <TraceGraph key={`${turns}-${layout}`} ref={ref} {...data} layout={layout} height={440} variant={variant} tone={untinted ? "none" : tone} corner={corner} padding={padding}
        followMode={follow} onFollowModeChange={setFollow} animation={animation} glow={glow} showLabels={showLabels}
        sparkles={sparkles} sparkleIntensity={sparkleIntensity} sparkleSpeed={sparkleSpeed} pulseScale={pulseScale}
        junctionGlowIntensity={junctionGlowIntensity}
        renderer={fallback ? "canvas" : "auto"} onRendererChange={setBackend}
        onDiagnostics={items => setDiagnostics(items.length)}
        onNodeSelect={setSelected} onEdgeSelect={edge => { if (edge) setSelected({ id: edge.id, label: `${edge.source} → ${edge.target}`, metadata: edge }); }}
        renderNodeTooltip={node => <span className="font-medium">{node.label} · {node.status}</span>}
        renderNodePopover={node => <div className="space-y-2"><strong>{node.label}</strong><p>Consumer-provided details for {node.id}.</p><pre className="whitespace-pre-wrap text-xs">{JSON.stringify(node.metadata, null, 2)}</pre></div>} />
    </div>
    <div className="rounded-lg border border-neutral-200 p-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
      <strong className="text-xs uppercase tracking-wider">External details panel</strong>
      <p className="mt-2">{selected ? selected.label ?? selected.id : "Select a point or connection. Zoom in for labels; drag to pause follow mode."}</p>
      {selected && <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(selected.metadata, null, 2)}</pre>}
    </div>
  </div>} />;
}
