import type { TraceGraphEdge, TraceGraphNode } from "@cjlapao/ui-kit";

/** Agentic turns: two parallel agents, tool calls, then an explicit merge. */
export function createTraceFixture(turns: number) {
  const nodes: TraceGraphNode[] = [{ id: "origin", label: "Conversation starts", time: 0, lane: "orchestrator", tone: "violet" }];
  const edges: TraceGraphEdge[] = [];
  let previous = "origin";
  const add = (id: string, label: string, lane: string, tone: string, parents: string[]) => {
    nodes.push({ id, label, lane, tone, time: nodes.length * 1000,
      metadata: { turn: Math.ceil(nodes.length / 7), kind: lane === "orchestrator" ? "turn" : "agent/tool", duration: `${120 + nodes.length * 13 % 800}ms` } });
    for (const source of parents) edges.push({ id: `${source}:${id}`, source, target: id, tone });
    return id;
  };
  for (let turn = 1; turn <= turns; turn++) {
    const start = add(`turn-${turn}`, `Turn ${turn}`, "orchestrator", "violet", [previous]);
    const plan = add(`planner-${turn}`, "Planner agent", "planner", "cyan", [start]);
    const code = add(`coder-${turn}`, "Coder agent", "coder", "amber", [start]);
    const search = add(`search-${turn}`, "Search repository", "planner", "cyan", [plan]);
    const read = add(`read-${turn}`, "Read files", "coder", "amber", [code]);
    const test = add(`test-${turn}`, "Run tests", "coder", "emerald", [read]);
    previous = add(`merge-${turn}`, `Turn ${turn} complete`, "orchestrator", "violet", [search, test]);
  }
  return { nodes, edges };
}
