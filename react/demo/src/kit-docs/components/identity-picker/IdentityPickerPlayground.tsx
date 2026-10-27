import { useState } from "react";
import { ColorSwatches, FileUpload, IdentityPicker, type ControlSize, type IdentityValue, type SurfaceCorner, type SurfacePadding, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { controlSizeOptions, panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

/** Shared playground controls keep both upload components on the same scales. */
export function IdentityPickerPlayground({ fileOnly = false }: { fileOnly?: boolean }) {
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  const [size, setSize] = useState<ControlSize>("md");
  const [compact, setCompact] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [accept, setAccept] = useState("all");
  const [identity, setIdentity] = useState<IdentityValue>({ type: "emoji", emoji: "⚡" });
  const [files, setFiles] = useState<File[]>([]);
  const [log, pushLog] = useEventLog();
  const surface = { variant, tone, corner, padding, size, compact, disabled, loading, error: error ? "An example validation error. Please choose another file." : undefined };
  return <PlaygroundPanel controls={<div className="space-y-3"><ControlAccordion groups={[
    { id: "core", title: "Core", controls: <>
      <ToggleRow label="Compact layout" checked={compact} onChange={setCompact} />
      <SelectControl label="Variant" options={surfaceVariantOptions} value={variant} onChange={value => setVariant(value as SurfaceVariant)} />
      <SelectControl label="Size" options={controlSizeOptions} value={size} onChange={value => setSize(value as ControlSize)} />
      <Control label="Tone"><ColorSwatches selectable size="sm" value={tone} onSelect={setTone} defaultExpanded /></Control>
      <SelectControl label="Corner" options={panelCornerOptions} value={corner} onChange={value => setCorner(value as SurfaceCorner)} />
      <SelectControl label="Padding" options={panelPaddingOptions} value={padding} onChange={value => setPadding(value as SurfacePadding)} />
    </> },
    { id: "states", title: "States", controls: <><ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} /><ToggleRow label="Loading" checked={loading} onChange={setLoading} /><ToggleRow label="Error" checked={error} onChange={setError} /></> },
    ...(fileOnly ? [{ id: "files", title: "Files", controls: <>
      <ToggleRow label="Multiple files" checked={multiple} onChange={setMultiple} />
      <SelectControl label="Accept" value={accept} onChange={setAccept} options={[{value:"all",label:"Any file"},{value:"image/*",label:"Images"},{value:"application/pdf",label:"PDF"}]} />
      <p className="text-xs text-neutral-500">Maximum 5 MB per file and 4 files. Multiple selection appends files.</p>
    </> }] : []),
  ]} /><p className="text-xs text-neutral-500">Selection stays local. The app owns upload requests and persisted values.</p></div>}
    preview={<div className="w-full max-w-2xl space-y-4">{fileOnly
      ? <FileUpload {...surface} value={files} onChange={value => { setFiles(value); pushLog(`onChange → ${value.map(file => file.name).join(", ") || "empty"}`); }} onReject={value => pushLog(`onReject → ${value.map(item => item.code).join(", ")}`)} multiple={multiple} accept={accept === "all" ? undefined : accept} maxSize={5 * 1024 * 1024} maxFiles={4} />
      : <IdentityPicker {...surface} name="Project Atlas" value={identity} onChange={value => { setIdentity(value); pushLog(`onChange → ${value?.type ?? "reset"}`); }} onReject={value => pushLog(`onReject → ${value.map(item => item.code).join(", ")}`)} />}
      <p className="text-xs text-neutral-500">{fileOnly ? `Selected: ${files.length} file(s)` : `Value: ${identity === null ? "null" : identity.type === "emoji" ? identity.emoji : identity.type === "monogram" ? identity.text : identity.file?.name ?? identity.src}`}</p>
      <EventLogControl log={log} />
    </div>} />;
}
