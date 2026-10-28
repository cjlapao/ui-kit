import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import WorkspaceLayout from "./WorkspaceLayout";
import code from "./WorkspaceLayout.tsx?raw";
import { PropsTable } from "../../shared/A11ySections";

export default function PageBodyLayoutPage() {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8">
    <PageHeader name="Page Body Layout" description="A header above a centre with left, right and bottom zones. The layout holds no state: each zone is as big as what you put in it, and the centre takes the rest. The bottom zone spans only the centre." />
    <ExampleCard title="Resizable workspace" description="The workflow rail and the two docked SidePanels collapse, animate and resize themselves; the zones follow and the centre adjusts. The Terminal is a SidePanel docked to the bottom: it folds to its header and expands upward, and its grip sits on its top edge." code={code} filename="WorkspaceLayout.tsx"><WorkspaceLayout /></ExampleCard>
    <p className="text-sm text-neutral-500 dark:text-neutral-400">Give the layout a bounded height. Left and right zones stretch their content to the body's height; the bottom zone stretches it to the centre's width. A docked SidePanel takes width (or height for side="bottom"), resizable and collapsible itself.</p>
    <PropsTable props={[
      { name: "padding", type: "SurfacePadding", default: '"xs"', description: "Outer body inset on the shared responsive Panel scale: none, xs, sm, md, lg, xl. Independent of gap. None/plain variants have no outer inset." },
      { name: "centerPadding", type: "SurfacePadding", default: '"none"', description: "Padding inside the center on the shared responsive scale. Does not change the side or bottom panels." },
      { name: "gap", type: "number", default: "8", description: "Spacing between zones in pixels, independent of padding." },
    ]} />
  </div>;
}
