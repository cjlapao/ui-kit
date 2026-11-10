import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
import { ContentActionsPlayground } from "./ContentActionsPlayground";
import AgentHeader from "./examples/AgentHeader";
import agentHeaderCode from "./examples/AgentHeader.tsx?raw";

export default function ContentActionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <PageHeader name="Content Actions" description="A neutral two-section layout. Content yields width as actions grow; actions stay on one row and scroll horizontally when space runs out." />
      <ContentActionsPlayground />
      <ExampleCard title="Growing actions" description="Adjust the width or drag the preview corner, then hover each action. The surrounding border belongs to this example; ContentActions adds no surface or padding." code={agentHeaderCode} filename="AgentHeader.tsx">
        <AgentHeader />
      </ExampleCard>
      <p className="text-sm opacity-70">
        React uses children and an actions prop. Vue uses the default slot and an actions slot.
        Use truncation on titles and normal wrapping on descriptions. In flex/grid parents,
        allow the parent to shrink with min-width: 0. At very narrow widths, Tab reaches
        clipped action buttons and scrolls them into view. Actions never move to another row.
      </p>
      <PropsTable props={[
        { name: "children / default slot", type: "ReactNode / slot", description: "Arbitrary content that fills the remaining width. Nested content owns truncation or wrapping." },
        { name: "actions / actions slot", type: "ReactNode / slot", description: "A single row of actions. Omitted when absent; direct children retain their intrinsic widths." },
        { name: "gap", type: "ControlSize", default: "md", description: "Spacing between regions and actions: xs, sm, md, lg or xl." },
        { name: "align", type: '"start" | "center" | "end"', default: "start", description: "Vertical alignment of content and actions." },
        { name: "contentClassName / actionsClassName", type: "string", description: "Class overrides for the content and action regions. Root className (Vue class), style and ordinary div attributes pass through." },
      ]} />
    </div>
  );
}
