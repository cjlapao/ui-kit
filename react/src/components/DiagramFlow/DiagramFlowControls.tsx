import IconButton from '../IconButton';
import type { DiagramFlowOutcome } from './model';

interface Props {
  readOnly: boolean;
  canNode: boolean;
  canDelete: boolean;
  canUndo: boolean;
  canRedo: boolean;
  outcome?: DiagramFlowOutcome;
  zoom: number;
  onAdd: () => void;
  onBranch: () => void;
  onChild: () => void;
  onConnect: () => void;
  onAlign: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onOutcome: (outcome: DiagramFlowOutcome) => void;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}
const paths: Record<string, string> = {
  add: 'M12 5v14M5 12h14', branch: 'M5 4v16M5 8h5a5 5 0 0 1 5 5v2M12 12l3 3 3-3',
  child: 'M5 4v10a4 4 0 0 0 4 4h7M13 15l3 3-3 3', connect: 'M9 15l6-6M7 17l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0M17 7l1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0',
  align: 'M4 5h16M7 9h10v4H7zM9 16h6v4H9z', undo: 'M9 7 4 12l5 5M4 12h9a6 6 0 0 1 6 6', redo: 'm15 7 5 5-5 5M20 12h-9a6 6 0 0 0-6 6',
  delete: 'M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 10v7M14 10v7', fit: 'M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4', minus: 'M6 12h12',
};
function Glyph({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
function Action({ name, label, disabled, onClick }: { name: string; label: string; disabled?: boolean; onClick: () => void }) {
  return <IconButton icon={<Glyph name={name} />} size="xs" variant="ghost" color="slate" disabled={disabled} srLabel={label} tooltip={label} onClick={onClick} />;
}
export default function DiagramFlowControls(p: Props) {
  return <div data-diagram-controls data-mode={p.readOnly ? 'read-only' : 'edit'} className="absolute bottom-3 right-3 z-30 flex max-w-[calc(100%-1.5rem)] items-center gap-0.5 overflow-x-auto rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90">
    {!p.readOnly && <>
      <Action name="add" label="Add step" onClick={p.onAdd} />
      <Action name="branch" label="Add branch" disabled={!p.canNode} onClick={p.onBranch} />
      <Action name="child" label="Add child" disabled={!p.canNode} onClick={p.onChild} />
      <Action name="connect" label="Connect" disabled={!p.canNode} onClick={p.onConnect} />
      <Action name="align" label="Align to grid" onClick={p.onAlign} />
      <Action name="undo" label="Undo" disabled={!p.canUndo} onClick={p.onUndo} />
      <Action name="redo" label="Redo" disabled={!p.canRedo} onClick={p.onRedo} />
      <Action name="delete" label="Delete" disabled={!p.canDelete} onClick={p.onDelete} />
      <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700" />
    </>}
      {!p.readOnly && p.outcome && <label className="flex items-center gap-1 px-1 text-xs text-neutral-600 dark:text-neutral-300">Outcome <select aria-label="Connection outcome" value={p.outcome} onChange={event => p.onOutcome(event.target.value as DiagramFlowOutcome)} className="max-w-24 rounded border border-neutral-300 bg-white px-1 py-0.5 text-xs dark:border-neutral-600 dark:bg-neutral-900"><option value="unknown">Unknown</option><option value="success">Success</option><option value="failure">Failure</option></select></label>}
      <Action name="fit" label="Fit diagram" onClick={p.onFit} />
      <Action name="minus" label="Zoom out" disabled={p.zoom <= .1} onClick={p.onZoomOut} />
      <span className="min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400" aria-label="Zoom">{Math.round(p.zoom * 100)}%</span>
      <IconButton icon="Add" size="xs" variant="ghost" color="slate" disabled={p.zoom >= 2} srLabel="Zoom in" tooltip="Zoom in" onClick={p.onZoomIn} />
      <IconButton icon="Reset" size="xs" variant="ghost" color="slate" srLabel="Reset view" tooltip="Reset view" onClick={p.onReset} />
  </div>;
}
