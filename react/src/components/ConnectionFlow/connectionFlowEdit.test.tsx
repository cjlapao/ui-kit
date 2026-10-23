import { act, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ConnectionFlow, { type ConnectionFlowHandle } from './ConnectionFlow';
import { layoutConnectionFlow, segmentsCrossBoxes, type ConnectionFlowNode } from '../../connectionFlow';
import { dragSide, editPort, ghostCellAt, placeGhost } from './editGeometry';

const nodes: ConnectionFlowNode[] = [{ id: 'a', title: 'A', height: 104, tone: 'blue' }];
const layout = layoutConnectionFlow({ nodes });
const node = layout.nodes[0];
const sideButton = (container: HTMLElement, side = 'right') =>
  container.querySelector<HTMLButtonElement>(`[data-flow-edit-source="a"][data-flow-edit-side="${side}"]`)!;
const pointer = (button: HTMLButtonElement) => {
  const surface = button.closest<HTMLElement>('[data-flow-editor]')!;
  surface.setPointerCapture = vi.fn();
  surface.hasPointerCapture = vi.fn(() => true);
  surface.releasePointerCapture = vi.fn();
  fireEvent.pointerDown(button, { button: 0, pointerId: 1, clientX: node.x + node.width, clientY: node.y + node.height / 2 });
};

describe('ConnectionFlow edit geometry', () => {
  it('switches directions with a stable corner boundary', () => {
    expect(dragSide(node, node.x + node.width / 2, node.y + node.height * 2, 'top')).toBe('bottom');
    expect(dragSide(node, node.x - node.width, node.y, 'right')).toBe('left');
    expect(dragSide(node, node.x + node.width, node.y, 'right')).toBe('right');
  });
  it.each(['top', 'right', 'bottom', 'left'] as const)('finds an obstacle-free %s slot and routes to it', side => {
    const ghost = placeGhost('draft', node, side, layout, [], 'orthogonal')!;
    expect(ghost).toBeTruthy();
    expect(segmentsCrossBoxes(ghost.points, layout.nodes)).toBe(false);
    expect(segmentsCrossBoxes(ghost.points, [ghost.box])).toBe(false);
    const second = placeGhost('draft2', node, side, layout, [ghost], 'orthogonal')!;
    expect(second.box).not.toEqual(ghost.box);
    expect(segmentsCrossBoxes(second.points, [ghost.box, ...layout.nodes])).toBe(false);
  });
  it('places the ghost terminal clear of existing connector rings', () => {
    const linked = layoutConnectionFlow({ nodes: [...nodes, { id: 'b', height: 104 }] });
    const p = editPort(linked.nodes[0], 'right', linked)!;
    for (const c of linked.connectors.filter(c => c.nodeId === 'a' && c.side === 'right'))
      expect(Math.abs(p.y - c.y)).toBeGreaterThanOrEqual(c.radius + 10);
  });
});

describe('ConnectionFlow editing', () => {
  it('is absent by default and reveals a ghost only within a side band', () => {
    const { container, rerender } = render(<ConnectionFlow nodes={nodes} />);
    expect(container.querySelector('[data-flow-editor]')).toBeNull();
    rerender(<ConnectionFlow nodes={nodes} editMode />);
    const canvas = container.querySelector('[data-flow-editor]')!.parentElement!;
    fireEvent.pointerMove(canvas, { clientX: node.x + node.width / 2, clientY: node.y + node.height / 2 });
    expect(container.querySelector('[data-flow-ghost-port]')).toBeNull();
    fireEvent.pointerMove(canvas, { clientX: node.x + node.width - 2, clientY: node.y + node.height / 2 });
    expect(container.querySelector('[data-flow-ghost-port]')).toBeTruthy();
    expect(sideButton(container).style.pointerEvents).toBe('auto');
  });
  it('can create a draft without the randomUUID browser API', () => {
    const uuid = vi.spyOn(crypto, 'randomUUID').mockImplementation(() => { throw new Error('Unavailable'); });
    try {
      const onNodeCreate = vi.fn();
      const { container } = render(<ConnectionFlow nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
      fireEvent.click(sideButton(container), { detail: 0 });
      expect(onNodeCreate).toHaveBeenCalledOnce();
      expect(uuid).not.toHaveBeenCalled();
    } finally { uuid.mockRestore(); }
  });
  it('starts a drag anywhere in the edge band, away from the small connector handle', () => {
    const onNodeCreate = vi.fn();
    const onNodeClick = vi.fn();
    const { container, getByText } = render(<ConnectionFlow nodes={nodes} editMode onNodeCreate={onNodeCreate} onNodeClick={onNodeClick} />);
    const surface = container.querySelector<HTMLElement>('[data-flow-editor]')!;
    surface.setPointerCapture = vi.fn();
    surface.hasPointerCapture = vi.fn(() => true);
    surface.releasePointerCapture = vi.fn();
    const frame = container.querySelector<HTMLElement>('[data-slot="scrollarea"]')!;
    frame.setPointerCapture = vi.fn();
    const card = getByText('A').closest('[role="button"]')!;
    const y = node.y + node.height * 0.2;
    fireEvent.pointerDown(card, { button: 0, pointerId: 7, clientX: node.x + node.width - 5, clientY: y });
    expect(surface.setPointerCapture).toHaveBeenCalledWith(7);
    expect(frame.setPointerCapture).not.toHaveBeenCalled();
    fireEvent.pointerMove(surface, { pointerId: 7, clientX: node.x + node.width + 100, clientY: y });
    expect(container.querySelector('[data-flow-ghost]')).toBeTruthy();
    fireEvent.pointerUp(surface, { pointerId: 7, clientX: node.x + node.width + 100, clientY: y });
    expect(onNodeCreate.mock.calls[0][1]).toEqual({ sourceId: 'a', side: 'right' });
    expect(onNodeClick).not.toHaveBeenCalled();
  });
  it('does not start an edge-band drag over an embedded control', () => {
    const action = vi.fn();
    const { container, getByRole } = render(<ConnectionFlow nodes={nodes} editMode
      renderNode={() => <button onClick={action}>Action</button>} />);
    const surface = container.querySelector<HTMLElement>('[data-flow-editor]')!;
    surface.setPointerCapture = vi.fn();
    const button = getByRole('button', { name: 'Action' });
    fireEvent.pointerDown(button, { button: 0, pointerId: 7, clientX: node.x + node.width - 5, clientY: node.y + 20 });
    fireEvent.click(button);
    expect(surface.setPointerCapture).not.toHaveBeenCalled();
    expect(action).toHaveBeenCalledOnce();
  });
  it('keeps centre clicks available for the editor while background panning remains enabled', () => {
    const onNodeClick = vi.fn();
    const { container, getByText } = render(<ConnectionFlow nodes={nodes} editMode onNodeClick={onNodeClick} />);
    const frame = container.querySelector<HTMLElement>('[data-slot="scrollarea"]')!;
    frame.setPointerCapture = vi.fn();
    const card = getByText('A').closest('[data-flow-node]')!;
    fireEvent.pointerDown(card, { button: 0, pointerId: 4, clientX: node.x + node.width / 2, clientY: node.y + node.height / 2 });
    expect(frame.setPointerCapture).not.toHaveBeenCalled();
    fireEvent.click(card);
    expect(onNodeClick).toHaveBeenCalledExactlyOnceWith(nodes[0]);
    fireEvent.pointerDown(container.querySelector('[data-slot="scrollarea-viewport"]')!, { button: 0, pointerId: 5 });
    expect(frame.setPointerCapture).toHaveBeenCalledWith(5);
  });
  it('emits a stable ID and placement once, retains the draft, and resolves by real node ID', () => {
    const onNodeCreate = vi.fn();
    const { container, rerender } = render(<ConnectionFlow nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    const button = sideButton(container, 'top');
    pointer(button);
    // Start at the top, but finish below: both ghost and callback must use bottom.
    fireEvent.pointerMove(button, { pointerId: 1, clientX: node.x + node.width / 2, clientY: node.y + node.height + 100 });
    const id = container.querySelector('[data-flow-ghost]')!.getAttribute('data-flow-ghost');
    fireEvent.pointerUp(button, { pointerId: 1, clientX: node.x + node.width / 2, clientY: node.y + node.height + 100 });
    expect(onNodeCreate).toHaveBeenCalledExactlyOnceWith(id, { sourceId: 'a', side: 'bottom' });
    fireEvent.click(button, { detail: 1 });
    expect(onNodeCreate).toHaveBeenCalledTimes(1);
    expect(container.querySelector(`[data-flow-ghost="${id}"]`)).toBeTruthy();
    rerender(<ConnectionFlow nodes={[...nodes, { id: id!, title: 'Configured' }]} editMode onNodeCreate={onNodeCreate} />);
    expect(container.querySelector('[data-flow-ghost]')).toBeNull();
  });
  it('can create with the keyboard and dismiss from an application modal', () => {
    const ref = createRef<ConnectionFlowHandle>();
    const onNodeCreate = vi.fn();
    const { container, rerender } = render(<ConnectionFlow ref={ref} nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    fireEvent.click(sideButton(container), { detail: 0 });
    const id = onNodeCreate.mock.calls[0][0];
    expect(container.querySelector('[data-flow-ghost]')).toBeTruthy();
    rerender(<ConnectionFlow ref={ref} nodes={nodes} editMode={false} onNodeCreate={onNodeCreate} />);
    expect(container.querySelector('[data-flow-ghost]')).toBeTruthy();
    act(() => ref.current!.dismissGhost(id));
    expect(container.querySelector('[data-flow-ghost]')).toBeNull();
  });
  it.each(['escape', 'cancel', 'capture', 'inside', 'disable', 'data'] as const)('cancels safely on %s', reason => {
    const onNodeCreate = vi.fn();
    const { container, rerender } = render(<ConnectionFlow nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    const button = sideButton(container);
    pointer(button);
    fireEvent.pointerMove(button, { pointerId: 1, clientX: node.x + node.width + 100, clientY: node.y + node.height / 2 });
    if (reason === 'escape') fireEvent.keyDown(document, { key: 'Escape' });
    if (reason === 'cancel') fireEvent.pointerCancel(button, { pointerId: 1 });
    if (reason === 'capture') fireEvent.lostPointerCapture(button, { pointerId: 1 });
    if (reason === 'inside') fireEvent.pointerMove(button, { pointerId: 1, clientX: node.x + node.width / 2, clientY: node.y + node.height / 2 });
    if (reason === 'disable') rerender(<ConnectionFlow nodes={nodes} onNodeCreate={onNodeCreate} />);
    if (reason === 'data') rerender(<ConnectionFlow nodes={[]} editMode onNodeCreate={onNodeCreate} />);
    fireEvent.pointerUp(button, { pointerId: 1, clientX: node.x + node.width / 2, clientY: node.y + node.height / 2 });
    expect(onNodeCreate).not.toHaveBeenCalled();
    expect(container.querySelector('[data-flow-ghost]')).toBeNull();
  });
  it('requests a connection to an existing card without creating a new node', () => {
    const two = [...nodes, { id: 'b', title: 'B', height: 104 }];
    const graph = layoutConnectionFlow({ nodes: two, connections: [] });
    const target = graph.nodes[1];
    const onConnect = vi.fn(), onNodeCreate = vi.fn();
    const { container, rerender } = render(<ConnectionFlow nodes={two} connections={[]} editMode onConnect={onConnect} onNodeCreate={onNodeCreate} />);
    const button = sideButton(container);
    pointer(button);
    const surface = container.querySelector('[data-flow-editor]')!;
    const point = { pointerId: 1, clientX: target.x + target.width / 2, clientY: target.y + target.height / 2 };
    fireEvent.pointerMove(surface, point);
    expect(container.querySelector('[data-flow-connect-target="b"]')).toBeTruthy();
    expect(container.querySelector('[data-flow-ghost]')).toBeNull();
    fireEvent.pointerUp(surface, point);
    expect(onConnect).toHaveBeenCalledExactlyOnceWith({ sourceId: 'a', targetId: 'b', sourceSide: 'right', targetSide: 'left' });
    expect(onNodeCreate).not.toHaveBeenCalled();
    // The callback is a request: the app decides whether to persist the link.
    expect(container.querySelector('[data-flow-edge]')).toBeNull();
    rerender(<ConnectionFlow nodes={two} connections={[{ id: 'ab', fromId: 'a', toId: 'b' }]} editMode onConnect={onConnect} />);
    expect(container.querySelectorAll('[data-flow-edge]')).toHaveLength(1);
    expect(container.querySelector('[data-flow-connect-target]')).toBeNull();
  });
  it.each(['duplicate', 'disabled', 'self', 'escape'] as const)('rejects or cancels an existing-node connection: %s', reason => {
    const two = [...nodes, { id: 'b', title: 'B', height: 104, disabled: reason === 'disabled' }];
    const connections = reason === 'duplicate' ? [{ id: 'ab', fromId: 'a', toId: 'b' }] : [];
    const graph = layoutConnectionFlow({ nodes: two, connections });
    const target = graph.nodes[reason === 'self' ? 0 : 1];
    const onConnect = vi.fn(), onNodeCreate = vi.fn();
    const { container } = render(<ConnectionFlow nodes={two} connections={connections} editMode onConnect={onConnect} onNodeCreate={onNodeCreate} />);
    const button = sideButton(container);
    pointer(button);
    const surface = container.querySelector('[data-flow-editor]')!;
    const point = { pointerId: 1, clientX: target.x + target.width / 2, clientY: target.y + target.height / 2 };
    fireEvent.pointerMove(surface, point);
    if (reason === 'escape') fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.pointerUp(surface, point);
    expect(onConnect).not.toHaveBeenCalled();
    expect(onNodeCreate).not.toHaveBeenCalled();
    expect(container.querySelector('[data-flow-ghost]')).toBeNull();
  });
  it('uses the release position rather than a stale preview', () => {
    const onNodeCreate = vi.fn();
    const { container } = render(<ConnectionFlow nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    const button = sideButton(container);
    pointer(button);
    fireEvent.pointerMove(button, { pointerId: 1, clientX: node.x + node.width + 100, clientY: node.y + node.height / 2 });
    fireEvent.pointerUp(button, { pointerId: 1, clientX: node.x + node.width / 2, clientY: node.y + node.height / 2 });
    expect(onNodeCreate).not.toHaveBeenCalled();
    expect(container.querySelector('[data-flow-ghost]')).toBeNull();
  });
  it('rebases a pending draft when its source moves without changing the ID', () => {
    const onNodeCreate = vi.fn();
    const { container, rerender } = render(<ConnectionFlow nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    fireEvent.click(sideButton(container), { detail: 0 });
    const id = onNodeCreate.mock.calls[0][0];
    const before = Number(container.querySelector('[data-flow-ghost] rect')!.getAttribute('x'));
    rerender(<ConnectionFlow nodes={[{ id: 'before', height: 104 }, ...nodes]} editMode onNodeCreate={onNodeCreate} />);
    const draft = container.querySelector('[data-flow-ghost]')!;
    expect(draft.getAttribute('data-flow-ghost')).toBe(id);
    expect(Number(draft.querySelector('rect')!.getAttribute('x'))).toBeGreaterThan(before);
    expect(onNodeCreate).toHaveBeenCalledTimes(1);
  });
  it('preserves the viewed source position when a top draft grows the drawing bounds', () => {
    const ref = createRef<ConnectionFlowHandle>();
    const onNodeCreate = vi.fn();
    const { container, getByText } = render(<ConnectionFlow ref={ref} nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    const viewport = container.querySelector<HTMLElement>('[data-slot="scrollarea-viewport"]')!;
    const card = getByText('A').closest<HTMLElement>('[role="button"]')!;
    const screenY = () => parseFloat(card.style.top) - viewport.scrollTop;
    const before = screenY();
    fireEvent.click(sideButton(container, 'top'), { detail: 0 });
    expect(viewport.scrollTop).toBeGreaterThan(0);
    expect(screenY()).toBeCloseTo(before);
    act(() => ref.current!.dismissGhost(onNodeCreate.mock.calls[0][0]));
    expect(screenY()).toBeCloseTo(before);
  });
  it('converts screen coordinates correctly after zoom and scrolling', () => {
    const ref = createRef<ConnectionFlowHandle>();
    const onNodeCreate = vi.fn();
    const { container } = render(<ConnectionFlow ref={ref} nodes={nodes} editMode onNodeCreate={onNodeCreate} />);
    act(() => ref.current!.setZoom(0.5));
    const editor = container.querySelector<HTMLElement>('[data-flow-editor]')!;
    // The canvas has moved left/up inside the scrolled viewport.
    editor.getBoundingClientRect = () => ({ left: -100, top: -80, width: 500, height: 300 } as DOMRect);
    const button = sideButton(container);
    pointer(button);
    fireEvent.pointerMove(button, {
      pointerId: 1,
      clientX: -100 + (node.x + node.width + 80) * 0.5,
      clientY: -80 + (node.y + node.height / 2) * 0.5
    });
    fireEvent.pointerUp(button, { pointerId: 1,
      clientX: -100 + (node.x + node.width + 80) * 0.5,
      clientY: -80 + (node.y + node.height / 2) * 0.5 });
    expect(onNodeCreate.mock.calls[0][1]).toEqual({ sourceId: 'a', side: 'right' });
  });
  it('does not start a pan, select a node, or consume ordinary wheel scrolling during editing', () => {
    const onNodeClick = vi.fn();
    const { container } = render(<ConnectionFlow nodes={nodes} editMode onNodeClick={onNodeClick} />);
    const frame = container.querySelector<HTMLElement>('[data-slot="scrollarea"]')!;
    frame.setPointerCapture = vi.fn();
    pointer(sideButton(container));
    expect(frame.setPointerCapture).not.toHaveBeenCalled();
    expect(onNodeClick).not.toHaveBeenCalled();
    expect(fireEvent.wheel(sideButton(container), { deltaY: 100 })).toBe(true);
  });
  it('ignores disabled cards and leaves custom body controls available', () => {
    const { container, getAllByRole } = render(<ConnectionFlow nodes={[...nodes, { id: 'disabled', disabled: true }]} editMode
      renderNode={() => <button type="button">Inner action</button>} />);
    expect(container.querySelector('[data-flow-edit-source="disabled"]')).toBeNull();
    fireEvent.pointerMove(getAllByRole('button', { name: 'Inner action' })[0], { clientX: node.x, clientY: node.y });
    expect(container.querySelector('[data-flow-ghost-port]')).toBeNull();
  });
});


describe('grid-aware creation', () => {
  const cells: ConnectionFlowNode[] = [
    { id: 'a', height: 112, gridPosition: { column: 0, row: 0 } },
    { id: 'review', height: 112, gridPosition: { column: 1, row: 0 } },
    { id: 'below', height: 112, gridPosition: { column: 0, row: 1 } },
  ];
  it('previews and commits the free cell below an existing column', () => {
    const before = layoutConnectionFlow({ nodes: cells, connections: [] });
    const source = before.nodes.find(n => n.id === 'below')!;
    const ghost = placeGhost('draft', source, 'right', before, [], 'orthogonal')!;
    expect(ghost.gridPosition).toEqual({ column: 1, row: 1 });
    expect(ghost.box.x).toBe(before.nodes.find(n => n.id === 'review')!.x);
    expect(ghost.box.y).toBe(source.y);
    const after = layoutConnectionFlow({ nodes: [...cells, { id: ghost.id, height: 112, gridPosition: ghost.gridPosition }], connections: [] });
    const saved = after.nodes.find(n => n.id === ghost.id)!;
    expect([saved.x, saved.y]).toEqual([ghost.box.x, ghost.box.y]);
  });
  it('reserves the tallest card in a row when previewing the row below', () => {
    const graph: ConnectionFlowNode[] = [
      { id: 'a', height: 112, gridPosition: { column: 0, row: 0 } },
      { id: 'tall', height: 240, gridPosition: { column: 1, row: 0 } },
    ];
    const before = layoutConnectionFlow({ nodes: graph, connections: [] });
    const source = before.nodes.find(n => n.id === 'a')!;
    const ghost = placeGhost('draft', source, 'bottom', before, [], 'orthogonal')!;
    const after = layoutConnectionFlow({ nodes: [...graph, { id: ghost.id, height: 112, gridPosition: ghost.gridPosition }], connections: [] });
    expect(ghost.box.y).toBe(after.nodes.find(n => n.id === ghost.id)!.y);
    expect(ghost.box.y).toBeGreaterThan(before.nodes.find(n => n.id === 'tall')!.y + 240);
  });
  it('emits the preview cell for the application to persist', () => {
    const onNodeCreate = vi.fn();
    const { container } = render(<ConnectionFlow nodes={cells} connections={[]} editMode onNodeCreate={onNodeCreate} />);
    fireEvent.click(container.querySelector('[data-flow-edit-source="below"][data-flow-edit-side="right"]')!, { detail: 0 });
    expect(onNodeCreate).toHaveBeenCalledWith(expect.any(String), {
      sourceId: 'below', side: 'right', gridPosition: { column: 1, row: 1 },
    });
  });
  it('skips an occupied cell without overlapping it', () => {
    const occupied = layoutConnectionFlow({ nodes: [...cells, { id: 'taken', height: 112, gridPosition: { column: 1, row: 1 } }], connections: [] });
    const source = occupied.nodes.find(n => n.id === 'below')!;
    const ghost = placeGhost('draft', source, 'right', occupied, [], 'orthogonal')!;
    expect(ghost.gridPosition).toEqual({ column: 2, row: 1 });
    expect(ghost.box.x).toBeGreaterThan(occupied.nodes.find(n => n.id === 'taken')!.x);
  });
});


describe('dragging across grid rows', () => {
  const cells: ConnectionFlowNode[] = [
    { id: 'a', height: 112, gridPosition: { column: 0, row: 0 } },
    { id: 'review', height: 112, gridPosition: { column: 1, row: 0 } },
    { id: 'below', height: 112, gridPosition: { column: 0, row: 1 } },
    { id: 'below-review', height: 112, gridPosition: { column: 1, row: 1 } },
  ];
  it.each(['orthogonal', 'curved', 'straight'] as const)('creates beside Review from the lower row without connecting Review (%s)', style => {
    const links = [
      { id: 'first', fromId: 'a', toId: 'review' },
      { id: 'down', fromId: 'a', toId: 'below' },
      { id: 'across', fromId: 'below', toId: 'below-review' },
    ];
    const before = layoutConnectionFlow({ nodes: cells, connections: links });
    const source = before.nodes.find(n => n.id === 'below-review')!;
    const review = before.nodes.find(n => n.id === 'review')!;
    const x = review.x + review.width + 72 + review.width / 2;
    const y = review.y + review.height / 2;
    const side = dragSide(source, x, y, 'right');
    const cell = ghostCellAt(source, side, before, x, y);
    expect(cell).toEqual({ column: 2, row: 0 });
    const ghost = placeGhost('new', source, side, before, [], style, cell)!;
    expect(ghost.box.y).toBe(review.y);
    const after = layoutConnectionFlow({
      nodes: [...cells, { id: 'new', height: 112, gridPosition: ghost.gridPosition }],
      connections: [...links, { id: 'diagonal', fromId: source.id, toId: 'new', fromSide: side }],
      options: { edgeStyle: style },
    });
    const added = after.nodes.find(n => n.id === 'new')!;
    expect([added.x, added.y]).toEqual([ghost.box.x, ghost.box.y]);
    expect(after.edges.filter(e => e.fromId === 'review' || e.toId === 'review')).toHaveLength(1);
    for (const edge of after.edges) expect(segmentsCrossBoxes(edge.points, after.nodes), edge.id).toBe(false);
  });
  it('updates the row during a drag even when the source side stays the same', () => {
    const onNodeCreate = vi.fn();
    const { container } = render(<ConnectionFlow nodes={cells} connections={[]} editMode onNodeCreate={onNodeCreate} />);
    const graph = layoutConnectionFlow({ nodes: cells, connections: [] });
    const source = graph.nodes.find(n => n.id === 'below-review')!;
    const surface = container.querySelector<HTMLElement>('[data-flow-editor]')!;
    surface.setPointerCapture = vi.fn(); surface.hasPointerCapture = vi.fn(() => true); surface.releasePointerCapture = vi.fn();
    const button = container.querySelector('[data-flow-edit-source="below-review"][data-flow-edit-side="right"]')!;
    const x = source.x + source.width * 3;
    const y = source.y + source.height / 2;
    fireEvent.pointerDown(button, { button: 0, pointerId: 9, clientX: source.x + source.width, clientY: y });
    fireEvent.pointerMove(surface, { pointerId: 9, clientX: x, clientY: y });
    const firstY = container.querySelector('[data-flow-ghost] rect')!.getAttribute('y');
    const topY = graph.nodes.find(n => n.id === 'review')!.y + source.height / 2;
    fireEvent.pointerMove(surface, { pointerId: 9, clientX: x, clientY: topY });
    expect(container.querySelector('[data-flow-ghost] rect')!.getAttribute('y')).not.toBe(firstY);
    fireEvent.pointerUp(surface, { pointerId: 9, clientX: x, clientY: topY });
    expect(onNodeCreate.mock.calls[0][1]).toMatchObject({ sourceId: 'below-review', side: 'right', gridPosition: { row: 0 } });
  });
});
