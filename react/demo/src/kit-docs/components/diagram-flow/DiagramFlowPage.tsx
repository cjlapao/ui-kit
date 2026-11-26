import { useState } from 'react';
import { DiagramFlow, type DiagramFlowGraph, type DiagramFlowPanelProps } from '@cjlapao/ui-kit';
import { PageHeader } from '../../shared/PageHeader';

const initial: DiagramFlowGraph = {
  nodes: [
    { id: 'a', title: 'A · Start', subtitle: 'Ready to build', position: { x: 0, y: 0 }, status: 'succeeded', tone: 'emerald', progress: 1 },
    { id: 'b', title: 'B · Route', position: { x: 260, y: 0 }, status: 'running', dotStepper: { currentIndex: 2, tone: 'blue', steps: [
      { id: 'prepare', title: 'Prepare' }, { id: 'build', title: 'Build' }, { id: 'verify', title: 'Verify' }, { id: 'publish', title: 'Publish' },
    ] } },
    { id: 'e', title: 'E · Optional', subtitle: 'Parallel checks', position: { x: 520, y: 160 }, status: 'running', tone: 'amber', itemProgress: 'bar', maxItems: 2, items: [
      { id: 'lint', title: 'Lint', status: 'succeeded', progress: 1 },
      { id: 'test', title: 'Tests', status: 'running', progress: .65 },
      { id: 'audit', title: 'Audit', status: 'pending' },
    ] },
    { id: 'c', title: 'C · Join', position: { x: 800, y: 0 }, join: 'all', joinReady: false },
    { id: 'c1', title: 'C1 · Prepare', parentId: 'c', position: { x: 800, y: 160 } },
    { id: 'c2', title: 'C2 · Verify', parentId: 'c', position: { x: 800, y: 300 }, tone: 'violet', status: 'running', progress: .6, progressType: 'spinner' },
    { id: 'c3', title: 'C3 · Finish', parentId: 'c', position: { x: 800, y: 440 } },
    { id: 'd', title: 'D · Publish', position: { x: 1100, y: 0 } },
  ],
  connections: [
    { id: 'ab', sourceId: 'a', targetId: 'b', outcome: 'success', animated: true },
    { id: 'bc', sourceId: 'b', targetId: 'c', outcome: 'success', conditionLabel: 'direct' },
    { id: 'be', sourceId: 'b', targetId: 'e', outcome: 'success', conditionLabel: 'optional', animated: true },
    { id: 'ec', sourceId: 'e', targetId: 'c', outcome: 'success' },
    { id: 'cc1', sourceId: 'c', targetId: 'c1', outcome: 'success' },
    { id: 'c1c2', sourceId: 'c1', targetId: 'c2', outcome: 'success' },
    { id: 'c2c3', sourceId: 'c2', targetId: 'c3', outcome: 'success' },
    { id: 'retry', sourceId: 'c2', targetId: 'c1', outcome: 'failure', label: 'retry' },
    { id: 'c3d', sourceId: 'c3', targetId: 'd', outcome: 'success' },
  ],
};
export default function DiagramFlowPage() {
  const [graph, setGraph] = useState(initial);
  const [lastAction, setLastAction] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [autoCreate, setAutoCreate] = useState(false);
  const [panel, setPanel] = useState<DiagramFlowPanelProps>({ variant: 'outlined', tone: 'none', padding: 'sm' });
  return <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-6 px-4 py-8 sm:px-8">
    <PageHeader name="Diagram Flow" description="Edit explicit workflow branches, joins, nested sequences and retry paths. The application owns conditions and execution state." />
    <p className="text-sm text-neutral-500">Hover over a step and drag a port to another step. Enable auto-create to drop a new step into empty space. Select a step to resize it, or select a connection to change its outcome or drag either endpoint.</p>
    <p className="text-sm text-neutral-500">Set a node’s <code>dotStepper</code> to the same props as DotStepper, including <code>steps</code> and <code>currentIndex</code>. Progress is application-owned; provide <code>onStepSelect</code> for interactive dots.</p>
    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700 dark:text-neutral-200">
      <label>Node variant <select className="ml-2 rounded border px-2 py-1 dark:bg-neutral-900" value={panel.variant} onChange={event => setPanel(current => ({ ...current, variant: event.target.value as DiagramFlowPanelProps['variant'] }))}>{['outlined', 'tonal', 'elevated', 'subtle', 'glass'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Node tone <select className="ml-2 rounded border px-2 py-1 dark:bg-neutral-900" value={panel.tone} onChange={event => setPanel(current => ({ ...current, tone: event.target.value as DiagramFlowPanelProps['tone'] }))}>{['none', 'blue', 'emerald', 'amber', 'rose'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Node padding <select className="ml-2 rounded border px-2 py-1 dark:bg-neutral-900" value={panel.padding} onChange={event => setPanel(current => ({ ...current, padding: event.target.value as DiagramFlowPanelProps['padding'] }))}>{['none', 'sm', 'md', 'lg'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={readOnly} onChange={event => setReadOnly(event.target.checked)} />Read only</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={autoCreate} onChange={event => setAutoCreate(event.target.checked)} />Auto-create nodes</label>
    </div>
    <DiagramFlow graph={graph} onChange={setGraph} height={680} nodePanelProps={panel} readOnly={readOnly} autoCreate={autoCreate}
      onNodeClick={node => setLastAction(`Selected ${node.title}`)}
      onConnectionClick={edge => setLastAction(`Selected ${edge.outcome} connection`)}
      onConnect={edge => setLastAction(`Connected ${edge.sourceId} to ${edge.targetId}`)}
      onReconnect={(previous, next) => setLastAction(`Changed ${previous.id}: ${next.sourceId} to ${next.targetId}`)}
      onNodeEdit={node => { const title = window.prompt('Step title', node.title); if (title?.trim()) setGraph(current => ({ ...current, nodes: current.nodes.map(n => n.id === node.id ? { ...n, title: title.trim() } : n) })); }}
      onConnectionEdit={edge => { const conditionLabel = window.prompt('Condition label', edge.conditionLabel ?? ''); if (conditionLabel !== null) setGraph(current => ({ ...current, connections: current.connections.map(e => e.id === edge.id ? { ...e, conditionLabel } : e) })); }} />
    <p className="text-sm text-neutral-500" aria-live="polite">{lastAction}</p>
    <button type="button" className="self-start rounded border px-3 py-1 text-sm" onClick={() => setGraph(initial)}>Reset diagram</button>
  </div>;
}
