import { ColorSwatches, type SurfaceTone } from "@cjlapao/ui-kit";
import { Control } from "./PlaygroundPanel";

export function SurfaceToneSwatches({ value, onSelect }: { value: SurfaceTone; onSelect: (value: SurfaceTone) => void }) {
  return <div className="space-y-3">
    <button type="button" aria-pressed={value === "none"} onClick={() => onSelect("none")} className={`rounded-md border px-3 py-1 text-xs ${value === "none" ? "border-neutral-500 bg-neutral-100 dark:bg-neutral-800" : "border-neutral-300 dark:border-neutral-700"}`}>None — no tint</button>
    <ColorSwatches selectable size="sm" value={value === "none" ? undefined : value} onSelect={onSelect} defaultExpanded />
  </div>;
}

export function SurfaceToneControl({ label = "Tone", value, onChange }: { label?: string; value: SurfaceTone; onChange: (value: SurfaceTone) => void }) {
  return <Control label={label}><SurfaceToneSwatches value={value} onSelect={onChange} /></Control>;
}
