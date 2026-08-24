import { CollapsiblePanel } from "@cjlapao/ui-kit";

export default function BuildConfiguration() {
  return (
    <div className="w-full">
      <CollapsiblePanel
        title="Build configuration"
        subtitle="3 overrides"
        defaultExpanded={false}
      >
        <p>
          An uncontrolled panel, driven by <code>defaultExpanded</code> — it
          starts collapsed and opens when the header is clicked.
        </p>
      </CollapsiblePanel>
    </div>
  );
}
