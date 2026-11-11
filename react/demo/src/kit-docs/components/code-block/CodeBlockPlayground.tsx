import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import { useState } from "react";
import { ColorSwatches, CodeBlock, type SurfaceCorner, type SurfaceVariant, type TrueColor } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { panelCornerOptions, surfaceVariantOptions } from "../../shared/options";

const samples: Record<string, string> = {
  typescript: 'type Theme = { color: string; enabled: boolean };\n\nexport const theme: Theme = {\n  color: "blue",\n  enabled: true,\n};\n\n// A longer line to try horizontal scrolling and wrapping.\nexport const description = "Code that fits your theme, with optional editing and exact-source copying.";',
  json: '{\n  "theme": "blue",\n  "readOnly": false,\n  "description": "Code that fits your theme, with optional editing and exact-source copying."\n}',
  bash: '# Build the UI kit\nnpm run build\necho "Ready to use theme-aware code blocks with optional editing and exact-source copying."',
  css: '.code-block {\n  border-radius: 12px;\n  color: var(--color-blue-700);\n}',
  plaintext: 'Plain text needs no syntax grammar.\n\nTry editing, copying, wrapping, or hiding the title.',
};

export function CodeBlockPlayground() {
  const [surfaceTone, setSurfaceTone] = useState<SurfaceTone>("none");
  const [value, setValue] = useState(samples.typescript);
  const [language, setLanguage] = useState("typescript");
  const [filename, setFilename] = useState("example.ts");
  const [color, setColor] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<SurfaceVariant>("subtle");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [readOnly, setReadOnly] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showCopy, setShowCopy] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);
  const [maxHeight, setMaxHeight] = useState(320);

  return <PlaygroundPanel
    controls={<div className="space-y-4">
      <SurfaceToneControl label="Surface tone" value={surfaceTone} onChange={setSurfaceTone} />
      <Control label="Color"><ColorSwatches selectable size="sm" value={color} onSelect={setColor} defaultExpanded /></Control>
      <SelectControl label="Variant" options={surfaceVariantOptions} value={variant} onChange={(next) => setVariant(next as SurfaceVariant)} />
      <SelectControl label="Corner" options={panelCornerOptions} value={corner} onChange={(next) => setCorner(next as SurfaceCorner)} />
      <SelectControl label="Language" options={Object.keys(samples).map((name) => ({ label: name, value: name }))} value={language} onChange={(next) => { setLanguage(next); setValue(samples[next]); }} />
      <Control label="Filename">
        <input aria-label="Filename" value={filename} onChange={(event) => setFilename(event.target.value)} className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
      </Control>
      <Control label={`Maximum height — ${maxHeight}px`}>
        <input aria-label="Maximum height" className="w-full accent-blue-500" type="range" min={100} max={600} step={20} value={maxHeight} onChange={(event) => setMaxHeight(Number(event.target.value))} />
      </Control>
      <ToggleRow label="Read only" checked={readOnly} onChange={setReadOnly} />
      <ToggleRow label="Show title" checked={showTitle} onChange={setShowTitle} />
      <ToggleRow label="Show copy" checked={showCopy} onChange={setShowCopy} />
      <ToggleRow label="Line numbers" checked={showLineNumbers} onChange={setShowLineNumbers} />
      <ToggleRow label="Wrap lines" checked={wrapLines} onChange={setWrapLines} />
      <p className="text-xs opacity-70">Turn off Read only to edit the preview. Line numbers apply to display mode. Changing language loads a new sample.</p>
    </div>}
    preview={<CodeBlock tone={surfaceTone} value={value} onChange={setValue} language={language} filename={filename} color={color} variant={variant} corner={corner} readOnly={readOnly} showTitle={showTitle} showCopy={showCopy} showLineNumbers={showLineNumbers} wrapLines={wrapLines} maxHeight={maxHeight} />}
  />;
}
