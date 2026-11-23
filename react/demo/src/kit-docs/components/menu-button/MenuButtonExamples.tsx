import { useState, type ReactNode } from "react";
import { MenuButton, Pill, type MenuItem } from "@cjlapao/ui-kit";

/* ------------------------------------------------------------------ *
 * 1. Model selector — the Claude-style picker: title + subtitle rows,
 *    right-aligned selection check, an Effort submenu with a header
 *    note and value echo, a More models submenu with usage-credit
 *    badges, and a plan note in the footer.
 * ------------------------------------------------------------------ */

const EFFORTS: { id: string; label: string; badge?: ReactNode; }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium", badge: <Pill size="xs" tone="blue">Recommended</Pill> },
  { id: "high", label: "High" },
  { id: "extra", label: "Extra" },
  { id: "max", label: "Max", badge: <Pill size="xs" tone="amber" icon="Warning">5× or more usage</Pill> },
];

const MORE_MODELS: { id: string; label: string; credits?: boolean }[] = [
  { id: "fable-5-2", label: "Fable 5.2", credits: true },
  { id: "opus-5-5", label: "Opus 5.5" },
  { id: "haiku-5-5", label: "Haiku 5.5" },
  { id: "fable-5-1", label: "Fable 5.1", credits: true },
  { id: "fable-5", label: "Fable 5", credits: true },
  { id: "opus-5", label: "Opus 5" },
  { id: "opus-4-8", label: "Opus 4.8" },
  { id: "opus-4-7", label: "Opus 4.7" },
  { id: "opus-4-6", label: "Opus 4.6" },
  { id: "opus-3", label: "Opus 3" },
  { id: "sonnet-5", label: "Sonnet 5" },
  { id: "sonnet-4-6", label: "Sonnet 4.6" },
];

function ModelSelectorExample() {
  const [model, setModel] = useState({ id: "sonnet-5-5", label: "Sonnet 5.5" });
  const [effort, setEffort] = useState("medium");
  const effortLabel = EFFORTS.find(e => e.id === effort)?.label ?? "Medium";
  const items: MenuItem[] = [
    { id: "sonnet-5-5", label: "Sonnet 5.5", description: "Most efficient for simpler tasks", command: item => setModel({ id: item.id, label: "Sonnet 5.5" }) },
    {
      id: "effort",
      label: "Effort",
      trailing: effortLabel,
      submenuHeader: "Higher effort means more thorough responses, but takes longer and uses your limits faster.",
      items: EFFORTS.map(e => ({ id: e.id, label: e.label, badge: e.badge, closeOnSelect: false, command: (item: MenuItem) => setEffort(item.id) })),
    },
    {
      id: "more-models",
      label: "More models",
      items: MORE_MODELS.map(m => ({
        id: m.id,
        label: m.label,
        badge: m.credits ? <Pill size="xs" tone="neutral" icon="Info">Requires usage credits</Pill> : undefined,
        // Picking a model ends the whole interaction — an explicit closeOnSelect
        // closes the menu even though the row lives inside a submenu.
        closeOnSelect: true,
        command: (item: MenuItem) => setModel({ id: item.id, label: m.label }),
      })),
    },
  ];
  return (
    <MenuButton
      icon="Brain"
      title={model.label}
      subtitle="Most efficient for simpler tasks"
      pill={{ label: effortLabel, tone: "neutral" }}
      variant="ghost"
      color="neutral"
      weight="semibold"
      items={items}
      selectedKey={model.id}
      menuPlacement="top"
      menuWidth={340}
      menuMaxHeight={360}
      menuFooter={<div className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400">Fable is included in Max and Ultra plans, or available with usage credits on Pro. <a href="#learn-more" className="underline" onClick={event => event.preventDefault()}>Learn more</a></div>}
    />
  );
}

/* ------------------------------------------------------------------ *
 * 2. Settings / mode switcher — icon + title + pill with the current
 *    mode, groups, separators, shortcuts, disabled and danger rows.
 * ------------------------------------------------------------------ */

const MODES = { auto: { label: "Auto", tone: "emerald" as const, icon: "Star" as const }, manual: { label: "Manual", tone: "blue" as const, icon: "Info" as const }, plan: { label: "Plan", tone: "amber" as const, icon: "Brain" as const } };

function ModeSwitcherExample() {
  const [mode, setMode] = useState<keyof typeof MODES>("manual");
  const [notify, setNotify] = useState(true);
  const [autosave, setAutosave] = useState(false);
  const [log, setLog] = useState("Pick a mode");
  const items: MenuItem[] = [
    { id: "execution", type: "group", label: "Execution mode", items: [
      { id: "auto", label: "Auto", description: "Run tools without asking", icon: "Star", shortcut: "⇧⌘A", command: () => { setMode("auto"); setLog("Mode → Auto"); } },
      { id: "manual", label: "Manual", description: "Ask before every action", icon: "Info", shortcut: "⇧⌘M", command: () => { setMode("manual"); setLog("Mode → Manual"); } },
      { id: "plan", label: "Plan", description: "Draft first, act later", icon: "Brain", disabled: true },
    ] },
    { id: "sep", type: "separator" },
    { id: "safety", type: "group", label: "Safety", items: [
      { id: "notify", label: "Notify on completion", type: "toggle", checked: notify, onCheckedChange: value => { setNotify(value); setLog(`Notify → ${value}`); } },
      { id: "autosave", label: "Autosave drafts", type: "toggle", checked: autosave, onCheckedChange: value => { setAutosave(value); setLog(`Autosave → ${value}`); } },
    ] },
    { id: "sep-2", type: "separator" },
    { id: "reset", label: "Reset preferences", icon: "Warning", danger: true, command: () => { setMode("manual"); setNotify(true); setAutosave(false); setLog("Preferences reset"); } },
  ];
  const current = MODES[mode];
  return (
    <div className="flex items-center gap-4">
      <MenuButton
        icon={current.icon}
        title={current.label}
        subtitle={mode === "auto" ? "Run tools without asking" : "Ask before every action"}
        pill={{ label: notify ? "Notify" : "Quiet", tone: notify ? "emerald" : "neutral" }}
        variant="outline"
        color="neutral"
        items={items}
        selectedKey={mode}
      />
      <span className="text-xs text-neutral-500" aria-live="polite">{log}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Deeply nested action menu — tiered two levels deep, checkboxes
 *    inside the menu, and an edge-collision demo: the trigger sits at
 *    the bottom-right corner, so the popup flips upward and the
 *    viewport space cap makes the tall menu scroll internally.
 * ------------------------------------------------------------------ */

const EXPORTS = Array.from({ length: 24 }, (_, index) => ({ id: `format-${index}`, label: `Format ${index + 1}` }));

function NestedActionExample() {
  const [lines, setLines] = useState(true);
  const [metadata, setMetadata] = useState(false);
  const [toc, setToc] = useState(true);
  const [last, setLast] = useState("Nothing exported yet");
  const items: MenuItem[] = [
    { id: "export-as", label: "Export as", icon: "File", items: [
      { id: "documents", label: "Documents", icon: "Folder", items: [
        { id: "pdf", label: "PDF", shortcut: "⌘E", command: () => setLast("Exported PDF") },
        { id: "docx", label: "DOCX", command: () => setLast("Exported DOCX") },
      ] },
      { id: "images", label: "Images", icon: "Folder", items: [
        { id: "png", label: "PNG", command: () => setLast("Exported PNG") },
        { id: "svg", label: "SVG", command: () => setLast("Exported SVG") },
      ] },
    ] },
    { id: "include", label: "Include", icon: "ViewRows", items: [
      { id: "lines", label: "Line numbers", type: "checkbox", checked: lines, onCheckedChange: setLines },
      { id: "metadata", label: "Metadata", type: "checkbox", checked: metadata, onCheckedChange: setMetadata },
      { id: "toc", label: "Table of contents", type: "checkbox", checked: toc, onCheckedChange: setToc },
    ] },
    { id: "sep", type: "separator" },
    { id: "delete", label: "Delete draft", icon: "Warning", danger: true },
  ];
  const edgeItems: MenuItem[] = [
    ...EXPORTS,
    { id: "delete", label: "Delete draft", icon: "Warning", danger: true },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <MenuButton icon="File" title="Export" pill={{ label: "PDF", tone: "blue" }} items={items} />
        <p className="text-xs text-neutral-500" aria-live="polite">{last}</p>
      </div>
      <div className="flex h-72 items-end justify-end overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5" aria-label="Bottom-right collision demo — the menu flips up and scrolls">
        <MenuButton icon="File" title="Export to" menuPlacement="bottom" menuMaxHeight={160} menuWidth={240} items={edgeItems} />
      </div>
    </div>
  );
}

export default function MenuButtonExamples() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Model selector</h3>
        <p className="text-xs text-neutral-500">Selection check on the chosen model, value echo on Effort, tiered submenus with badge pills, plan note in the footer.</p>
        <div className="flex min-h-24 items-end"><ModelSelectorExample /></div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Settings / mode switcher</h3>
        <p className="text-xs text-neutral-500">Groups, separators, shortcuts, trailing switch toggles, disabled and danger rows; the pill tracks the live state.</p>
        <div className="flex min-h-24 items-center"><ModeSwitcherExample /></div>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Deeply nested actions + edge collision</h3>
        <p className="text-xs text-neutral-500">Two tier levels deep with menu checkboxes (left); bottom-right trigger (right) — the popup flips up and scrolls inside the viewport space cap.</p>
        <NestedActionExample />
      </section>
    </div>
  );
}
