import { useId, useRef, useState } from "react";
import { Button, ConnectionFlow, Input, Select, SidePanel } from "@cjlapao/ui-kit";
import type { ConnectionFlowConnection, ConnectionFlowHandle, ConnectionFlowNode, ConnectionFlowPlacement, TrueColor } from "@cjlapao/ui-kit";

const INITIAL_NODES: ConnectionFlowNode[] = [
  { id: "start", gridPosition: { column: 0, row: 0 }, title: "Start", subtitle: "Drag near any border to add a step", tone: "blue", height: 112 },
  { id: "review", gridPosition: { column: 1, row: 0 }, title: "Review", subtitle: "Click the middle to edit this node", tone: "amber", height: 112 },
];
const TONES: TrueColor[] = ["blue", "emerald", "amber", "rose", "violet", "neutral"];
type Editor = { id: string; placement?: ConnectionFlowPlacement; title: string; subtitle: string; tone: TrueColor; height: number; connectTo?: string };

export default function EditMode() {
  const flow = useRef<ConnectionFlowHandle>(null);
  const fieldId = useId();
  const [editing, setEditing] = useState(true);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState<ConnectionFlowConnection[]>([
    { id: "start-review", fromId: "start", toId: "review" },
  ]);
  const [editor, setEditor] = useState<Editor | null>(null);
  const close = () => {
    if (editor?.placement) flow.current?.dismissGhost(editor.id);
    setEditor(null);
  };
  const valid = !!editor?.title.trim() && Number.isFinite(editor.height) && editor.height >= 72 && editor.height <= 240;
  const save = () => {
    if (!editor || !valid) return;
    const { id, title, subtitle, tone, height, placement } = editor;
    const properties = { title: title.trim(), subtitle: subtitle.trim(), tone, height };
    setNodes(current => {
      if (!placement) return current.map(node => node.id === id ? { ...node, ...properties } : node);
      const next = [...current];
      const index = next.findIndex(node => node.id === placement.sourceId);
      if (index < 0) return current;
      const newNode: ConnectionFlowNode = { id, ...properties, gridPosition: placement.gridPosition };
      next.push(newNode);
      return next;
    });
    if (!placement && editor.connectTo) setConnections(current =>
      current.some(c => c.fromId === id && c.toId === editor.connectTo) ? current : [...current, {
        id: `${id}->${editor.connectTo}`, fromId: id, toId: editor.connectTo!,
      }]);
    if (placement) setConnections(current => [...current, {
      id: `link-${id}`, fromId: placement.sourceId, toId: id,
      fromSide: placement.side,
      toSide: ({ top: "bottom", bottom: "top", left: "right", right: "left" } as const)[placement.side],
    }]);
    setEditor(null);
  };
  return <div className="relative w-full min-w-0 space-y-3 overflow-hidden rounded-xl">
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" color="blue" size="sm" onClick={() => setEditing(value => !value)}>
        {editing ? "Finish editing" : "Edit flow"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { close(); setNodes(INITIAL_NODES); setConnections([{ id: "start-review", fromId: "start", toId: "review" }]); }}>Reset example</Button>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Drag from an edge into empty space to add a node, or onto another card to connect it. Click the middle to edit.</p>
    </div>
    <ConnectionFlow ref={flow} nodes={nodes} connections={connections} editMode={editing} tone="blue" height={460}
      title="Build your flow" progressType="none"
      onConnect={({ sourceId, targetId, sourceSide, targetSide }) => setConnections(current =>
        current.some(c => c.fromId === sourceId && c.toId === targetId) ? current : [...current, {
          id: `${sourceId}->${targetId}`, fromId: sourceId, toId: targetId, fromSide: sourceSide, toSide: targetSide,
        }])}
      onNodeClick={node => {
        if (!editing) return;
        setEditor({ id: node.id, title: typeof node.title === "string" ? node.title : "", subtitle: typeof node.subtitle === "string" ? node.subtitle : "", tone: node.tone ?? "blue", height: node.height ?? 112 });
      }}
      onNodeCreate={(id, placement) => setEditor({ id, placement, title: "New step", subtitle: "", tone: "blue", height: 112 })} />
    <SidePanel isOpen={!!editor} onClose={close} title={editor?.placement ? "Create node" : "Edit node"}
      subtitle={editor?.placement ? `Connected ${editor.placement.side} of ${nodes.find(node => node.id === editor.placement!.sourceId)?.title ?? editor.placement.sourceId}` : "Update this node’s appearance"}
      width={340} overlay tone="blue" variant="floating"
      onKeyDown={event => { if (event.key === "Escape") close(); }}
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={close}>Cancel</Button><Button color="blue" disabled={!valid} onClick={save}>{editor?.placement ? "Create node" : "Save changes"}</Button></div>}>
      {editor && <form onSubmit={event => { event.preventDefault(); save(); }} className="space-y-4 p-4">
        <div className="space-y-1"><label htmlFor={`${fieldId}-title`} className="text-sm font-medium">Title</label>
          <Input id={`${fieldId}-title`} value={editor.title} onChange={event => setEditor({ ...editor, title: event.target.value })} /></div>
        <div className="space-y-1"><label htmlFor={`${fieldId}-subtitle`} className="text-sm font-medium">Subtitle</label>
          <Input id={`${fieldId}-subtitle`} value={editor.subtitle} onChange={event => setEditor({ ...editor, subtitle: event.target.value })} /></div>
        <div className="space-y-1"><label htmlFor={`${fieldId}-tone`} className="text-sm font-medium">Tone</label>
          <Select id={`${fieldId}-tone`} value={editor.tone} onChange={event => setEditor({ ...editor, tone: event.target.value as TrueColor })}>
            {TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
          </Select></div>
        <div className="space-y-1"><label htmlFor={`${fieldId}-height`} className="text-sm font-medium">Height (72–240px)</label>
          <Input id={`${fieldId}-height`} type="number" min={72} max={240} value={editor.height} onChange={event => setEditor({ ...editor, height: Number(event.target.value) })} /></div>
        {!editor.placement && <div className="space-y-1">
          <label htmlFor={`${fieldId}-connect`} className="text-sm font-medium">Add connection to</label>
          <Select id={`${fieldId}-connect`} value={editor.connectTo ?? ""}
            onChange={event => setEditor({ ...editor, connectTo: event.target.value })}>
            <option value="">No additional connection</option>
            {nodes.filter(node => node.id !== editor.id && !connections.some(c => c.fromId === editor.id && c.toId === node.id))
              .map(node => <option key={node.id} value={node.id}>{node.title}</option>)}
          </Select>
        </div>}
        {editor.placement && <p className="text-xs text-neutral-500 dark:text-neutral-400">The dashed node remains a draft until you create it. Cancel removes it.</p>}
        <button type="submit" className="sr-only" tabIndex={-1}>Save node</button>
      </form>}
    </SidePanel>
  </div>;
}
