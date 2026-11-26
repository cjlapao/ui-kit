import { useState } from 'react';
import { DiagramFlow, type DiagramFlowGraph } from '@cjlapao/ui-kit';

const initial: DiagramFlowGraph = {
  nodes: [
    { id: 'build', title: 'Build', position: { x: 0, y: 0 }, width: 240, height: 160, status: 'running', data: { environment: 'Staging' } },
    { id: 'deploy', title: 'Deploy', position: { x: 340, y: 0 }, width: 200, height: 100 },
  ],
  connections: [{ id: 'build-deploy', sourceId: 'build', targetId: 'deploy', outcome: 'success' }],
};

export default function CustomBody() {
  const [graph, setGraph] = useState(initial);
  const [count, setCount] = useState(0);
  return <DiagramFlow graph={graph} onChange={setGraph} height={320} renderNodeBody={node => {
    if (node.id !== 'build') return undefined;
    const data = node.data as { environment: string };
    return <div className="space-y-2 text-xs">
      <p>Environment: {data.environment}</p>
      <button type="button" className="rounded border border-blue-400 px-2 py-1 text-blue-600 dark:text-blue-300" onClick={() => setCount(value => value + 1)}>Retry checks ({count})</button>
    </div>;
  }} />;
}
