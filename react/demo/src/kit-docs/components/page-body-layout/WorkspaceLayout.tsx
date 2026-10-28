import { useState } from "react";
import {
  PageBodyLayout,
  PageHeader,
  SidePanel,
  Terminal,
  WorkflowTrackerRail,
  PAGE_BODY_LAYOUT_VARIANTS,
  type PageBodyLayoutVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { panelCornerOptions, panelPaddingOptions, surfaceVariantOptions, trueColorOptions } from "../../shared/options";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";

const GLASS_VARIANTS: PageBodyLayoutVariant[] = ["default", "glass", "liquid-glass"];

const files = ["cmd/", "internal/", "main.go", "SURVEY.md", "Makefile", "go.mod", "README.md"];
const steps = [
  { id: "start", label: "Start", status: "done" as const },
  { id: "survey", label: "Survey", status: "running" as const },
  { id: "approve", label: "Approve", status: "blocked" as const },
  { id: "summarise", label: "Summarise", status: "not_started" as const },
];
const terminalOutput =
  "\x1b[90m~/workspace\x1b[0m $ go test ./...\r\n" +
  "\x1b[32mok\x1b[0m   workspace/cmd       0.412s\r\n" +
  "\x1b[32mok\x1b[0m   workspace/internal  0.207s\r\n\r\n" +
  "\x1b[90m~/workspace\x1b[0m $ agent survey\r\n" +
  "\x1b[36m›\x1b[0m Inspecting repository…\r\n";

/**
 * The layout is only zones. The rail and the two docked SidePanels collapse,
 * animate and resize themselves; their zones follow, and the centre takes
 * whatever space is left.
 */
export default function WorkspaceLayout() {
  // The layout's own surface — `none` leaves only the zone wireframe — and
  // the surface the controls in the zones draw for themselves.
  const [layoutVariant, setLayoutVariant] = useState<PageBodyLayoutVariant>("outlined");
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [bodyPadding, setBodyPadding] = useState<SurfacePadding>("xs");
  const [centerPadding, setCenterPadding] = useState<SurfacePadding>("none");
  // The panels' float off the zone edges beside their docked one.
  const [inset, setInset] = useState<SurfacePadding>("none");
  const [showRail, setShowRail] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [backdrop, setBackdrop] = useState(false);
  const [active, setActive] = useState("survey");
  // See-through surfaces need something behind them to be judged against.
  const showBackdrop = backdrop || (GLASS_VARIANTS as string[]).includes(variant) || GLASS_VARIANTS.includes(layoutVariant);
  const surface = { variant, corner, tone };

  const controls = (
    <div className="grid gap-4 sm:grid-cols-5">
      <SelectControl label="Body padding" options={panelPaddingOptions} value={bodyPadding} onChange={value => setBodyPadding(value as SurfacePadding)} />
      <SelectControl label="Center padding" options={panelPaddingOptions} value={centerPadding} onChange={value => setCenterPadding(value as SurfacePadding)} />
      <SelectControl label="Layout surface" options={PAGE_BODY_LAYOUT_VARIANTS.map((v) => ({ label: v, value: v }))} value={layoutVariant} onChange={(v) => setLayoutVariant(v as PageBodyLayoutVariant)} />
      <SelectControl label="Controls surface" options={surfaceVariantOptions} value={variant} onChange={(v) => setVariant(v as SurfaceVariant)} />
      <SelectControl label="Corner" options={panelCornerOptions} value={corner} onChange={(v) => setCorner(v as SurfaceCorner)} />
      <SelectControl label="Tone" options={trueColorOptions} value={tone} onChange={(v) => setTone(v as TrueColor)} />
      <SelectControl label="Panel inset" options={panelPaddingOptions} value={inset} onChange={(v) => setInset(v as SurfacePadding)} />
      <div className="grid gap-x-6 gap-y-2 sm:col-span-5 sm:grid-cols-4">
        <ToggleRow label="Workflow rail" checked={showRail} onChange={setShowRail} />
        <ToggleRow label="Files panel" checked={showFiles} onChange={setShowFiles} />
        <ToggleRow label="Terminal" checked={showTerminal} onChange={setShowTerminal} />
        <ToggleRow label="Backdrop" checked={showBackdrop} onChange={setBackdrop} />
      </div>
    </div>
  );

  const preview = (
    <div className="relative h-[680px] w-full overflow-hidden rounded-2xl">
      {showBackdrop && <>
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center dark:hidden" style={{ backgroundImage: `url(${backdropLight})` }} />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-cover bg-center dark:block" style={{ backgroundImage: `url(${backdropDark})` }} />
      </>}
      <div className={showBackdrop ? "relative h-full p-4" : "relative h-full"}>
      <PageBodyLayout variant={layoutVariant} corner={corner} tone={tone} minCenterWidth={220} padding={bodyPadding} centerPadding={centerPadding}
        header={<PageHeader variant={layoutVariant} tone={tone} corner="none"
          start={<strong>Loop workspace</strong>}
          end={<span className="text-xs text-emerald-600 dark:text-emerald-400">Running · {active}</span>} />}
        left={showRail && (
          <WorkflowTrackerRail {...surface} side="left" flush={false} fillHeight collapsible style={{ width: 240 }}
            data={{ title: "Execution path", activeStepId: active, steps }} onStepSelect={setActive} />
        )}
        right={showFiles && (
          <SidePanel docked isOpen collapsible resizable inset={inset} width={260} minWidth={180} maxWidth={440}
            title="Files in scope" subtitle={`${files.length} items`} variant={variant} surfaceTone={tone} corner={corner}>
            <div className="space-y-1 px-3 pb-4 text-sm text-neutral-700 dark:text-neutral-300">
              {files.map(file => <div key={file} className="truncate rounded-lg px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-white/5">{file}</div>)}
              <label className="block px-2 pt-3 text-xs text-neutral-500 dark:text-neutral-400">Draft note
                <input aria-label="File draft note" placeholder="State survives collapsing…" className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-transparent p-2 text-sm dark:border-neutral-700" />
              </label>
            </div>
          </SidePanel>
        )}
        bottom={showTerminal && (
          <SidePanel docked side="bottom" isOpen collapsible resizable inset={inset} height={220} minHeight={120} maxHeight={400}
            title="Terminal" variant={variant} surfaceTone={tone} corner={corner}>
            <div className="h-full px-3 pb-3">
              <Terminal height="100%" variant="simple" corner="rounded-sm" readOnly initialData={terminalOutput} />
            </div>
          </SidePanel>
        )}>
        <div className="space-y-4 p-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{active === "survey" ? "Surveying the workspace" : `Step: ${active}`}</h3>
          <p>Collapse the rail, Files or Terminal from their own headers, or drag the grips in the gutters: this centre takes whatever space is left.</p>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Activity {i + 1}</span>
              <p>Reading source files and collecting findings for the review.</p>
            </div>
          ))}
        </div>
      </PageBodyLayout>
      </div>
    </div>
  );

  return <div className="w-full space-y-4">{controls}{preview}</div>;
}
