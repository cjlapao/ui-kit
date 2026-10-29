import { useState } from "react";
import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";

export default function OverflowCollapse() {
  const [expanded, setExpanded] = useState(true);

  return <div className="w-full space-y-4">
    <Button size="sm" variant="outline" onClick={() => setExpanded(value => !value)}>
      {expanded ? "Collapse overflowing content" : "Expand overflowing content"}
    </Button>
    <CollapsiblePanel title="Scrollable task lists" subtitle="40 items across two nested scroll areas"
      expanded={expanded} onToggle={setExpanded} contentMaxHeight={180} minExpandedHeight={100}>
      <div className="space-y-4">
        {["Build tasks", "Review tasks"].map(section => <section key={section} className="space-y-2">
          <h3 className="font-semibold">{section}</h3>
          <div tabIndex={0} role="region" aria-label={section}
            className="max-h-40 overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700">
            {Array.from({ length: 20 }, (_, index) => <div key={index}
              className="border-b border-neutral-100 px-3 py-2 last:border-b-0 dark:border-neutral-800">
              {section} · item {index + 1}
            </div>)}
          </div>
        </section>)}
      </div>
    </CollapsiblePanel>
    <p className="text-xs text-neutral-500 dark:text-neutral-400">
      This marker should move upward immediately when collapsing. The panel should never grow to reveal all items first.
    </p>
  </div>;
}
