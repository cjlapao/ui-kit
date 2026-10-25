import { useState } from "react";
import { PageBodyLayout, PageHeader, SidePanel, WorkflowTrackerRail, type PanelVariant } from "@cjlapao/ui-kit";

export default function WorkspaceLayout() {
  const [variant, setVariant] = useState<PanelVariant>("outlined");
  const [active, setActive] = useState("survey");
  return (
    <div className="w-full space-y-3">
      <label className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">Surface
        <select aria-label="Workspace surface" value={variant} onChange={(event) => setVariant(event.target.value as PanelVariant)} className="rounded-lg border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
          {["elevated", "outlined", "subtle", "tonal", "default", "glass", "liquid-glass", "simple"].map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <div className="h-[640px] w-full">
        <PageBodyLayout variant={variant} corner="rounded-md" minCenterWidth={220}
          header={<PageHeader variant={variant} corner="none" start={<strong>Loop workspace</strong>} end={<span className="text-xs text-emerald-600 dark:text-emerald-400">Running · survey</span>} />}
          left={{ label: "Workflow", defaultSize: 220, showToggle: false, content: ({ collapsed, setCollapsed, size }) => (
            <WorkflowTrackerRail variant={variant} corner="none" side="left" collapsible collapsed={collapsed} onCollapsedChange={setCollapsed} fillHeight style={{ width: size }}
              data={{ title: "Execution path", activeStepId: active, steps: [
                { id: "start", label: "Start", status: "done" },
                { id: "survey", label: "Survey", status: "running" },
                { id: "approve", label: "Approve", status: "blocked" },
                { id: "summarise", label: "Summarise", status: "not_started" },
              ] }} onStepSelect={setActive} />
          ) }}
          right={{ label: "Files", defaultSize: 220, minSize: 160, maxSize: 420, content: (
            <SidePanel docked isOpen title="Files in scope" variant={variant} corner="none">
              <div className="space-y-3 p-4 text-sm text-neutral-600 dark:text-neutral-300">
                {["cmd/", "main.go", "SURVEY.md", "Makefile", "go.mod", "README.md"].map(file => <div key={file} className="rounded-lg px-2 py-2 hover:bg-neutral-100 dark:hover:bg-white/5">{file}</div>)}
                <label className="block">Draft note<input aria-label="File draft note" placeholder="State survives collapsing…" className="mt-2 w-full rounded-lg border border-neutral-300 bg-transparent p-2 dark:border-neutral-700" /></label>
              </div>
            </SidePanel>
          ) }}
          bottom={{ label: "Terminal", defaultSize: 160, minSize: 80, maxSize: 320, content: (
            <SidePanel docked isOpen title="Terminal" variant={variant} corner="none">
              <pre className="p-4 text-xs leading-6 text-neutral-700 dark:text-neutral-300">{"$ go test ./...\nok   workspace/cmd\n\n$ agent survey\nInspecting repository…"}</pre>
            </SidePanel>
          ) }}>
          <div className="space-y-5 p-5 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            <h3 className="text-lg font-semibold">{active === "survey" ? "Surveying the workspace" : `Step: ${active}`}</h3>
            <p>Collapse any surrounding region. Drag the left edge of Files or the top edge of Terminal: this centre region adjusts to the remaining space.</p>
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700"><span className="text-xs text-neutral-500">Activity {i + 1}</span><p>Reading source files and collecting findings for the review.</p></div>)}
          </div>
        </PageBodyLayout>
      </div>
    </div>
  );
}
