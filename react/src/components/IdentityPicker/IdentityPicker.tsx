import React, { useId, useState } from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "../Panel";
import Tabs from "../Tabs";
import SearchBar from "../SearchBar";
import Input from "../Input";
import Select from "../Select";
import Button from "../Button";
import FileUpload, { type FileRejection } from "../FileUpload";
import { ImagePreview } from "../FileUpload/ImagePreview";
import { getSideMenuItemTokens, getSurfaceCornerClass, getSurfaceTriggerTokens, THIN_SCROLLBAR, type ControlSize } from "../../theme/Theme";
import { compactIdentitySpacing, identitySizeTokens } from "./sizeTokens";
import { IDENTITY_EMOJIS, type IdentityEmoji } from "./emojis";

export type IdentityValue =
  | { type: "emoji"; emoji: string }
  | { type: "image"; file: File; src?: string }
  | { type: "image"; src: string; file?: never }
  | { type: "monogram"; text: string }
  | null;
export interface IdentityPickerLabels {
  title: string; description: string; reset: string; emoji: string; upload: string; monogram: string;
  search: string; recommended: string; all: string; empty: string; initials: string; automatic: string; preview: string; categories: string;
}
const defaults: IdentityPickerLabels = {
  title: "Project identity", description: "Choose an emoji, upload an image, or use monogram initials.",
  reset: "Reset", emoji: "Emoji picker", upload: "Upload image", monogram: "Monogram",
  search: "Search emoji (e.g. rocket, fire, code)", recommended: "Recommended", all: "All",
  categories: "Emoji categories", empty: "No emoji match your search.", initials: "Initials", automatic: "Use automatic initials", preview: "Identity preview",
};
export interface IdentityPickerProps extends Pick<PanelProps, "variant" | "tone" | "padding" | "corner" | "glassOpacity" | "transparency" | "vibrancy" | "specularMode"> {
  value?: IdentityValue;
  defaultValue?: IdentityValue;
  onChange?: (value: IdentityValue) => void;
  onReject?: (rejections: FileRejection[]) => void;
  /** Source name for automatic initials. */
  name?: string;
  emojis?: IdentityEmoji[];
  /** Font-based emoji/initial rendering; fonts are supplied by the app/platform. */
  fontFamily?: string;
  /** Scales preview, emoji glyphs/tiles, typography, spacing and all controls. */
  size?: ControlSize;
  /** Space-saving arrangement. Set false for category chips and stacked fields. @default true */
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: React.ReactNode;
  maxImageSize?: number;
  labels?: Partial<IdentityPickerLabels>;
  uploadLabels?: React.ComponentProps<typeof FileUpload>["labels"];
  className?: string;
}
function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => Array.from(word)[0]).join("").toLocaleUpperCase() || "?";
}
export function IdentityPicker({ value, defaultValue = null, onChange, onReject, name = "", emojis = IDENTITY_EMOJIS,
  fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif', size = "md", compact = true, disabled = false, loading = false, error,
  maxImageSize = 5 * 1024 * 1024, labels: overrides, uploadLabels, className, ...surface }: IdentityPickerProps) {
  const density = identitySizeTokens[size];
  const spacing = compact ? compactIdentitySpacing[size] : density;
  const monogramLayout = compact
    ? classNames("flex flex-wrap items-end gap-2", spacing.panel.split(" ").filter(token => !token.startsWith("space-y-")))
    : spacing.panel;
  // Match SearchBar's line box and override base-select's intrinsic minimum.
  // This keeps both controls vertically aligned in the compact toolbar.
  const categoryLineHeight = size === "xs" || size === "sm" ? "1rem" : size === "md" ? "1.25rem" : "1.5rem";
  const tabsId = useId();
  const [internal, setInternal] = useState<IdentityValue>(defaultValue);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("recommended");
  const selected = value === undefined ? internal : value;
  const labels = { ...defaults, ...overrides };
  const locked = disabled || loading;
  const tone = surface.tone ?? "blue";
  const tokens = getSideMenuItemTokens(tone);
  const automatic = initials(name);
  const change = (next: IdentityValue) => { if (locked) return; if (value === undefined) setInternal(next); onChange?.(next); };
  const categories = Array.from(new Set(emojis.map(emoji => emoji.category)));
  const hasRecommended = emojis.some(item => item.recommended);
  const filtered = emojis.filter(emoji => {
    // Searching covers the entire catalogue, rather than silently hiding matches in other categories.
    if (query.trim()) return [emoji.label, emoji.emoji, ...(emoji.keywords ?? [])].some(value => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
    return category === "all" || (category === "recommended" ? (!hasRecommended || emoji.recommended) : emoji.category === category);
  });
  const previewClass = classNames("flex shrink-0 items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-600", density.preview, getSurfaceCornerClass(surface.corner ?? "rounded-md"), tokens.bg);
  const preview = selected?.type === "image" ? <ImagePreview file={selected.file} src={selected.src} alt={labels.preview} className="h-full w-full object-contain" />
    : <span style={{ fontFamily }} aria-hidden="true">{selected?.type === "emoji" ? selected.emoji : selected?.type === "monogram" ? selected.text : automatic}</span>;
  return <Panel {...surface} variant={surface.variant ?? "outlined"} tone={tone} padding={surface.padding ?? (compact ? "xs" : "sm")} className={className} aria-busy={loading || undefined}>
    <div className={classNames("flex items-start", density.headerGap)}>
      <div className={previewClass} role={selected?.type === "image" ? undefined : "img"} aria-label={selected?.type === "image" ? undefined : `${labels.preview}: ${selected?.type === "emoji" ? selected.emoji : selected?.type === "monogram" ? selected.text : automatic}`}>{preview}</div>
      <div className="min-w-0 flex-1"><h3 className={classNames("font-semibold", density.title)}>{labels.title}</h3><p className={classNames("mt-1 text-neutral-500 dark:text-neutral-400", density.description)}>{labels.description}</p></div>
      <Button size={density.action} variant="ghost" color="neutral" disabled={locked} onClick={() => change(null)}>{labels.reset}</Button>
    </div>
    <div className={spacing.section}>
      <Tabs panelIdPrefix={tabsId} defaultValue={`${tabsId}-${selected?.type === "image" ? "upload" : selected?.type === "monogram" ? "monogram" : "emoji"}`} variant="segmented" color={tone} size={size} fullWidth
        containerClassName=""
        listClassName="rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-white/5"
        className="[&_[role=tab]]:rounded-lg"
        items={[
        { id: `${tabsId}-emoji`, label: labels.emoji, disabled: locked, panel: <div className={spacing.panel}>
          {compact ? <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1"><SearchBar onSearch={setQuery} debounceMs={0} placeholder={labels.search} color={tone} size={size} variant="flat" disabled={locked} /></div>
            <div className="w-36 max-w-[45%] shrink-0"><Select aria-label={labels.categories} style={{ lineHeight: categoryLineHeight, height: categoryLineHeight, minHeight: 0, alignItems: "center" }} value={category} onChange={event => setCategory(event.target.value)} size={size} tone={tone} variant="flat" disabled={locked}>
              <option value="recommended">{labels.recommended}</option><option value="all">{labels.all}</option>
              {categories.map(label => <option key={label} value={label}>{label}</option>)}
            </Select></div>
          </div> : <>
            <SearchBar onSearch={setQuery} debounceMs={0} placeholder={labels.search} color={tone} size={size} variant="flat" disabled={locked} />
            <div className="flex flex-wrap gap-1" aria-label={labels.categories}>
              {[{ id: "recommended", label: labels.recommended }, { id: "all", label: labels.all }, ...categories.map(label => ({ id: label, label }))].map(categoryOption => <Button key={categoryOption.id} size={density.action} variant={category === categoryOption.id ? "soft" : "ghost"} color={tone} aria-pressed={category === categoryOption.id} disabled={locked} onClick={() => setCategory(categoryOption.id)}>{categoryOption.label}</Button>)}
            </div>
          </>}
          <div className={classNames("grid grid-cols-4 gap-1 overflow-y-auto p-1 sm:grid-cols-8", spacing.gridHeight, THIN_SCROLLBAR)} aria-label={labels.emoji}>
            {filtered.map(emoji => <button key={emoji.emoji} type="button" title={emoji.label} aria-label={emoji.label} aria-pressed={selected?.type === "emoji" && selected.emoji === emoji.emoji} disabled={locked}
              className={classNames("flex min-w-0 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-40", density.tile, getSurfaceCornerClass(surface.corner ?? "rounded-sm"), getSurfaceTriggerTokens(tone).focusRing,
                selected?.type === "emoji" && selected.emoji === emoji.emoji ? [tokens.bg, tokens.text, "ring-1 ring-inset ring-current"] : tokens.hoverBg)} style={{ fontFamily }}
              onClick={() => change({ type: "emoji", emoji: emoji.emoji })}
              onKeyDown={event => {
                const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const buttons = Array.from(event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>("button"));
                const index = buttons.indexOf(event.currentTarget);
                const columns = getComputedStyle(event.currentTarget.parentElement!).gridTemplateColumns.split(" ").filter(Boolean).length || 4;
                const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "ArrowDown" ? columns : -columns;
                const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : Math.max(0, Math.min(buttons.length - 1, index + delta));
                buttons[next]?.focus();
              }}>{emoji.emoji}</button>)}
          </div>
          {!filtered.length && <p role="status" className="py-4 text-center text-sm text-neutral-500">{labels.empty}</p>}
        </div> },
        { id: `${tabsId}-upload`, label: labels.upload, disabled: locked, panel: <div className={spacing.panel}><FileUpload embedded compact={compact}
          variant={surface.variant} tone={tone} corner={surface.corner} padding="none" size={size} accept="image/png,image/svg+xml" maxSize={maxImageSize}
          disabled={disabled} loading={loading} labels={{ title: "Drop an image here", description: "SVG or PNG · drag and drop, or browse your device", ...uploadLabels }}
          value={selected?.type === "image" && selected.file ? [selected.file] : []} onReject={onReject}
          onChange={files => change(files[0] ? { type: "image", file: files[0] } : null)} /></div> },
        { id: `${tabsId}-monogram`, label: labels.monogram, disabled: locked, panel: <div className={monogramLayout}>
          <label className={classNames("block", density.description, compact && "min-w-0 flex-1")}><span className="mb-2 block">{labels.initials}</span><Input aria-label={labels.initials} size={size} tone={tone} disabled={locked}
            value={selected?.type === "monogram" ? selected.text : automatic} maxLength={4} onChange={event => change({ type: "monogram", text: event.target.value.toLocaleUpperCase() })} /></label>
          <Button size={size} variant="soft" color={tone} disabled={locked} onClick={() => change({ type: "monogram", text: automatic })}>{labels.automatic}</Button>
        </div> },
      ]} />
    </div>
    {error && <div role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</div>}
  </Panel>;
}
export default IdentityPicker;
