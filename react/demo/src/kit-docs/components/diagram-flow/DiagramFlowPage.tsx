import { useState } from 'react';
import { DiagramFlow, type DiagramFlowGraph, type DiagramFlowPanelProps, type DiagramFlowProps, type DiagramFlowGridProps, type SurfaceTone, type SurfaceVariant, type SurfaceCorner, type GlassOpacity, type GlassVibrancy } from '@cjlapao/ui-kit';
import { PageHeader } from '../../shared/PageHeader';
import { PlaygroundPanel, SelectControl, ToggleRow } from '../../shared/PlaygroundPanel';
import { SurfaceToneControl } from '../../shared/SurfaceToneControl';
import { ControlAccordion } from '../../shared/ControlAccordion';
import { surfaceVariantOptions, panelCornerOptions } from '../../shared/options';
import { PropsTable, A11ySection, A11yTopic, KeyboardSupportTable, C } from '../../shared/A11ySections';
import { ExampleCard } from '../../shared/ExampleCard';
import Basics from './examples/Basics';
import basicsCode from './examples/Basics.tsx?raw';

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
  const [animated, setAnimated] = useState(true);
  const [variant, setVariant] = useState<SurfaceVariant>('outlined');
  const [tone, setTone] = useState<SurfaceTone>('none');
  const [corner, setCorner] = useState<SurfaceCorner>('rounded-md');
  const [opacity, setOpacity] = useState<GlassOpacity>('frosted');
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>('medium');
  const [raisedSurface, setRaisedSurface] = useState(false);
  const [padding, setPadding] = useState<DiagramFlowProps['padding']>('none');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [grid, setGrid] = useState<DiagramFlowGridProps>({ pattern: 'dots', lineColor: '#a3a3a3', dotSize: .7, opacity: .7, fade: 'none', fadeStart: 15 });
  const [panel, setPanel] = useState<DiagramFlowPanelProps>({ variant: 'outlined', tone: 'none', padding: 'sm' });
  return <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="Diagram Flow" description="Edit workflow diagrams with branches, joins, nested steps, failure loops and application-owned conditions. Real Panel surfaces surround a scrollable canvas." />
    <PlaygroundPanel previewClassName="min-w-0" controls={<ControlAccordion groups={[
      { id: 'surface', title: 'Diagram surface', controls: <>
        <SelectControl label="Variant" value={variant} options={surfaceVariantOptions} onChange={value => setVariant(value as SurfaceVariant)} />
        <SurfaceToneControl value={tone} onChange={setTone} />
        <SelectControl label="Corner" value={corner} options={panelCornerOptions} onChange={value => setCorner(value as SurfaceCorner)} />
        <SelectControl label="Glass opacity" value={String(opacity)} options={['clear', 'frosted', 'light'].map(value => ({ label: value, value }))} onChange={value => setOpacity(value as GlassOpacity)} />
        <SelectControl label="Vibrancy" value={String(vibrancy)} options={['low', 'medium', 'high'].map(value => ({ label: value, value }))} onChange={value => setVibrancy(value as GlassVibrancy)} />
        <SelectControl label="Padding" value={padding ?? 'none'} options={['none', 'xs', 'sm', 'md', 'lg', 'xl'].map(value => ({ label: value, value }))} onChange={value => setPadding(value as DiagramFlowProps['padding'])} />
        <ToggleRow label="Raised surface" checked={raisedSurface} onChange={setRaisedSurface} />
        <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
        <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
      </> },
      { id: 'grid', title: 'Grid background', controls: <>
        <ToggleRow label="Show grid" checked={showGrid} onChange={setShowGrid} />
        <SelectControl label="Snap spacing" value={String(gridSize)} options={[10, 20, 30, 40].map(value => ({ label: `${value}px`, value: String(value) }))} onChange={value => setGridSize(Number(value))} />
        <SelectControl label="Pattern" value={grid.pattern ?? 'dots'} options={['dots', 'grid'].map(value => ({ label: value, value }))} onChange={value => setGrid(current => ({ ...current, pattern: value as DiagramFlowGridProps['pattern'] }))} />
        <SelectControl label="Color" value={grid.lineColor ?? '#a3a3a3'} options={[['Neutral', '#a3a3a3'], ['Blue', '#3b82f6'], ['Emerald', '#10b981'], ['Violet', '#8b5cf6']].map(([label, value]) => ({ label, value }))} onChange={value => setGrid(current => ({ ...current, lineColor: value }))} />
        <SelectControl label="Dot radius" value={String(grid.dotSize ?? .7)} options={[.5, .7, 1, 1.5, 2].map(value => ({ label: String(value), value: String(value) }))} onChange={value => setGrid(current => ({ ...current, dotSize: Number(value) }))} />
        <SelectControl label="Opacity" value={String(grid.opacity ?? .7)} options={[.2, .4, .7, 1].map(value => ({ label: String(value), value: String(value) }))} onChange={value => setGrid(current => ({ ...current, opacity: Number(value) }))} />
        <SelectControl label="Fade" value={grid.fade ?? 'none'} options={['none', 'radial', 'vertical'].map(value => ({ label: value, value }))} onChange={value => setGrid(current => ({ ...current, fade: value as DiagramFlowGridProps['fade'] }))} />
        <SelectControl label="Fade start" value={String(grid.fadeStart ?? 15)} options={[0, 15, 30, 50, 75].map(value => ({ label: `${value}%`, value: String(value) }))} onChange={value => setGrid(current => ({ ...current, fadeStart: Number(value) }))} />
      </> },
      { id: 'nodes', title: 'Nodes and editing', controls: <>
        <SelectControl label="Node variant" value={panel.variant ?? 'outlined'} options={surfaceVariantOptions} onChange={value => setPanel(current => ({ ...current, variant: value as DiagramFlowPanelProps['variant'] }))} />
        <SurfaceToneControl label="Node tone" value={panel.tone ?? 'none'} onChange={value => setPanel(current => ({ ...current, tone: value }))} />
        <SelectControl label="Node padding" value={panel.padding ?? 'sm'} options={['none', 'xs', 'sm', 'md', 'lg', 'xl'].map(value => ({ label: value, value }))} onChange={value => setPanel(current => ({ ...current, padding: value as DiagramFlowPanelProps['padding'] }))} />
        <ToggleRow label="Read only" checked={readOnly} onChange={setReadOnly} />
        <ToggleRow label="Auto-create nodes" checked={autoCreate} onChange={setAutoCreate} />
        <ToggleRow label="Animate connections" checked={animated} onChange={setAnimated} />
      </> },
    ]} />} preview={<div className="w-full min-w-0 space-y-3">
      <DiagramFlow graph={graph} onChange={setGraph} height={620} gridSize={gridSize} grid={showGrid ? grid : false} nodePanelProps={panel} readOnly={readOnly} autoCreate={autoCreate} animated={animated} variant={variant} tone={tone} corner={corner} glassOpacity={opacity} vibrancy={vibrancy} raisedSurface={raisedSurface} padding={padding} disabled={disabled} loading={loading}
        onNodeClick={node => setLastAction(`Selected ${node.title}`)}
        onConnectionClick={edge => setLastAction(`Selected ${edge.outcome} connection`)}
        onConnect={edge => setLastAction(`Connected ${edge.sourceId} to ${edge.targetId}`)}
        onReconnect={(previous, next) => setLastAction(`Changed ${previous.id}: ${next.sourceId} to ${next.targetId}`)}
        onNodeEdit={node => { const title = window.prompt('Step title', node.title); if (title?.trim()) setGraph(current => ({ ...current, nodes: current.nodes.map(n => n.id === node.id ? { ...n, title: title.trim() } : n) })); }}
        onConnectionEdit={edge => { const conditionLabel = window.prompt('Condition label', edge.conditionLabel ?? ''); if (conditionLabel !== null) setGraph(current => ({ ...current, connections: current.connections.map(e => e.id === edge.id ? { ...e, conditionLabel } : e) })); }} />
      <p className="text-xs text-neutral-500" aria-live="polite">{lastAction || 'Select a node or connection to inspect it.'}</p>
      <button type="button" className="rounded border px-3 py-1 text-sm" onClick={() => setGraph(initial)}>Reset diagram</button>
    </div>} />
    <section className="flex flex-col gap-5"><h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Controlled editing" description="The application owns the graph. Enable auto-create to add a connected node by dropping a connector in empty space." code={basicsCode} filename="Basics.tsx"><Basics /></ExampleCard>
    </section>
    <PropsTable props={[
      { name: 'graph / onChange', type: 'DiagramFlowGraph / (graph, operation) => void', description: 'Controlled nodes and connections. Each edit emits a validated graph and an atomic operation; the application persists the result.' },
      { name: 'variant / tone / corner / padding', type: 'PanelProps', default: 'outlined / none / Panel default / none', description: 'The outer canvas is a Panel. Surface options, including glass opacity, vibrancy, raisedSurface, loading and disabled, are forwarded to it. DiagramFlow owns the content, click behavior and scrolling; height and size configure the diagram.' },
      { name: 'grid', type: 'boolean | DiagramFlowGridProps', default: 'true', description: 'Show or customize the GridBackground pattern, color, dot radius, opacity and fade. Lattice spacing always follows gridSize and scales with the diagram.' },
      { name: 'nodePanelProps / node.panelProps / node.tone', type: 'DiagramFlowPanelProps / DiagramFlowPanelProps / TrueColor', description: 'Set shared node Panel options and override them per node. DiagramFlow owns interaction and positioning handlers.' },
      { name: 'readOnly / autoCreate', type: 'boolean / boolean', default: 'false / false', description: 'Read-only disables editing. Auto-create adds one node and connection when a connector is dropped in clear space.' },
      { name: 'onNodeClick / onConnectionClick / onNodeCreate / onConnect / onReconnect', type: 'callbacks', description: 'Report node and connection selection, node creation, new connections and endpoint changes. Changes also flow through onChange.' },
      { name: 'onNodeEdit / onConnectionEdit', type: 'callbacks', description: 'Request an application-owned editor on double-click.' },
      { name: 'height / gridSize / node.width / node.height', type: 'number', default: '560 / 20 / 180 / measured', description: 'Viewport height and snap spacing; nodes can also specify width and height in canvas pixels.' },
      { name: 'size / progressType / itemProgress / maxVisibleItems', type: 'ControlSize / ConnectionFlowProgressType / ConnectionFlowItemProgress / number', default: 'md / bar / bar / 2', description: 'Configure node content, progress and item rows. Nodes can override their own progress settings.' },
      { name: 'node.dotStepper', type: 'DotStepperProps', description: 'Optional per-node DotStepper. Steps and current state are application-owned; onStepSelect enables interactive dots.' },
      { name: 'animated / dotSpeed / dotInterval / connection.animated', type: 'boolean / number / number / boolean', default: 'true / 120 / 700 / false', description: 'Animate application-marked active connections. Horizontal lines hop over vertical lines at crossings; dots follow the same paths.' },
    ]} />
    <A11ySection>
      <A11yTopic title="Keyboard and screen readers"><KeyboardSupportTable bindings={[
        { keys: ['Tab'], action: 'Move through node, connection and control actions.' },
        { keys: ['Enter'], action: 'Select the focused node or connection; Space also selects.' },
        { keys: ['Arrow keys'], action: 'Move the focused node, or resize it when its resize handle is focused.' },
        { keys: ['Delete'], action: 'Remove the focused connection in edit mode; Backspace also works.' },
        { keys: ['Escape'], action: 'Cancel a gesture and clear selection.' },
      ]} /></A11yTopic>
      <A11yTopic title="Pointer and motion"><p>Scroll both axes with ScrollArea, drag empty space to pan, or use Ctrl + mouse wheel to zoom around the pointer. Drag a node or its resize handle; drag a connector to an existing node or, when enabled, to empty space. Animated dots honor reduced motion.</p></A11yTopic>
      <A11yTopic title="Internationalization and layout"><p>Controls, status, actions and accessible labels use <C>kit.diagramFlow.*</C> in the five built-in catalogs. Node titles, conditions and DotStepper step names come from the application. Canvas coordinates remain left-to-right; provide positions appropriate for the locale.</p></A11yTopic>
    </A11ySection>
  </div>;
}
