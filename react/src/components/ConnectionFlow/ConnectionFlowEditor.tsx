import { forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useKitT } from '../../i18n';
import { getToneClasses, type ConnectionFlowEdgeStyle, type ConnectionFlowLayout } from '../../connectionFlow';
import type { SurfaceVariant, TrueColor } from '../../theme/Theme';
import type { Box, PortSide } from '../../../../common/connectionFlow/router';
import { dragSide, EDIT_SIDES, editPort, outsideCard, placeGhost, ghostCellAt, previewConnection, type FlowConnectionPreview, type ConnectionFlowConnectRequest, type ConnectionFlowPlacement, type FlowGhost } from './editGeometry';

export interface ConnectionFlowEditorHandle {
  dismissGhost: (id: string) => void;
  hoverAt: (x: number, y: number, target: EventTarget) => void;
  beginAt: (event: { clientX: number; clientY: number; pointerId: number; button: number; target: EventTarget }) => boolean;
}
interface EditorProps {
  enabled: boolean;
  layout: ConnectionFlowLayout;
  scale: number;
  offsetX: number;
  offsetY: number;
  tone: TrueColor;
  variant: SurfaceVariant;
  edgeStyle: ConnectionFlowEdgeStyle;
  onCreate?: (id: string, placement: ConnectionFlowPlacement) => void;
  onConnect?: (connection: ConnectionFlowConnectRequest) => void;
  onStart: () => void;
  onBounds: (bounds: Box | null) => void;
}
const SIDE_LABELS = {
  top: 'kit.connectionFlowEdit.top', right: 'kit.connectionFlowEdit.right',
  bottom: 'kit.connectionFlowEdit.bottom', left: 'kit.connectionFlowEdit.left',
} as const;
type Drag = { id: string; sourceId: string; side: PortSide; pointerId: number; startX: number; startY: number; ghost: FlowGhost | null; valid: boolean; connection?: FlowConnectionPreview | null; };

const ConnectionFlowEditor = forwardRef<ConnectionFlowEditorHandle, EditorProps>(function ConnectionFlowEditor({
  enabled, layout, scale, offsetX, offsetY, tone, variant, edgeStyle, onCreate, onConnect, onStart, onBounds,
}, ref) {
  const t = useKitT();
  const editorId = useId();
  const idSequence = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ sourceId: string; side: PortSide; } | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const [pending, setPending] = useState<FlowGhost[]>([]);
  const [message, setMessage] = useState('');
  const captured = useRef<HTMLDivElement | null>(null);
  const updateDrag = (next: Drag | null) => { dragRef.current = next; setDrag(next); };
  const cancel = () => {
    const active = dragRef.current;
    updateDrag(null);
    const button = captured.current;
    captured.current = null;
    if (button && active && button.hasPointerCapture?.(active.pointerId))
      button.releasePointerCapture(active.pointerId);
  };
  const bandAt = (clientX: number, clientY: number, target: EventTarget): typeof hover => {
    if (!enabled || !root.current || (target instanceof Element && target.closest(
      'button, a, input, select, textarea, [data-no-edit], [data-slot="scrollarea-scrollbar"]',
    ))) return null;
    const bounds = root.current.getBoundingClientRect();
    const x = (clientX - bounds.left - offsetX) / scale;
    const y = (clientY - bounds.top - offsetY) / scale;
    const node = layout.nodes.find(n => !n.node.disabled && !outsideCard(n, x, y));
    if (!node) return null;
    const distances = {
      left: (x - node.x) / node.width, right: (node.x + node.width - x) / node.width,
      top: (y - node.y) / node.height, bottom: (node.y + node.height - y) / node.height,
    };
    const side = EDIT_SIDES.reduce((a, b) => distances[b] < distances[a] ? b : a);
    return distances[side] <= 0.1 && editPort(node, side, layout) ? { sourceId: node.id, side } : null;
  };
  useImperativeHandle(ref, () => ({
    dismissGhost: id => setPending(current => current.filter(g => g.id !== id)),
    hoverAt: (clientX, clientY, target) => {
      if (!enabled || dragRef.current || (target instanceof Element && target.closest('[data-flow-edit-side]'))) return;
      const next = bandAt(clientX, clientY, target);
      setHover(current => current?.sourceId === next?.sourceId && current?.side === next?.side ? current : next);
    },
    beginAt: event => {
      if (event.button !== 0 || dragRef.current) return false;
      const band = bandAt(event.clientX, event.clientY, event.target);
      if (!band) return false;
      onStart();
      setHover(band);
      captured.current = root.current;
      root.current?.setPointerCapture(event.pointerId);
      updateDrag({
        id: newId(), ...band, pointerId: event.pointerId,
        startX: event.clientX, startY: event.clientY, ghost: null, valid: false
      });
      return true;
    },
  }));
  useEffect(() => {
    // A draft is resolved by its ID, including nodes nested in children/rows.
    const real = new Set(layout.nodes.map(n => n.id));
    setPending(current => {
      const next: FlowGhost[] = [];
      for (const ghost of current) {
        if (real.has(ghost.id) || !real.has(ghost.sourceId)) continue;
        const source = layout.nodes.find(n => n.id === ghost.sourceId)!;
        const placed = placeGhost(ghost.id, source, ghost.side, layout, next, edgeStyle, ghost.gridPosition);
        if (placed) next.push(placed);
      }
      return next.length === current.length && next.every((g, i) =>
        g.d === current[i].d && g.box.x === current[i].box.x && g.box.y === current[i].box.y &&
        g.box.width === current[i].box.width && g.box.height === current[i].box.height,
      ) ? current : next;
    });
    cancel();
    setHover(null);
  }, [layout, edgeStyle]); // Geometry changes invalidate the drag's snapshot.
  useEffect(() => () => {
    const active = dragRef.current;
    dragRef.current = null;
    const button = captured.current;
    if (active && button?.hasPointerCapture?.(active.pointerId)) button.releasePointerCapture(active.pointerId);
  }, []);
  useEffect(() => { if (!enabled) { cancel(); setHover(null); } }, [enabled]);
  useEffect(() => {
    if (!drag) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); cancel(); setMessage(t('kit.connectionFlowEdit.canceled')); }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [!!drag, t]);
  const realIds = new Set(layout.nodes.map(n => n.id));
  const shown = pending.filter(g => !realIds.has(g.id) && realIds.has(g.sourceId));
  const previews = drag?.ghost ? [...shown, drag.ghost] : shown;
  const connecting = drag?.connection;
  const linkPoints = connecting?.points ?? [];
  const minX = Math.min(layout.offsetX, ...linkPoints.map(p => p.x - 24), ...previews.flatMap(g => [g.box.x - 24, ...g.points.map(p => p.x - 24)]));
  const minY = Math.min(layout.offsetY, ...linkPoints.map(p => p.y - 24), ...previews.flatMap(g => [g.box.y - 24, ...g.points.map(p => p.y - 24)]));
  const maxX = Math.max(layout.width, ...linkPoints.map(p => p.x + 24), ...previews.flatMap(g => [g.box.x + g.box.width + 24, ...g.points.map(p => p.x + 24)]));
  const maxY = Math.max(layout.height, ...linkPoints.map(p => p.y + 24), ...previews.flatMap(g => [g.box.y + g.box.height + 24, ...g.points.map(p => p.y + 24)]));
  useLayoutEffect(() => {
    onBounds(previews.length || connecting ? { x: minX, y: minY, width: maxX - minX, height: maxY - minY } : null);
  }, [minX, minY, maxX, maxY, previews.length, !!connecting, onBounds]);
  useLayoutEffect(() => () => onBounds(null), [onBounds]);

  const request = (ghost: FlowGhost) => {
    setPending(current => [...current, ghost]);
    updateDrag(null);
    setHover(null);
    setMessage(t('kit.connectionFlowEdit.created'));
    onCreate?.(ghost.id, { sourceId: ghost.sourceId, side: ghost.side,
      ...(ghost.gridPosition ? { gridPosition: ghost.gridPosition } : {}) });
  };
  const newId = () => {
    let id: string;
    do { id = `flow-ghost-${editorId}-${++idSequence.current}`; }
    while (layout.nodes.some(n => n.id === id) || pending.some(g => g.id === id));
    return id;
  };
  const previewAt = (active: Drag, clientX: number, clientY: number): Drag | null => {
    if (!root.current) return null;
    const bounds = root.current.getBoundingClientRect();
    const x = (clientX - bounds.left - offsetX) / scale;
    const y = (clientY - bounds.top - offsetY) / scale;
    const node = layout.nodes.find(n => n.id === active.sourceId);
    if (!node) return null;
    const side = dragSide(node, x, y, active.side);
    const target = layout.nodes.find(n => n.id !== node.id && !outsideCard(n, x, y));
    if (target) {
      const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
      const targetSide = dragSide(target, x, y, opposite[side]);
      const connection = active.connection?.targetId === target.id &&
        active.connection.sourceSide === side && active.connection.targetSide === targetSide
        ? active.connection : previewConnection(node, target, side, targetSide, layout, edgeStyle);
      return { ...active, side, ghost: null, connection, valid: !!connection };
    }
    const valid = outsideCard(node, x, y) && Math.hypot(clientX - active.startX, clientY - active.startY) > 4;
    const cell = ghostCellAt(node, side, layout, x, y);
    const sameCell = cell?.column === active.ghost?.gridPosition?.column && cell?.row === active.ghost?.gridPosition?.row;
    if (!active.connection && side === active.side && valid === active.valid && sameCell && (active.ghost || !valid)) return active;
    const ghost = valid ? (side === active.side && sameCell && active.ghost
      ? active.ghost : placeGhost(active.id, node, side, layout, shown, edgeStyle, cell)) : null;
    return { ...active, side, ghost, connection: null, valid: valid && !!ghost };
  };
  if (!enabled && !shown.length) return null;
  const hoveredNode = layout.nodes.find(n => n.id === (drag?.sourceId ?? hover?.sourceId));
  const hoveredPort = hoveredNode && editPort(hoveredNode, drag?.side ?? hover!.side, layout);
  return (
    <div ref={root} className="pointer-events-none absolute inset-0" data-flow-editor
      onPointerMove={event => {
        const active = dragRef.current;
        if (!active || active.pointerId !== event.pointerId || !root.current) return;
        event.stopPropagation();
        const next = previewAt(active, event.clientX, event.clientY);
        if (next !== active) updateDrag(next);
      }}
      onPointerUp={event => {
        const active = dragRef.current;
        if (!active || active.pointerId !== event.pointerId) return;
        event.stopPropagation();
        const final = previewAt(active, event.clientX, event.clientY);
        updateDrag(null); captured.current = null;
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (final?.valid && final.connection) {
          const { sourceId, targetId, sourceSide, targetSide } = final.connection;
          setHover(null);
          setMessage(t('kit.connectionFlowEdit.connected'));
          onConnect?.({ sourceId, targetId, sourceSide, targetSide });
        } else if (final?.valid && final.ghost) request(final.ghost);
      }}
      onPointerCancel={() => cancel()}
      onLostPointerCapture={() => { if (dragRef.current) cancel(); }}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
        <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>
          {connecting && <g data-flow-connect-target={connecting.targetId}>
            <path d={connecting.d} fill="none" strokeWidth={2} strokeDasharray="5 4"
              className={getToneClasses(tone).shapeStrokeSelected} />
            {[connecting.source, connecting.target].map((p, i) =>
              <circle key={i} cx={p.x} cy={p.y} r={6} strokeWidth={2} strokeDasharray="2 2"
                className={`${getToneClasses(tone).shapeStrokeSelected} ${getToneClasses(tone).shapeFill}`} />)}
            <rect x={connecting.targetBox.x - 4} y={connecting.targetBox.y - 4}
              width={connecting.targetBox.width + 8} height={connecting.targetBox.height + 8}
              rx={12} fill="none" strokeWidth={2} strokeDasharray="4 3"
              className={getToneClasses(tone).shapeStrokeSelected} />
          </g>}
          {previews.map(g => {
            const node = layout.nodes.find(n => n.id === g.sourceId)!;
            const palette = getToneClasses(node.tone ?? tone);
            return <g key={g.id} data-flow-ghost={g.id} opacity={drag?.id === g.id ? 0.65 : 0.85}>
              <path d={g.d} fill="none" strokeWidth={1.75} strokeDasharray="5 4" className={palette.line} />
              <circle cx={g.source.x} cy={g.source.y} r={6} strokeWidth={2} strokeDasharray="2 2"
                className={`${palette.shapeStrokeSelected} ${palette.shapeFill}`} />
              <rect {...g.box} rx={10} strokeWidth={2} strokeDasharray="6 5"
                className={`${palette.shapeStrokeSelected} ${palette.shapeFill}`}
                fillOpacity={variant.startsWith('glass') ? 0.25 : 0.55} />
              <path d={`M ${g.box.x + g.box.width / 2 - 6} ${g.box.y + g.box.height / 2} h 12 M ${g.box.x + g.box.width / 2} ${g.box.y + g.box.height / 2 - 6} v 12`}
                strokeWidth={1.5} className={palette.shapeStrokeSelected} />
            </g>;
          })}
          {hoveredPort && !drag?.ghost && !connecting && <circle data-flow-ghost-port cx={hoveredPort.x} cy={hoveredPort.y} r={6}
            strokeWidth={2} strokeDasharray="2 2" className={`${getToneClasses(hoveredNode!.tone).shapeStrokeSelected} ${getToneClasses(hoveredNode!.tone).shapeFill}`} />}
        </g>
      </svg>
      {enabled && layout.nodes.filter(n => !n.node.disabled).flatMap(node => EDIT_SIDES.map(side => {
        const anchor = editPort(node, side, layout);
        if (!anchor) return null;
        const box = { x: anchor.x - 12, y: anchor.y - 12, width: 24, height: 24 };
        const visible = hover?.sourceId === node.id && hover.side === side;
        return <button key={`${node.id}:${side}`} type="button" data-no-pan data-flow-edit-side={side} data-flow-edit-source={node.id}
          aria-label={t('kit.connectionFlowEdit.add', { side: t(SIDE_LABELS[side]), label: typeof node.node.title === 'string' ? node.node.title : node.id })}
          className="absolute cursor-crosshair border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-500"
          style={{ touchAction: 'none', pointerEvents: visible ? 'auto' : 'none', left: offsetX + box.x * scale, top: offsetY + box.y * scale, width: box.width * scale, height: box.height * scale }}
          onPointerEnter={() => { if (!dragRef.current) setHover({ sourceId: node.id, side }); }}
          onPointerLeave={() => { if (!dragRef.current) setHover(null); }}
          onFocus={() => setHover({ sourceId: node.id, side })}
          onBlur={() => { if (!dragRef.current) setHover(null); }}
          onClick={event => {
            event.stopPropagation();
            if (event.detail !== 0 || dragRef.current) return;
            const ghost = placeGhost(newId(), node, side, layout, shown, edgeStyle);
            if (ghost) { onStart(); request(ghost); }
          }}
          onPointerDown={event => {
            if (event.button !== 0) return;
            event.stopPropagation();
            onStart();
            captured.current = root.current;
            root.current?.setPointerCapture(event.pointerId);
            updateDrag({
              id: newId(), sourceId: node.id, side, pointerId: event.pointerId,
              startX: event.clientX, startY: event.clientY, ghost: null, valid: false
            });
          }}

        />;
      }))}
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </div>
  );
});
export default ConnectionFlowEditor;
