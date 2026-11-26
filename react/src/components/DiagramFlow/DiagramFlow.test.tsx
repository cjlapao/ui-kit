import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import DiagramFlow from './DiagramFlow';
import { applyDiagramFlowOperation, validateDiagramFlow, type DiagramFlowGraph } from './model';
import { alignedDiagramPorts, freeDiagramPort } from './ports';
import { placeDiagramCaptions } from './captions';
import { routeCrossings } from './router';
import { I18nProvider } from '../../i18n/I18nContext';

const graph: DiagramFlowGraph = {
  nodes: [{ id: 'a', title: 'A', position: { x: 0, y: 0 } }, { id: 'b', title: 'B', position: { x: 260, y: 0 } }, { id: 'c', title: 'C', position: { x: 520, y: 0 }, join: 'all' }],
  connections: [{ id: 'ab', sourceId: 'a', targetId: 'b', outcome: 'success' }, { id: 'bc', sourceId: 'b', targetId: 'c', outcome: 'success' }],
};
function Editor() { const [value, setValue] = useState(graph); return <><DiagramFlow graph={value} onChange={setValue} /><output data-testid="graph">{JSON.stringify(value)}</output></>; }
const current = () => JSON.parse(screen.getByTestId('graph').textContent!) as DiagramFlowGraph;

describe('DiagramFlow', () => {
  it('routes a straight connection between top-aligned nodes with different heights', () => {
    const uneven: DiagramFlowGraph = { nodes: [{ id: 'a', title: 'A', position: { x: 0, y: 0 }, height: 80 }, { id: 'b', title: 'B', position: { x: 260, y: 0 }, height: 100 }], connections: [{ id: 'ab', sourceId: 'a', targetId: 'b', outcome: 'success' }] };
    render(<DiagramFlow graph={uneven} onChange={vi.fn()} />);
    const path = screen.getByRole('button', { name: 'success connection from A to B' }).getAttribute('d')!;
    expect(path).not.toMatch(/[QA]/);
    const coords = [...path.matchAll(/[ML] ([\d.]+) ([\d.]+)/g)].map(match => Number(match[2]));
    expect(coords.length).toBeGreaterThanOrEqual(2);
    expect(new Set(coords).size).toBe(1);
  });
  it('aligns vertical and horizontal facing ports while respecting occupied ports', () => {
    const a = { x: 0, y: 0, width: 180, height: 80 }, b = { x: 260, y: 0, width: 180, height: 100 };
    const first = alignedDiagramPorts(a, 'right', [], b, 'left', [])!;
    expect(first[0].y).toBe(first[1].y);
    const second = alignedDiagramPorts(a, 'right', [first[0]], b, 'left', [first[1]])!;
    expect(second[0].y).toBe(second[1].y);
    expect(Math.abs(second[0].y - first[0].y)).toBeGreaterThanOrEqual(18);
    const bottom = { x: 20, y: 150, width: 140, height: 80 };
    const vertical = alignedDiagramPorts(a, 'bottom', [], bottom, 'top', [])!;
    expect(vertical[0].x).toBe(vertical[1].x);
    expect(alignedDiagramPorts(a, 'left', [], b, 'right', [])).toBeNull();
  });
  it('aligns the shared grid with snapping and scales it with the canvas', () => {
    const { container, rerender } = render(<DiagramFlow graph={graph} onChange={vi.fn()} gridSize={30} grid={{ pattern: 'dots', lineColor: 'red', dotSize: 2, opacity: .4, fade: 'radial' }} />);
    const grid = container.querySelector<HTMLElement>('[data-diagram-grid]')!;
    const lattice = grid.firstElementChild as HTMLElement;
    const node = container.querySelector<HTMLElement>('[data-diagram-node="a"]')!;
    expect(lattice.style.backgroundSize).toBe('30px 30px');
    expect(lattice.style.backgroundImage).toContain('red 2px');
    expect(lattice.style.opacity).toBe('0.4');
    expect((parseFloat(node.style.left) - parseFloat(grid.style.left)) % 30).toBe(0);
    expect((parseFloat(node.style.top) - parseFloat(grid.style.top)) % 30).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(grid.parentElement).toHaveStyle({ transform: 'scale(1.25)' });
    expect(lattice.style.backgroundSize).toBe('30px 30px');
    rerender(<DiagramFlow graph={graph} onChange={vi.fn()} grid={false} />);
    expect(container.querySelector('[data-diagram-grid]')).toBeNull();
  });
  it('pans from empty space without changing selection and clears selection on a click', () => {
    const { container } = render(<Editor />);
    const view = container.querySelector<HTMLDivElement>('[data-slot="scrollarea-viewport"]')!;
    const background = screen.getByRole('button', { name: 'Clear diagram selection' });
    background.setPointerCapture = vi.fn(); background.hasPointerCapture = () => true; background.releasePointerCapture = vi.fn();
    view.scrollLeft = 120; view.scrollTop = 90;
    fireEvent.click(screen.getByRole('button', { name: 'A pending' }));
    fireEvent.pointerDown(background, { pointerId: 1, button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(background, { pointerId: 1, clientX: 102, clientY: 102 });
    expect(background).toHaveStyle({ cursor: 'default' });
    fireEvent.pointerMove(background, { pointerId: 1, clientX: 70, clientY: 80 });
    expect(background).toHaveStyle({ cursor: 'grabbing' });
    expect(view.scrollLeft).toBe(150); expect(view.scrollTop).toBe(110);
    fireEvent.pointerUp(background, { pointerId: 1, clientX: 70, clientY: 80 });
    fireEvent.click(background);
    expect(screen.getByRole('button', { name: 'Delete' })).not.toBeDisabled();
    fireEvent.click(background);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });
  it('zooms around the pointer only on Ctrl-wheel, including in read-only mode', () => {
    const { container } = render(<DiagramFlow graph={graph} onChange={vi.fn()} readOnly />);
    const view = container.querySelector<HTMLDivElement>('[data-slot="scrollarea-viewport"]')!;
    view.getBoundingClientRect = () => ({ left: 10, top: 20, right: 410, bottom: 320, width: 400, height: 300, x: 10, y: 20, toJSON: () => ({}) });
    view.scrollLeft = 100; view.scrollTop = 80;
    expect(fireEvent.wheel(view, { deltaY: -100, clientX: 110, clientY: 70 })).toBe(true);
    expect(screen.getByLabelText('Zoom')).toHaveTextContent('100%');
    expect(fireEvent.wheel(view, { deltaY: -100, clientX: 110, clientY: 70, ctrlKey: true })).toBe(false);
    expect(screen.getByLabelText('Zoom')).toHaveTextContent('200%');
    expect(view.scrollLeft).toBe(300); expect(view.scrollTop).toBe(210);
  });
  it('leaves wheel zoom inactive while disabled', () => {
    const { container } = render(<DiagramFlow graph={graph} onChange={vi.fn()} disabled />);
    const view = container.querySelector<HTMLDivElement>('[data-slot="scrollarea-viewport"]')!;
    expect(fireEvent.wheel(view, { deltaY: -100, ctrlKey: true })).toBe(true);
    expect(screen.getByLabelText('Zoom')).toHaveTextContent('100%');
  });
  it('adds a hop only to the horizontal path at a crossing', () => {
    const paths = routeCrossings([
      { id: 'horizontal', style: 'orthogonal', points: [{ x: 0, y: 50 }, { x: 100, y: 50 }] },
      { id: 'vertical', style: 'orthogonal', points: [{ x: 50, y: 0 }, { x: 50, y: 100 }] },
    ]);
    expect(paths.get('horizontal')).toMatch(/A/);
    expect(paths.has('vertical')).toBe(false);
  });
  it('forwards surface options to a Panel and locks controls when disabled', () => {
    const onNodeClick = vi.fn();
    const { container } = render(<DiagramFlow graph={graph} onChange={vi.fn()} onNodeClick={onNodeClick} variant="tonal" tone="blue" padding="md" disabled />);
    const surface = container.querySelector('[data-diagram-flow]')!;
    expect(surface).toHaveAttribute('data-variant', 'tonal');
    expect(surface).toHaveAttribute('data-tone', 'blue');
    expect(surface).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Fit diagram' })).toBeDisabled();
    fireEvent.click(container.querySelector('[data-diagram-node="a"]')!);
    expect(onNodeClick).not.toHaveBeenCalled();
  });
  it('localizes controls and accessible labels', () => {
    render(<I18nProvider locale="es" locales={{}}><DiagramFlow graph={graph} onChange={vi.fn()} /></I18nProvider>);
    expect(screen.getByRole('button', { name: 'Añadir paso' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'A pendiente' })).toBeTruthy();
    expect(screen.getByLabelText('Diagrama de flujo')).toBeTruthy();
  });
  it('places wrapped captions clear of cards and other labels', () => {
    const cards = [{ x: 0, y: 0, width: 100, height: 80 }, { x: 400, y: 0, width: 100, height: 80 }];
    const captions = placeDiagramCaptions([
      { id: 'one', text: 'A long condition that needs multiple lines to remain readable', points: [{ x: 100, y: 40 }, { x: 400, y: 40 }] },
      { id: 'two', text: 'Retry', points: [{ x: 100, y: 60 }, { x: 400, y: 60 }] },
    ], cards);
    const first = captions.get('one')!, second = captions.get('two')!;
    const intersects = (a: typeof first, b: { x: number; y: number; width: number; height: number }) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    expect(first.lines.length).toBeGreaterThan(1);
    expect(cards.some(card => intersects(first, card) || intersects(second, card))).toBe(false);
    expect(intersects(first, second)).toBe(false);
  });
  it('pins its accessible controls outside the scrolling canvas', () => {
    const { container } = render(<Editor />);
    const controls = container.querySelector('[data-diagram-controls]')!;
    expect(controls.className).toContain('bottom-3');
    expect(controls.className).toContain('right-3');
    expect(controls.closest('.overflow-auto')).toBeNull();
    expect(controls.className).not.toContain('flex-col');
    expect(controls).toHaveAttribute('data-mode', 'edit');
    expect(container.querySelector('[data-slot="scrollarea-viewport"]')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset view' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByLabelText('Zoom')).toHaveTextContent('125%');
  });
  it('uses a compact read-only control panel', () => {
    const { container } = render(<DiagramFlow graph={graph} onChange={vi.fn()} readOnly />);
    expect(container.querySelector('[data-diagram-controls]')).toHaveAttribute('data-mode', 'read-only');
    expect(screen.queryByRole('button', { name: 'Add step' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Fit diagram' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset view' })).toBeTruthy();
  });
  it('creates a branch atomically without changing existing connections', () => {
    const next = applyDiagramFlowOperation(graph, { type: 'create', node: { id: 'e', title: 'E', position: { x: 260, y: 120 } }, connection: { id: 'be', sourceId: 'b', targetId: 'e', outcome: 'success' } })!;
    expect(next.connections.map(e => e.id)).toEqual(['ab', 'bc', 'be']);
    expect(graph.nodes).toHaveLength(3);
  });
  it('accepts failure loops and cross-parent links while rejecting parent cycles', () => {
    const nested: DiagramFlowGraph = { nodes: [...graph.nodes, { id: 'c1', title: 'C1', parentId: 'c', position: { x: 520, y: 140 } }, { id: 'c2', title: 'C2', parentId: 'c', position: { x: 520, y: 280 } }], connections: [...graph.connections, { id: 'forward', sourceId: 'c1', targetId: 'c2', outcome: 'success' }, { id: 'retry', sourceId: 'c2', targetId: 'c1', outcome: 'failure' }, { id: 'exit', sourceId: 'c2', targetId: 'a', outcome: 'success' }] };
    expect(validateDiagramFlow(nested)).toEqual([]);
    expect(applyDiagramFlowOperation(nested, { type: 'update-node', node: { ...nested.nodes[2], parentId: 'c1' } })).toBeNull();
  });
  it('rejects dangling edges and duplicate IDs', () => {
    expect(applyDiagramFlowOperation(graph, { type: 'connect', connection: { id: 'bad', sourceId: 'a', targetId: 'missing', outcome: 'failure' } })).toBeNull();
    expect(applyDiagramFlowOperation(graph, { type: 'connect', connection: { id: 'ab', sourceId: 'a', targetId: 'c', outcome: 'success' } })).toBeNull();
  });
  it('adds one branch, connects it to the join, and supports undo and redo', () => {
    render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: 'B pending' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add branch' }));
    expect(current().nodes).toHaveLength(4);
    expect(current().connections.map(e => e.id)).toContain('bc');
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    fireEvent.click(screen.getByRole('button', { name: /C pending/ }));
    expect(current().connections).toHaveLength(4);
    expect(current().connections[3].targetId).toBe('c');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(current().connections).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Redo' }));
    expect(current().connections).toHaveLength(4);
  });
  it('cancels connection mode without changing the graph', () => {
    const { container } = render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: 'B pending' }));
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    fireEvent.keyDown(container.querySelector('[data-diagram-flow]')!, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: /C pending/ }));
    expect(current().connections).toHaveLength(2);
  });
  it('clears node and connection selection when the canvas is clicked', () => {
    render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: 'B pending' }));
    expect(screen.getByRole('button', { name: 'B pending' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Clear diagram selection' }));
    expect(screen.getByRole('button', { name: 'B pending' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'success connection from A to B' }));
    expect(screen.getByRole('button', { name: 'Delete' })).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Clear diagram selection' }));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });
  it('uses shared Panel options and per-node overrides', () => {
    const styled: DiagramFlowGraph = { ...graph, nodes: graph.nodes.map(n => n.id === 'b' ? { ...n, panelProps: { variant: 'glass' as const, tone: 'rose' as const, padding: 'lg' as const } } : n) };
    render(<DiagramFlow graph={styled} onChange={vi.fn()} nodePanelProps={{ variant: 'tonal', tone: 'blue', padding: 'md' }} />);
    expect(screen.getByRole('button', { name: 'A pending' })).toHaveAttribute('data-variant', 'tonal');
    expect(screen.getByRole('button', { name: 'A pending' })).toHaveAttribute('data-tone', 'blue');
    expect(screen.getByRole('button', { name: 'B pending' })).toHaveAttribute('data-variant', 'glass');
    expect(screen.getByRole('button', { name: 'B pending' })).toHaveAttribute('data-tone', 'rose');
  });
  it('resizes a node with the pointer and restores its dimensions on undo', () => {
    render(<Editor />);
    const before = screen.getByRole('button', { name: 'success connection from A to B' }).getAttribute('d');
    fireEvent.click(screen.getByRole('button', { name: 'A pending' }));
    const handle = screen.getByRole('button', { name: 'Resize A' });
    handle.setPointerCapture = vi.fn(); handle.hasPointerCapture = vi.fn(() => true); handle.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(handle, { button: 0, pointerId: 4, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(handle, { pointerId: 4, clientX: 20, clientY: 40 });
    fireEvent.pointerUp(handle, { pointerId: 4, clientX: 20, clientY: 40 });
    expect(current().nodes[0]).toMatchObject({ width: 200, height: 120 });
    expect(screen.getByRole('button', { name: 'A pending' }).style.width).toBe('200px');
    expect(screen.getByRole('button', { name: 'success connection from A to B' }).getAttribute('d')).not.toBe(before);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(current().nodes[0].width).toBeUndefined();
    expect(screen.getByRole('button', { name: 'A pending' }).style.width).toBe('180px');
  });
  it('rejects a resize that overlaps another node', () => {
    render(<Editor />);
    fireEvent.click(screen.getByRole('button', { name: 'A pending' }));
    const handle = screen.getByRole('button', { name: 'Resize A' });
    handle.setPointerCapture = vi.fn(); handle.hasPointerCapture = vi.fn(() => true); handle.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(handle, { button: 0, pointerId: 4, clientX: 0, clientY: 0 });
    fireEvent.pointerUp(handle, { pointerId: 4, clientX: 100, clientY: 0 });
    expect(current().nodes[0].width).toBeUndefined();
    expect(screen.getByText('That size overlaps another step.')).toBeTruthy();
  });
  it('shows ConnectionFlow item progress and uses the individual node tone', () => {
    const rich: DiagramFlowGraph = { ...graph, nodes: [{ ...graph.nodes[0], tone: 'violet', progress: .4, items: [{ id: 'build', title: 'Build image', progress: .5, progressType: 'bar' }] }, ...graph.nodes.slice(1)] };
    render(<DiagramFlow graph={rich} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'A pending' })).toHaveAttribute('data-tone', 'violet');
    expect(screen.getByText('Build image')).toBeTruthy();
    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
  });
  it('renders a node DotStepper with application-owned progress and automatic space', () => {
    const initial: DiagramFlowGraph = { ...graph, nodes: [{ ...graph.nodes[0], dotStepper: { currentIndex: 1, tone: 'violet', steps: [{ id: 'first', title: 'Prepare' }, { id: 'second', title: 'Build' }, { id: 'third', title: 'Deploy' }] } }, ...graph.nodes.slice(1)] };
    const { container } = render(<DiagramFlow graph={initial} onChange={vi.fn()} />);
    expect(screen.getByRole('group', { name: 'A steps' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Build, step 2 of 3, active' })).toBeTruthy();
    expect(container.querySelector('[data-diagram-stepper="a"] [data-dot-status="active"]')).toHaveClass('bg-violet-500');
    expect(Number.parseFloat(screen.getByRole('button', { name: 'A pending' }).style.height)).toBeGreaterThan(76);
  });
  it('allows interactive step selection without selecting or dragging the node', () => {
    const onStepSelect = vi.fn(), onNodeClick = vi.fn();
    const interactive: DiagramFlowGraph = { ...graph, nodes: [{ ...graph.nodes[0], dotStepper: { steps: [{ id: 'first', title: 'Prepare' }], onStepSelect } }, ...graph.nodes.slice(1)] };
    render(<DiagramFlow graph={interactive} onChange={vi.fn()} onNodeClick={onNodeClick} />);
    const node = screen.getByRole('group', { name: 'A pending' });
    node.setPointerCapture = vi.fn();
    const step = screen.getByRole('button', { name: 'Prepare, step 1 of 1, active' });
    fireEvent.pointerDown(step, { button: 0, pointerId: 1 });
    fireEvent.click(step);
    expect(onStepSelect).toHaveBeenCalledOnce();
    expect(onNodeClick).not.toHaveBeenCalled();
    expect(node.setPointerCapture).not.toHaveBeenCalled();
  });
  it('animates only the paths explicitly marked active by the application', () => {
    const active: DiagramFlowGraph = { ...graph, connections: [{ ...graph.connections[0], animated: true }, graph.connections[1]] };
    const { container, rerender } = render(<DiagramFlow graph={active} onChange={vi.fn()} />);
    expect(container.querySelector('[data-diagram-flow-dot="ab"] animateMotion')).toBeTruthy();
    expect(container.querySelector('[data-diagram-flow-dot="bc"]')).toBeNull();
    rerender(<DiagramFlow graph={active} onChange={vi.fn()} animated={false} />);
    expect(container.querySelector('[data-diagram-flow-dot]')).toBeNull();
  });
});

describe('DiagramFlow connection interactions', () => {
  it('creates one connected node from an empty-space drop when enabled and supports undo', () => {
    const onConnect = vi.fn(), onNodeCreate = vi.fn();
    function App() { const [value, setValue] = useState(graph); return <><DiagramFlow graph={value} onChange={setValue} onConnect={onConnect} onNodeCreate={onNodeCreate} autoCreate /><output data-testid="graph">{JSON.stringify(value)}</output></>; }
    const { container } = render(<App />);
    const port = screen.getByRole('button', { name: 'Connect from A, bottom' });
    port.setPointerCapture = vi.fn(); port.hasPointerCapture = vi.fn(() => true); port.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(port, { button: 0, pointerId: 9, clientX: 230, clientY: 216 });
    fireEvent.pointerMove(port, { pointerId: 9, clientX: 300, clientY: 400 });
    expect(container.querySelector('[data-diagram-create-preview]')).toBeTruthy();
    fireEvent.pointerUp(port, { pointerId: 9, clientX: 300, clientY: 400 });
    expect(current().nodes).toHaveLength(4);
    expect(current().connections).toHaveLength(3);
    expect(onNodeCreate).toHaveBeenCalledOnce();
    expect(onConnect).toHaveBeenCalledOnce();
    expect(onNodeCreate.mock.calls[0][1]).toMatchObject({ sourceId: 'a', targetId: current().nodes[3].id, outcome: 'unknown' });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(current().nodes).toHaveLength(3);
    expect(current().connections).toHaveLength(2);
  });
  it('does not create a node on empty drops by default or when the placement overlaps', () => {
    const onChange = vi.fn(), onNodeCreate = vi.fn();
    const { rerender } = render(<DiagramFlow graph={graph} onChange={onChange} onNodeCreate={onNodeCreate} />);
    const port = screen.getByRole('button', { name: 'Connect from A, bottom' });
    port.setPointerCapture = vi.fn(); port.hasPointerCapture = vi.fn(() => true); port.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(port, { button: 0, pointerId: 9, clientX: 230, clientY: 216 });
    fireEvent.pointerUp(port, { pointerId: 9, clientX: 300, clientY: 400 });
    expect(onChange).not.toHaveBeenCalled();
    rerender(<DiagramFlow graph={graph} onChange={onChange} onNodeCreate={onNodeCreate} autoCreate />);
    fireEvent.pointerDown(port, { button: 0, pointerId: 9, clientX: 230, clientY: 216 });
    fireEvent.pointerUp(port, { pointerId: 9, clientX: 335, clientY: 250 });
    expect(onChange).not.toHaveBeenCalled();
    expect(onNodeCreate).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('not enough space');
  });
  it('connects an existing target without auto-creating a node', () => {
    const onConnect = vi.fn(), onNodeCreate = vi.fn(), onChange = vi.fn();
    render(<DiagramFlow graph={graph} onChange={onChange} onConnect={onConnect} onNodeCreate={onNodeCreate} autoCreate />);
    const port = screen.getByRole('button', { name: 'Connect from A, right' });
    port.setPointerCapture = vi.fn(); port.hasPointerCapture = vi.fn(() => true); port.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(port, { button: 0, pointerId: 4, clientX: 320, clientY: 170 });
    fireEvent.pointerUp(port, { pointerId: 4, clientX: 700, clientY: 170 });
    expect(onConnect).toHaveBeenCalledOnce();
    expect(onConnect.mock.calls[0][0]).toMatchObject({ sourceId: 'a', targetId: 'c' });
    expect(onNodeCreate).not.toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].nodes).toHaveLength(3);
  });
  it('cancels an auto-create drag without committing a node', () => {
    const onChange = vi.fn();
    render(<DiagramFlow graph={graph} onChange={onChange} autoCreate />);
    const port = screen.getByRole('button', { name: 'Connect from A, bottom' });
    port.setPointerCapture = vi.fn(); port.hasPointerCapture = vi.fn(() => true); port.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(port, { button: 0, pointerId: 9, clientX: 230, clientY: 216 });
    fireEvent.pointerMove(port, { pointerId: 9, clientX: 300, clientY: 400 });
    fireEvent.pointerCancel(port, { pointerId: 9 });
    fireEvent.pointerUp(port, { pointerId: 9, clientX: 300, clientY: 400 });
    expect(onChange).not.toHaveBeenCalled();
  });
  it('reveals neutral ports on hover and hides them in read-only mode', () => {
    const { rerender } = render(<DiagramFlow graph={graph} onChange={vi.fn()} />);
    const port = screen.getByRole('button', { name: 'Connect from A, right' });
    expect(port.style.opacity).toBe('0');
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'A pending' }));
    expect(port.style.opacity).toBe('1');
    fireEvent.pointerLeave(screen.getByRole('button', { name: 'A pending' }));
    expect(port.style.opacity).toBe('0');
    rerender(<DiagramFlow graph={graph} onChange={vi.fn()} readOnly />);
    expect(screen.queryByRole('button', { name: 'Connect from A, right' })).toBeNull();
  });
  it('uses a separate attachment point when the centre of a side is occupied', () => {
    const box = { x: 0, y: 0, width: 180, height: 76 };
    const first = freeDiagramPort(box, 'left', [])!;
    const second = freeDiagramPort(box, 'left', [first])!;
    expect(Math.abs(first.y - second.y)).toBeGreaterThanOrEqual(18);
  });
  it('creates a connection from a node port and reports clicks and connection requests', () => {
    const onConnect = vi.fn(), onNodeClick = vi.fn();
    function App() { const [value, setValue] = useState(graph); return <DiagramFlow graph={value} onChange={setValue} onConnect={onConnect} onNodeClick={onNodeClick} />; }
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Connect from A, right' }));
    fireEvent.click(screen.getByRole('button', { name: /C pending/ }));
    expect(onNodeClick).toHaveBeenCalledWith(graph.nodes[2]);
    expect(onConnect).toHaveBeenCalledOnce();
    expect(onConnect.mock.calls[0][0]).toMatchObject({ sourceId: 'a', targetId: 'c', outcome: 'unknown' });
    expect(screen.getByRole('button', { name: 'unknown connection from A to C' })).toBeTruthy();
  });
  it('reconnects a selected endpoint while preserving metadata and reports the change', () => {
    const before = { ...graph.connections[0], label: 'continue', condition: { rule: 'ok' }, satisfied: true };
    const input = { ...graph, connections: [before, graph.connections[1]] };
    const onReconnect = vi.fn(), onConnectionClick = vi.fn();
    function App() { const [value, setValue] = useState(input); return <DiagramFlow graph={value} onChange={setValue} onReconnect={onReconnect} onConnectionClick={onConnectionClick} />; }
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'success connection from A to B, continue' }));
    expect(onConnectionClick).toHaveBeenCalledWith(before);
    fireEvent.click(screen.getByRole('button', { name: 'Change target of success connection from A to B' }));
    fireEvent.click(screen.getByRole('button', { name: /C pending/ }));
    expect(onReconnect).toHaveBeenCalledOnce();
    expect(onReconnect.mock.calls[0][1]).toEqual({ ...before, targetId: 'c' });
    expect(screen.getByRole('button', { name: 'success connection from A to C, continue' })).toBeTruthy();
  });
  it('creates exactly one connection with a pointer drag between nodes', () => {
    const onConnect = vi.fn();
    function App() { const [value, setValue] = useState(graph); return <DiagramFlow graph={value} onChange={setValue} onConnect={onConnect} />; }
    render(<App />);
    const port = screen.getByRole('button', { name: 'Connect from A, right' });
    port.setPointerCapture = vi.fn(); port.hasPointerCapture = vi.fn(() => true); port.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(port, { button: 0, pointerId: 4, clientX: 320, clientY: 170 });
    fireEvent.pointerMove(port, { pointerId: 4, clientX: 700, clientY: 170 });
    expect(document.querySelectorAll('[data-diagram-drop-side]')).toHaveLength(4);
    const preview = document.querySelector('[data-diagram-connection-preview]')!;
    expect(preview.getAttribute('d')).toContain('Q');
    fireEvent.pointerUp(port, { pointerId: 4, clientX: 700, clientY: 170 });
    expect(onConnect).toHaveBeenCalledOnce();
    expect(onConnect.mock.calls[0][0]).toMatchObject({ sourceId: 'a', targetId: 'c', outcome: 'unknown' });
  });
  it('sets the outcome after selecting an unknown path', () => {
    const initial: DiagramFlowGraph = { ...graph, connections: [{ ...graph.connections[0], outcome: 'unknown' }] };
    function App() { const [value, setValue] = useState(initial); return <DiagramFlow graph={value} onChange={setValue} />; }
    render(<App />);
    const edge = screen.getByRole('button', { name: 'unknown connection from A to B' });
    expect(edge.getAttribute('pointer-events')).toBe('stroke');
    fireEvent.click(edge);
    fireEvent.change(screen.getByRole('combobox', { name: 'Connection outcome' }), { target: { value: 'failure' } });
    expect(screen.getByRole('button', { name: 'failure connection from A to B' })).toBeTruthy();
  });
  it('drags an endpoint to a new source and deletes the selected connection from the keyboard', () => {
    const onReconnect = vi.fn();
    function App() { const [value, setValue] = useState(graph); return <DiagramFlow graph={value} onChange={setValue} onReconnect={onReconnect} />; }
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'success connection from A to B' }));
    const handle = screen.getByRole('button', { name: 'Change source of success connection from A to B' });
    handle.setPointerCapture = vi.fn(); handle.hasPointerCapture = vi.fn(() => true); handle.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(handle, { button: 0, pointerId: 4, clientX: 320, clientY: 178 });
    fireEvent.pointerMove(handle, { pointerId: 4, clientX: 700, clientY: 170 });
    fireEvent.pointerUp(handle, { pointerId: 4, clientX: 700, clientY: 170 });
    expect(onReconnect).toHaveBeenCalledOnce();
    expect(onReconnect.mock.calls[0][1]).toMatchObject({ id: 'ab', sourceId: 'c', targetId: 'b' });
    const edge = screen.getByRole('button', { name: 'success connection from C to B' });
    fireEvent.keyDown(edge, { key: 'Delete' });
    expect(screen.queryByRole('button', { name: 'success connection from C to B' })).toBeNull();
    expect(screen.getByRole('button', { name: 'success connection from B to C' })).toBeTruthy();
  });
  it('cancels an invalid drop without emitting a callback', () => {
    const onConnect = vi.fn();
    render(<DiagramFlow graph={graph} onChange={vi.fn()} onConnect={onConnect} />);
    const port = screen.getByRole('button', { name: 'Connect from A, right' });
    port.setPointerCapture = vi.fn(); port.hasPointerCapture = vi.fn(() => true); port.releasePointerCapture = vi.fn();
    fireEvent.pointerDown(port, { button: 0, pointerId: 4, clientX: 320, clientY: 170 });
    fireEvent.pointerUp(port, { pointerId: 4, clientX: 350, clientY: 350 });
    expect(onConnect).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toContain('canceled');
  });
});
