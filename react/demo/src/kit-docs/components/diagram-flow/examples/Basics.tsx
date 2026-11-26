import { useState } from 'react';
import { DiagramFlow, type DiagramFlowGraph } from '@cjlapao/ui-kit';

const initial: DiagramFlowGraph = {
  nodes: [
    { id: 'start', title: 'Start', position: { x: 0, y: 0 }, tone: 'blue' },
    { id: 'review', title: 'Review', position: { x: 260, y: 0 }, status: 'running', progress: .6 },
  ],
  connections: [{ id: 'start-review', sourceId: 'start', targetId: 'review', outcome: 'unknown' }],
};
export default function Basics() {
  const [graph, setGraph] = useState(initial);
  return <DiagramFlow graph={graph} onChange={setGraph} autoCreate variant="outlined" tone="blue" height={360} />;
}
