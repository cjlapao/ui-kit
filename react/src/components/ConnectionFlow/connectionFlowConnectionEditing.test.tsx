import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ConnectionFlow from './ConnectionFlow';
import { layoutConnectionFlow, type ConnectionFlowConnection, type ConnectionFlowNode } from '../../connectionFlow';

const nodes: ConnectionFlowNode[] = [{ id: 'a', title: 'Start', tone: 'blue' }, { id: 'b', title: 'Review', tone: 'amber' }];
const link: ConnectionFlowConnection = { id: 'a-b', fromId: 'a', toId: 'b', type: 'success', label: 'Approved', description: 'Continue after approval', data: { condition: { eq: true } } };
const target = (container: HTMLElement) => container.querySelector('[data-flow-connection-hit="a-b"]')!;

describe('connection appearance and metadata', () => {
  it('inherits the source tone and supports independent overrides without changing node tones', () => {
    const layout = layoutConnectionFlow({ nodes: [...nodes, { id: 'c', tone: 'violet' }], connections: [
      link, { id: 'a-c', fromId: 'a', toId: 'c', tone: 'rose' },
    ] });
    expect(layout.edges[0]).toMatchObject({ sourceTone: 'blue', targetTone: 'blue' });
    expect(layout.edges[1]).toMatchObject({ sourceTone: 'rose', targetTone: 'rose' });
    expect(layout.nodes.map(n => n.tone)).toEqual(['blue', 'amber', 'violet']);
    const overridden = layoutConnectionFlow({ nodes, connections: [{ ...link, tone: 'emerald', sourceTone: 'violet', targetTone: 'amber' }] });
    expect(overridden.edges[0]).toMatchObject({ sourceTone: 'violet', targetTone: 'amber' });
  });
  it('selects the original connection including application metadata and exposes its accessible name', () => {
    const onConnectionSelect = vi.fn();
    const { container, getByRole } = render(<ConnectionFlow nodes={nodes} connections={[link]} editMode onConnectionSelect={onConnectionSelect} />);
    const hit = getByRole('button', { name: 'Connection from Start to Review · Approved · success' });
    expect(document.getElementById(hit.getAttribute('aria-describedby')!)?.textContent).toBe(link.description);
    fireEvent.click(hit);
    expect(onConnectionSelect).toHaveBeenCalledWith(link);
    expect(target(container).getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-flow-edge="a-b"] path')!.getAttribute('stroke-width')).toBe('8');
    fireEvent.keyDown(hit, { key: 'Escape' });
    expect(onConnectionSelect).toHaveBeenLastCalledWith(null);
    expect(hit.getAttribute('aria-pressed')).toBe('false');
  });
});

describe('controlled connection editing', () => {
  it('requests controlled selection and waits for the parent to change it', () => {
    const onConnectionSelect = vi.fn();
    const { container, rerender } = render(<ConnectionFlow nodes={nodes} connections={[link]} editMode selectedConnectionId={null} onConnectionSelect={onConnectionSelect} />);
    fireEvent.click(target(container));
    expect(onConnectionSelect).toHaveBeenCalledWith(link);
    expect(target(container).getAttribute('aria-pressed')).toBe('false');
    rerender(<ConnectionFlow nodes={nodes} connections={[link]} editMode selectedConnectionId={link.id} onConnectionSelect={onConnectionSelect} />);
    expect(target(container).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(container.querySelector('[data-flow-node="a"]')!);
    expect(onConnectionSelect).toHaveBeenLastCalledWith(null);
  });
  it('requests edit on double-click and Enter, and removal on Delete/Backspace, without mutating topology', () => {
    const onConnectionEdit = vi.fn(), onConnectionRemove = vi.fn();
    const { container, rerender } = render(<ConnectionFlow nodes={nodes} connections={[link]} editMode onConnectionEdit={onConnectionEdit} onConnectionRemove={onConnectionRemove} />);
    const hit = target(container);
    fireEvent.doubleClick(hit);
    fireEvent.keyDown(hit, { key: 'Enter' });
    expect(onConnectionEdit).toHaveBeenCalledTimes(2);
    expect(onConnectionEdit).toHaveBeenLastCalledWith(link);
    fireEvent.keyDown(hit, { key: 'Delete' });
    fireEvent.keyDown(hit, { key: 'Backspace' });
    expect(onConnectionRemove).toHaveBeenCalledTimes(2);
    expect(onConnectionRemove).toHaveBeenLastCalledWith(link);
    expect(container.querySelector('[data-flow-edge="a-b"]')).toBeTruthy();
    rerender(<ConnectionFlow nodes={nodes} connections={[]} editMode />);
    expect(target(container)).toBeNull();
    expect(container.querySelector('[data-flow-edge="a-b"]')).toBeNull();
    rerender(<ConnectionFlow nodes={nodes} connections={[link]} editMode />);
    expect(target(container).getAttribute('aria-pressed')).toBe('false');
  });
  it('honors per-connection edit/removal permissions', () => {
    const onConnectionSelect = vi.fn(), onConnectionEdit = vi.fn(), onConnectionRemove = vi.fn();
    const locked = { ...link, editable: false, deletable: false };
    const { container } = render(<ConnectionFlow nodes={nodes} connections={[locked]} editMode onConnectionSelect={onConnectionSelect} onConnectionEdit={onConnectionEdit} onConnectionRemove={onConnectionRemove} />);
    const hit = target(container);
    fireEvent.click(hit); fireEvent.doubleClick(hit);
    fireEvent.keyDown(hit, { key: 'Enter' }); fireEvent.keyDown(hit, { key: 'Delete' });
    expect(onConnectionSelect).toHaveBeenCalledWith(locked);
    expect(onConnectionEdit).not.toHaveBeenCalled(); expect(onConnectionRemove).not.toHaveBeenCalled();
  });
  it('preserves card dragging, form typing and the read-only graph', () => {
    const onConnectionRemove = vi.fn();
    const { container, getAllByRole, rerender } = render(<ConnectionFlow nodes={nodes} connections={[link]} editMode onConnectionRemove={onConnectionRemove} renderNode={() => <input aria-label="Rule" />} />);
    fireEvent.keyDown(getAllByRole('textbox', { name: 'Rule' })[0], { key: 'Backspace' });
    expect(onConnectionRemove).not.toHaveBeenCalled();
    const scroll = container.querySelector<HTMLElement>('[data-slot="scrollarea"]')!;
    scroll.setPointerCapture = vi.fn();
    fireEvent.pointerDown(target(container).querySelector('path')!, { button: 0, pointerId: 1 });
    expect(scroll.setPointerCapture).not.toHaveBeenCalled();
    rerender(<ConnectionFlow nodes={nodes} connections={[link]} onConnectionRemove={onConnectionRemove} />);
    expect(target(container)).toBeNull();
    rerender(<ConnectionFlow nodes={nodes} editMode />);
    expect(target(container)).toBeNull();
  });
});
