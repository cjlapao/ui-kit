import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import WorkspaceLayout from "./WorkspaceLayout";
import code from "./WorkspaceLayout.tsx?raw";

export default function PageBodyLayoutPage() {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8">
    <PageHeader name="Page Body Layout" description="A header and centre with independent left, right, and bottom regions. Panels reserve space: collapsing or resizing them changes the centre's available dimensions. The bottom region spans only the centre." />
    <ExampleCard title="Resizable workspace" description="The workflow rail supplies its own collapse toggle. Files and Terminal use the layout's toggles and resize separators. Keyboard: arrows resize by 20px; Home/End select the limits. On small containers the workspace scrolls to preserve the centre's minimum size." code={code} filename="WorkspaceLayout.tsx"><WorkspaceLayout /></ExampleCard>
    <p className="text-sm text-neutral-500">Give the layout a bounded height. Region content may be a node or a function receiving collapsed, setCollapsed, and size. Use size/onSizeChange and collapsed/onCollapsedChange for controlled state; defaultSize/defaultCollapsed for internal state. Docked SidePanel fills the region; the layout owns resizing. Panel surface variants apply to the layout and PageHeader. PageHeader retains its legacy default and floating treatments.</p>
  </div>;
}
