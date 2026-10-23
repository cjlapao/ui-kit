import { describe, expect, it } from 'vitest';
import { layoutConnectionFlow, segmentsCrossBoxes, type ConnectionFlowNode, type ConnectionFlowConnection } from '../../connectionFlow';

const nodes: ConnectionFlowNode[] = [
  { id: 'start', height: 104 },
  { id: 'middle', height: 104, kind: 'parallel', group: 'middle' },
  { id: 'below', height: 104, kind: 'parallel', group: 'middle' },
  { id: 'right', height: 104 },
];
const connections: ConnectionFlowConnection[] = [
  { id: 'first', fromId: 'start', toId: 'middle' },
  { id: 'next', fromId: 'middle', toId: 'right' },
  { id: 'new', fromId: 'middle', toId: 'below', fromSide: 'bottom', toSide: 'top' },
];
describe('explicit ConnectionFlow topology', () => {
  it.each(['orthogonal', 'curved', 'straight'] as const)('adds only the requested bottom link, retaining routing safeguards (%s)', edgeStyle => {
    const layout = layoutConnectionFlow({ nodes, connections, options: { edgeStyle } });
    expect(layout.edges.map(e => [e.fromId, e.toId])).toEqual([
      ['start', 'middle'], ['middle', 'right'], ['middle', 'below'],
    ]);
    const below = layout.nodes.find(n => n.id === 'below')!;
    const middle = layout.nodes.find(n => n.id === 'middle')!;
    expect(below.y - middle.y - middle.height).toBeGreaterThanOrEqual(48);
    for (const edge of layout.edges) expect(segmentsCrossBoxes(edge.points, layout.nodes), edge.id).toBe(false);
    expect(layout.connectors).toHaveLength(6);
  });
  it('distinguishes an empty explicit graph from legacy inferred connections', () => {
    expect(layoutConnectionFlow({ nodes, connections: [] }).edges).toEqual([]);
    expect(layoutConnectionFlow({ nodes }).edges.length).toBeGreaterThan(0);
    const tree: ConnectionFlowNode[] = [{ id: 'p', childLayout: 'chain', rows: [[{ id: 'c' }]], failure: { to: 'end' } }, { id: 'end' }];
    expect(layoutConnectionFlow({ nodes: tree, connections: [] }).edges).toEqual([]);
  });
  it('ignores duplicate, self and dangling connections deterministically', () => {
    const layout = layoutConnectionFlow({
      nodes, connections: [
        connections[0], connections[0], { ...connections[0], id: 'other' },
        { id: 'self', fromId: 'middle', toId: 'middle' },
        { id: 'missing', fromId: 'missing', toId: 'right' },
      ]
    });
    expect(layout.edges.map(e => e.id)).toEqual(['first']);
  });
  it('honors independent connection configuration and auto states', () => {
    const layout = layoutConnectionFlow({
      nodes: [{ id: 'a', status: 'succeeded' }, { id: 'b', status: 'running' }],
      autoState: true, connections: [{ id: 'custom', fromId: 'a', toId: 'b', ringSize: 'xl', sourceTone: 'amber', targetTone: 'violet', edgeStyle: 'curved' }]
    });
    expect(layout.edges[0]).toMatchObject({ id: 'custom', state: 'flowing', sourceTone: 'amber', targetTone: 'violet', style: 'curved' });
    expect(layout.connectors.every(c => c.radius === 9)).toBe(true);
  });
});


describe('editor grid placement', () => {
  const cells: ConnectionFlowNode[] = [
    { id: 'start', height: 112, gridPosition: { column: 0, row: 0 } },
    { id: 'review', height: 112, gridPosition: { column: 1, row: 0 } },
    { id: 'below', height: 112, gridPosition: { column: 0, row: 1 } },
  ];
  const links: ConnectionFlowConnection[] = [
    { id: 'review', fromId: 'start', toId: 'review' },
    { id: 'down', fromId: 'start', toId: 'below', fromSide: 'bottom', toSide: 'top' },
  ];
  it.each(['orthogonal', 'curved', 'straight'] as const)('fills the second row of an existing column without shifting its first row (%s)', edgeStyle => {
    const before = layoutConnectionFlow({ nodes: cells, connections: links, options: { edgeStyle } });
    const after = layoutConnectionFlow({
      nodes: [...cells, { id: 'new', height: 112, gridPosition: { column: 1, row: 1 } }],
      connections: [...links, { id: 'across', fromId: 'below', toId: 'new', fromSide: 'right', toSide: 'left' }],
      options: { edgeStyle },
    });
    for (const original of before.nodes) {
      const saved = after.nodes.find(n => n.id === original.id)!;
      expect([saved.x, saved.y]).toEqual([original.x, original.y]);
    }
    const created = after.nodes.find(n => n.id === 'new')!;
    expect(created.x).toBe(after.nodes.find(n => n.id === 'review')!.x);
    expect(created.y).toBe(after.nodes.find(n => n.id === 'below')!.y);
    expect(after.edges.map(e => [e.fromId, e.toId])).toEqual([
      ['start', 'review'], ['start', 'below'], ['below', 'new'],
    ]);
    for (const edge of after.edges) expect(segmentsCrossBoxes(edge.points, after.nodes), edge.id).toBe(false);
  });
  it('aligns uneven row heights and supports insertions above and to the left', () => {
    const layout = layoutConnectionFlow({ nodes: [
      ...cells.map(n => ({ ...n, height: n.id === 'review' ? 240 : 112 })),
      { id: 'left', gridPosition: { column: -1, row: 0 } },
      { id: 'above', gridPosition: { column: 1, row: -1 } },
      { id: 'new', gridPosition: { column: 1, row: 1 } },
    ], connections: [] });
    const get = (id: string) => layout.nodes.find(n => n.id === id)!;
    expect(get('left').x).toBeLessThan(get('start').x);
    expect(get('above').y).toBeLessThan(get('review').y);
    expect(get('new').y).toBe(get('below').y);
    expect(get('new').y - get('review').y - get('review').height).toBeGreaterThanOrEqual(72);
  });
});
