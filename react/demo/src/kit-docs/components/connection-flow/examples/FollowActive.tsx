import { useState } from "react";
import { Button, ConnectionFlow, type ConnectionFlowFollowMode } from "@cjlapao/ui-kit";

const phases = [["plan"], ["code", "scan"], ["review"], ["ship"]];
export default function FollowActive() {
  const [phase, setPhase] = useState(0);
  const [follow, setFollow] = useState<ConnectionFlowFollowMode>("following");
  const active = phases[phase];
  return <div className="w-full space-y-3">
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={() => setPhase(value => (value + 1) % phases.length)}>Advance activity</Button>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">Active: {active.join(", ")} · Follow: {follow}</span>
    </div>
    <ConnectionFlow height={360} minZoom={0.1} followMode={follow} onFollowModeChange={setFollow} activeNodeIds={active}
      nodes={["plan", "code", "scan", "review", "ship"].map(id => ({ id, title: id, status: active.includes(id) ? "running" : "pending" }))} />
    <p className="text-xs text-neutral-500 dark:text-neutral-400">Advance activity to frame one or two cards. Drag or zoom to pause; use Resume following to return.</p>
  </div>;
}
