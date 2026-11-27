import { getSurfaceAccentColor } from "../../theme/Theme";
import React, { useId, useRef, useState } from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "../Panel";
import Button, { type ButtonProps } from "../Button";
import IconButton from "../IconButton";
import CustomIcon from "../CustomIcon";
import { getSurfaceCornerClass, getSideMenuItemTokens, type ControlSize } from "../../theme/Theme";
import { selectFiles, type FileRejection } from "./fileSelection";
import { uploadSizeTokens } from "./sizeTokens";
import { ImagePreview } from "./ImagePreview";

export type { FileRejection } from "./fileSelection";
export interface FileUploadLabels {
  title: string; description: string; browse: string; remove: string; loading: string; empty: string; selectedFiles: string;
}
const defaultLabels: FileUploadLabels = {
  title: "Drop files here", description: "Drag and drop, or browse your device.", browse: "Choose files",
  remove: "Remove", loading: "Processing files…", empty: "No files selected", selectedFiles: "Selected files",
};
/**
 * The browse action's Button styling, as an allowlist — the same shape
 * `PanelAction` uses for its own actions. `size`, `disabled` and `loading`
 * mirror FileUpload's state and the click opens the picker, so the component
 * keeps those; `children` stays the `labels.browse` copy. Omit `color` and the
 * button keeps following the panel `tone`, so a tinted dropzone and its action
 * still agree unless the app says otherwise.
 */
export type FileUploadButtonSettings = Pick<ButtonProps,
  | "variant" | "color" | "weight" | "fullWidth"
  | "leadingIcon" | "trailingIcon" | "accent" | "accentColor" | "iconColor"
  | "glass" | "vibrancy" | "glassOpacity" | "specularMode"
  | "tooltip" | "tooltipPosition" | "tooltipDelay" | "tooltipDisabled"
  | "className" | "onClick">;
export interface FileUploadProps extends Pick<PanelProps, "variant" | "tone" | "padding" | "corner" | "glassOpacity" | "transparency" | "vibrancy" | "specularMode" | "raisedSurface"> {
  /** Render inside an existing surface without an extra surrounding Panel. */
  embedded?: boolean;
  /** Horizontal dropzone and no redundant empty-file caption. @default false */
  compact?: boolean;
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
  accept?: string;
  /** Maximum size per file, in bytes. Unlimited when omitted. */
  maxSize?: number;
  /** Single file by default. Multiple selections append to the existing list. */
  multiple?: boolean;
  /** Default 20 in multiple mode; single mode always allows one. */
  maxFiles?: number;
  size?: ControlSize;
  /** Override the "Choose files" Button. @default { variant: "soft", color: derived from `tone` } */
  browseButton?: FileUploadButtonSettings;
  disabled?: boolean;
  loading?: boolean;
  error?: React.ReactNode;
  preview?: boolean;
  labels?: Partial<FileUploadLabels>;
  /** Customize/localize validation messages. */
  rejectionMessage?: (rejection: FileRejection) => string;
  className?: string;
  "aria-label"?: string;
}
export function FileUpload({ embedded = false, compact = false, value, defaultValue = [], onChange, onReject, accept, maxSize, multiple = false, maxFiles = 20, size = "md", browseButton, disabled = false, loading = false, error, preview = true, labels: overrides, rejectionMessage, className, "aria-label": ariaLabel, ...surface }: FileUploadProps) {
  const density = uploadSizeTokens[size];
  const [internal, setInternal] = useState(defaultValue);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const files = value ?? internal;
  const locked = disabled || loading;
  const labels = { ...defaultLabels, ...overrides };
  const tokens = getSideMenuItemTokens(getSurfaceAccentColor(surface.tone ?? "none"));
  const change = (next: File[]) => { if (value === undefined) setInternal(next); onChange?.(next); };
  const choose = (incoming: File[]) => {
    if (locked || !incoming.length) return;
    const limit = multiple ? Math.max(0, Math.floor(maxFiles)) : 1;
    const result = selectFiles(incoming, { accept, maxSize, capacity: Math.max(0, limit - (multiple ? files.length : 0)) });
    setRejections(result.rejected);
    if (result.rejected.length) onReject?.(result.rejected);
    if (result.accepted.length) change(multiple ? [...files, ...result.accepted] : result.accepted);
  };
  const content = <>
    {/* Drag/drop enhances the native, keyboard-accessible file input and browse button. */}
    <div role="group" aria-label={ariaLabel ?? labels.title} aria-busy={loading || undefined}
      className={classNames("flex items-center border border-dashed transition-colors", compact ? "flex-row text-left" : "flex-col text-center", density.dropzone, getSurfaceCornerClass(surface.corner ?? "rounded-md"), dragging ? [tokens.bg, "border-current"] : "border-neutral-300 dark:border-neutral-600", locked && "opacity-50")}
      onDragEnter={event => { event.preventDefault(); if (!locked) { depth.current++; setDragging(true); } }}
      onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = locked ? "none" : "copy"; }}
      onDragLeave={event => { event.preventDefault(); depth.current = Math.max(0, depth.current - 1); if (!depth.current) setDragging(false); }}
      onDrop={event => { event.preventDefault(); depth.current = 0; setDragging(false); const dropped = Array.from(event.dataTransfer.files ?? []);
        const files = dropped.length ? dropped : Array.from(event.dataTransfer.items ?? []).filter(item => item.kind === "file").map(item => item.getAsFile()).filter((file): file is File => file !== null);
        choose(files); }}>
      <CustomIcon icon="File" size={size} className={classNames("text-neutral-400", density.icon)} />
      <div className={compact ? "min-w-0 flex-1" : undefined}><p className={classNames("font-medium", density.title)}>{loading ? labels.loading : labels.title}</p><p id={`${id}-hint`} className={classNames("mt-1 text-neutral-500 dark:text-neutral-400", density.detail)}>{labels.description}</p></div>
      <input ref={input} id={id} type="file" accept={accept} multiple={multiple} disabled={locked} aria-label={labels.browse} aria-describedby={`${id}-hint`} aria-invalid={Boolean(error || rejections.length) || undefined} className="hidden" onChange={event => { choose(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
      {/* The app's `browseButton` spreads first, so the state the component owns — size, lock, loading, the picker click — always wins. `className` merges instead of replacing, keeping the compact-row `shrink-0`. */}
      <Button {...browseButton} size={size} variant={browseButton?.variant ?? "soft"} color={browseButton?.color ?? getSurfaceAccentColor(surface.tone ?? "none")} className={classNames(compact && "shrink-0", browseButton?.className)} disabled={locked} loading={loading} onClick={event => { input.current?.click(); browseButton?.onClick?.(event); }}>{labels.browse}</Button>
    </div>
    {files.length > 0 ? <ul className="mt-3 space-y-2" aria-label={labels.selectedFiles}>{files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`} className={classNames("flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700", density.row)}>
      {preview && <ImagePreview file={file} alt={file.name} className={classNames("shrink-0 rounded-lg object-contain", density.preview)} />}
      <div className="min-w-0 flex-1"><p className={classNames("truncate", density.title)}>{file.name}</p><p className={classNames("text-neutral-500", density.detail)}>{Math.ceil(file.size / 1024)} KB</p></div>
      <IconButton size={density.remove} icon="Close" variant="ghost" disabled={locked} aria-label={`${labels.remove} ${file.name}`} onClick={() => { setRejections([]); change(files.filter((_, i) => i !== index)); }} />
    </li>)}</ul> : !compact && <p className={classNames("mt-3 text-neutral-500", density.detail)} role="status">{labels.empty}</p>}
    {(error || rejections.length > 0) && <div role="alert" className="mt-3 text-xs text-rose-700 dark:text-rose-300">{error || <ul>{rejections.map((rejection, i) => <li key={i}>{rejectionMessage?.(rejection) ?? rejection.message}</li>)}</ul>}</div>}
  </>;
  return embedded ? <div className={className}>{content}</div>
    : <Panel {...surface} variant={surface.variant ?? "outlined"} tone={surface.tone ?? "none"} padding={surface.padding ?? "sm"} className={className}>{content}</Panel>;
}
export default FileUpload;
