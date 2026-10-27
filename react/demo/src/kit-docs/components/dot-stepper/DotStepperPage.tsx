import { DotStepper, Table, type TableColumn } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
import { DotStepperPlayground, makeSteps } from "./DotStepperPlayground";

type Run = { id: string; name: string; current: number; total: number; done?: boolean };
const runs: Run[] = [
  { id: "a", name: "API deployment", current: 1, total: 10 },
  { id: "b", name: "Workspace checks", current: 4, total: 10 },
  { id: "c", name: "Release pipeline", current: 8, total: 10 },
  { id: "d", name: "Documentation", current: 3, total: 4, done: true },
];
const columns: TableColumn<Run>[] = [
  { id: "name", header: "Run", accessor: "name" },
  { id: "status", header: "Status", accessor: row => row.done ? "Completed" : "Running", render: row => row.done ? "Completed" : `Step ${row.current + 1} of ${row.total}` },
  { id: "progress", header: "Progress", accessor: "current", render: row => <DotStepper aria-label={`${row.name} progress`} steps={makeSteps(row.total).map(step => ({ ...step, status: row.done ? "completed" as const : undefined }))} currentIndex={row.current} renderActiveContent={step => <div className="space-y-1"><strong>{row.name}</strong><p className="text-sm">{step.title}</p></div>} /> },
];

export default function DotStepperPage() {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
    <PageHeader name="Dot Stepper" description="Workflow progress in a small row of dots. The active step stays visible as the window moves; overlapping dots indicate hidden steps on either side." />
    <DotStepperPlayground />
    <ExampleCard title="Inside a table row" description="The same five-step window at the beginning, middle and end of a workflow. Table rows stay compact; active details open in a portaled popover." filename="RunProgress.tsx" code={`<DotStepper
  steps={steps}
  currentIndex={4}
  maxVisible={5}
  size="sm"
  renderActiveContent={(step) => <RunDetails step={step} />}
/>`}><Table data={runs} columns={columns} density="compact" variant="outlined" /></ExampleCard>
    <ExampleCard title="Short flows and custom colours" description="Every step is visible when it fits. The active tone, completed colour and pending colour can be changed independently." filename="ShortFlow.tsx" code={`<DotStepper steps={steps} currentIndex={1} size="lg"
  tone="cyan" doneColor="emerald" nextColor="blue" padding="xs" />`}><div className="flex flex-wrap items-center gap-6"><DotStepper steps={makeSteps(4)} currentIndex={1} size="lg" tone="cyan" nextColor="blue" padding="xs" /><DotStepper steps={makeSteps(4)} currentIndex={2} tone="violet" doneColor="teal" nextColor="slate" /></div></ExampleCard>
    <PropsTable props={[
      { name: "steps", type: "DotStepperStep[]", description: "Existing StepperStep fields plus an optional plain-text tooltip for React-node titles. Explicit statuses override inferred completed/active/pending states." },
      { name: "currentIndex / currentStepId", type: "number / string", description: "Zero-based index; matching id wins. Defaults to the explicitly active step, then first unfinished step. All-completed flows have no active dot." },
      { name: "maxVisible", type: "number", default: "5", description: "Number of actual step dots. Extra overflow stacks do not consume slots. The window centres on the current step and clamps at either end; even limits favour upcoming steps." },
      { name: "size", type: "ControlSize", default: "sm", description: "Shared xs–xl scale for dots, targets, gaps and overflow stacks. Small defaults suit table rows." },
      { name: "tone / doneColor / nextColor / errorColor", type: "TrueColor", default: "blue / emerald / neutral / rose", description: "Active/surface, completed, pending and failed colours. Pending dots use a quiet translucent fill in both themes." },
      { name: "variant / padding / corner", type: 'SurfaceVariant / SurfacePadding / SurfaceCorner | "full"', default: "tonal / none / full", description: "Shared Panel surface, glass options and corners; full gives a pill shape. Padding uses the shared compact scale at half the Panel inset: xs 4/6px, sm 8/10px, md 12/16px, lg 16/20px, xl 20/24px (base/sm breakpoint). No extra layout space is added for the pulse." },
      { name: "renderActiveContent / popoverProps", type: "(step, index) => ReactNode / Popover options", description: "Optional consumer content on the active dot. Uses the kit Popover with keyboard, Escape, outside click and positioning. Changing the active step removes stale content. visible is managed internally." },
      { name: "onStepSelect", type: "(step, index) => void", description: "Reports clicks without changing workflow progress. The consumer owns progression." },
      { name: "animated / disabled", type: "boolean", default: "true / false", description: "Only active dots pulse. Reduced-motion preferences suppress the halo. Disabled blocks selection and popovers; individual step.disabled is also honored." },
    ]} />
  </div>;
}
