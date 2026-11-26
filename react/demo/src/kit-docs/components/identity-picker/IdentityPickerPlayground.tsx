import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import { HueControl } from "../../shared/HueControl";
import type { SurfaceTone, TrueColor } from "@cjlapao/ui-kit";
import { useState } from "react";
import { FileUpload, IdentityPicker, type ControlSize, type IdentityMode, type IdentityValue, type SurfaceCorner, type SurfacePadding, type SurfaceVariant} from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { controlSizeOptions, panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";

const IDENTITY_MODE_ORDER: IdentityMode[] = ["emoji", "image", "monogram"];
const MODE_TOGGLE_LABELS: Record<IdentityMode, string> = { emoji: "Emoji", image: "Image upload", monogram: "Monogram" };
// The avatar rides the shared control scale, with an explicit rung back to following `size`.
const iconSizeOptions = [{ label: "Follow size", value: "auto" }, ...controlSizeOptions];

/** Shared playground controls keep both upload components on the same scales. */
export function IdentityPickerPlayground({ fileOnly = false }: { fileOnly?: boolean }) {
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [tone, setTone] = useState<SurfaceTone>("none");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [padding, setPadding] = useState<SurfacePadding>("sm");
  // The card on a background of its own tint needs the forced first nesting
  // step before the eye can find it — both upload components take it.
  const [raisedSurface, setRaisedSurface] = useState(false);
  // The three fields inside the card (search, category, initials) may wear a fill hue
  // and an accent the card itself does not. `undefined` leaves each on the card's own.
  const [inputTone, setInputTone] = useState<TrueColor | undefined>(undefined);
  const [inputFillTone, setInputFillTone] = useState<TrueColor | undefined>(undefined);
  const [size, setSize] = useState<ControlSize>("md");
  // `auto` leaves the avatar on the component's own ladder — the prop's documented default.
  const [iconSize, setIconSize] = useState<ControlSize | "auto">("auto");
  const [compact, setCompact] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [accept, setAccept] = useState("all");
  const [offer, setOffer] = useState<Record<IdentityMode, boolean>>({ emoji: true, image: true, monogram: true });
  const [identity, setIdentity] = useState<IdentityValue>({ type: "emoji", emoji: "⚡" });
  const [files, setFiles] = useState<File[]>([]);
  const [log, pushLog] = useEventLog();
  // Canonical order regardless of the order the toggles were flipped in.
  const modes = IDENTITY_MODE_ORDER.filter(mode => offer[mode]);
  const surface = { variant, tone, corner, padding, raisedSurface, size, compact, disabled, loading, error: error ? "An example validation error. Please choose another file." : undefined };
  return <PlaygroundPanel controls={<div className="space-y-3"><ControlAccordion groups={[
    { id: "core", title: "Core", controls: <>
      <ToggleRow label="Compact layout" checked={compact} onChange={setCompact} />
      <SelectControl label="Variant" options={surfaceVariantOptions} value={variant} onChange={value => setVariant(value as SurfaceVariant)} />
      <SelectControl label="Size" options={controlSizeOptions} value={size} onChange={value => setSize(value as ControlSize)} />
      {/* The avatar rides its own rung of the same ladder; the upload-only playground has no preview to grow. */}
      {fileOnly ? null : <SelectControl label="Icon size" options={iconSizeOptions} value={iconSize} onChange={value => setIconSize(value as ControlSize | "auto")} />}
      <Control label="Tone"><SurfaceToneSwatches value={tone} onSelect={setTone} /></Control>
      {/* The card's tone paints the card, tiles, chips and tabs; this moves only the fill of the fields nested inside it. Hidden on the upload-only playground, which has no fields. */}
      {fileOnly ? null : <>
        <HueControl label="Input tone" value={inputTone} onChange={setInputTone} autoLabel="Auto — the card's accent" />
        <HueControl label="Input fill tone" value={inputFillTone} onChange={setInputFillTone} autoLabel="None — the variant’s own fill" />
      </>}
      <SelectControl label="Corner" options={panelCornerOptions} value={corner} onChange={value => setCorner(value as SurfaceCorner)} />
      <SelectControl label="Padding" options={panelPaddingOptions} value={padding} onChange={value => setPadding(value as SurfacePadding)} />
      <ToggleRow label="Raised surface" checked={raisedSurface} onChange={setRaisedSurface} />
    </> },
    ...(fileOnly ? [] : [{ id: "modes", title: "Modes", controls: <>
      {IDENTITY_MODE_ORDER.map(mode => <ToggleRow key={mode} label={MODE_TOGGLE_LABELS[mode]} checked={offer[mode]} onChange={checked => setOffer(current => ({ ...current, [mode]: checked }))} />)}
      <p className="text-xs text-neutral-500">One mode drops the tab bar; none leaves just the preview and reset.</p>
    </> }]),
    { id: "states", title: "States", controls: <><ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} /><ToggleRow label="Loading" checked={loading} onChange={setLoading} /><ToggleRow label="Error" checked={error} onChange={setError} /></> },
    ...(fileOnly ? [{ id: "files", title: "Files", controls: <>
      <ToggleRow label="Multiple files" checked={multiple} onChange={setMultiple} />
      <SelectControl label="Accept" value={accept} onChange={setAccept} options={[{value:"all",label:"Any file"},{value:"image/*",label:"Images"},{value:"application/pdf",label:"PDF"}]} />
      <p className="text-xs text-neutral-500">Maximum 5 MB per file and 4 files. Multiple selection appends files.</p>
    </> }] : []),
  ]} /><p className="text-xs text-neutral-500">Selection stays local. The app owns upload requests and persisted values.</p></div>}
    preview={<div className="w-full max-w-2xl space-y-4">{fileOnly
      ? <FileUpload {...surface} value={files} onChange={value => { setFiles(value); pushLog(`onChange → ${value.map(file => file.name).join(", ") || "empty"}`); }} onReject={value => pushLog(`onReject → ${value.map(item => item.code).join(", ")}`)} multiple={multiple} accept={accept === "all" ? undefined : accept} maxSize={5 * 1024 * 1024} maxFiles={4} />
      : <IdentityPicker {...surface} name="Project Atlas" modes={modes} iconSize={iconSize === "auto" ? undefined : iconSize} inputTone={inputTone} inputFillTone={inputFillTone} value={identity} onChange={value => { setIdentity(value); pushLog(`onChange → ${value?.type ?? "reset"}`); }} onReject={value => pushLog(`onReject → ${value.map(item => item.code).join(", ")}`)} />}
      <p className="text-xs text-neutral-500">{fileOnly ? `Selected: ${files.length} file(s)` : `Value: ${identity === null ? "null" : identity.type === "emoji" ? identity.emoji : identity.type === "monogram" ? identity.text : identity.file?.name ?? identity.src}`}</p>
      <EventLogControl log={log} />
    </div>} />;
}
