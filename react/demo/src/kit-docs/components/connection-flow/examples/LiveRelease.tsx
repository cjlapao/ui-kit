import { useEffect, useMemo, useState } from "react";
import { Button, ConnectionFlow, type ConnectionFlowNode, type ConnectionFlowFollowMode, type ConnectionFlowStatus } from "@cjlapao/ui-kit";

const stages: { label: string; active: string[]; failed?: string[] }[] = [
  { label: "Discover workspace", active: ["discover"] },
  { label: "Plan release", active: ["plan"] },
  { label: "Approve plan", active: ["approve-plan"] },
  { label: "Fetch dependencies", active: ["fetch"] },
  { label: "Compile application", active: ["compile"] },
  { label: "Unit tests and lint in parallel", active: ["unit", "lint"] },
  { label: "Integration tests and dependency scan", active: ["integration", "scan"] },
  { label: "Integration failed — retry required", active: [], failed: ["integration"] },
  { label: "Rebuild after integration failure", active: ["compile"] },
  { label: "Rerun unit and integration tests", active: ["unit", "integration"] },
  { label: "Package Linux and macOS artifacts", active: ["linux", "mac"] },
  { label: "Deploy staging", active: ["staging"] },
  { label: "Smoke tests and security review", active: ["smoke", "security"] },
  { label: "Approve production", active: ["approve-prod"] },
  { label: "Deploy production", active: ["production"] },
  { label: "Monitor rollout", active: ["monitor"] },
  { label: "Release complete", active: [] },
];

const template: ConnectionFlowNode[] = [
  { id: "discover", title: "Discover workspace", icon: "Search" },
  { id: "plan", title: "Plan release", icon: "Blueprint" },
  { id: "approve-plan", title: "Approve plan", subtitle: "Human gate", icon: "Verified" },
  { id: "build", title: "Build and validate", subtitle: "Nested execution ladder", icon: "Docker", childLayout: "chain", rows: [
    [{ id: "fetch", title: "Fetch dependencies", icon: "Download" }],
    [{ id: "compile", title: "Compile application", icon: "Cog" }],
    [{ id: "unit", title: "Unit tests", icon: "CheckCircle" }, { id: "lint", title: "Lint", icon: "Clean" }],
    [{ id: "integration", title: "Integration tests", icon: "Bug", failure: { to: "compile", label: "Rebuild and retry" } }, { id: "scan", title: "Dependency scan", icon: "Search" }],
  ] },
  { id: "linux", title: "Package Linux", subtitle: "Artifact build", kind: "parallel", group: "packages", icon: "Folder" },
  { id: "mac", title: "Package macOS", subtitle: "Signed artifact", kind: "parallel", group: "packages", icon: "Apple" },
  { id: "staging", title: "Deploy staging", icon: "Rocket" },
  { id: "smoke", title: "Smoke tests", kind: "parallel", group: "checks", icon: "CheckCircle" },
  { id: "security", title: "Security review", kind: "parallel", group: "checks", icon: "Key" },
  { id: "approve-prod", title: "Approve production", subtitle: "Release gate", icon: "Verified" },
  { id: "production", title: "Deploy production", icon: "Rocket" },
  { id: "monitor", title: "Monitor rollout", icon: "Search", terminal: true },
];

export default function LiveRelease() {
  const [stage, setStage] = useState(0), [playing, setPlaying] = useState(false);
  const [interval, setIntervalMs] = useState(2500);
  const [follow, setFollow] = useState<ConnectionFlowFollowMode>("following");
  const finished = stage === stages.length - 1;
  useEffect(() => {
    if (!playing || finished) return;
    const timer = window.setTimeout(() => setStage(value => value + 1), interval);
    return () => window.clearTimeout(timer);
  }, [playing, finished, stage, interval]);

  const nodes = useMemo(() => {
    const statuses = new Map<string, ConnectionFlowStatus>();
    for (let i = 0; i <= stage; i++) {
      for (const id of stages[i].active) statuses.set(id, i === stage ? "running" : "succeeded");
      for (const id of stages[i].failed ?? []) statuses.set(id, "failed");
    }
    const paint = (node: ConnectionFlowNode): ConnectionFlowNode => ({
      ...node, status: statuses.get(node.id) ?? "pending",
      progress: statuses.get(node.id) === "succeeded" ? 1 : statuses.get(node.id) === "running" ? .5 : 0,
      rows: node.rows?.map(row => row.map(paint)),
    });
    return template.map(paint);
  }, [stage]);

  return <div className="w-full space-y-4">
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" onClick={() => {
        if (finished) setStage(0);
        if (!playing || finished) setFollow("following");
        setPlaying(value => finished || !value);
      }}>{playing && !finished ? "Pause playback" : finished ? "Replay release" : "Play release"}</Button>
      <Button size="sm" variant="outline" disabled={finished} onClick={() => { setPlaying(false); setStage(value => value + 1); }}>Next step</Button>
      <Button size="sm" variant="outline" onClick={() => { setPlaying(false); setStage(0); setFollow("following"); }}>Restart</Button>
      <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">Step duration
        <select className="rounded-md border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900" value={interval} onChange={event => setIntervalMs(Number(event.target.value))}>
          <option value={1000}>1 second</option><option value={2500}>2.5 seconds</option><option value={5000}>5 seconds</option>
        </select>
      </label>
    </div>
    <p role="status" className="text-sm text-neutral-600 dark:text-neutral-300">
      {stage + 1} / {stages.length} · {stages[stage].label} · Follow: {follow}
    </p>
    <ConnectionFlow nodes={nodes} autoState height={480} minZoom={.08} title="Live release simulation"
      subtitle="Parallel agents, nested validation, retries and production rollout"
      progress={stage / (stages.length - 1)} activeNodeIds={stages[stage].active}
      followMode={follow} onFollowModeChange={setFollow} followDuration={500} followPadding={48} />
    <p className="text-xs text-neutral-500 dark:text-neutral-400">Playback changes node statuses; it never executes real work. Drag or zoom to pause the camera while playback continues. Resume following from the graph controls. At the failed step, the camera holds its last view so you can inspect the retry path.</p>
  </div>;
}
