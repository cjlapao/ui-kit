import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { BreakdownCardPlayground } from "./BreakdownCardPlayground";
import BudgetSplit from "./examples/BudgetSplit";
import budgetSplitCode from "./examples/BudgetSplit.tsx?raw";
import LeadsBySource from "./examples/LeadsBySource";
import leadsBySourceCode from "./examples/LeadsBySource.tsx?raw";

export const BreakdownCardPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Breakdown Card"
      description="A whole split into parts: a donut for how much, labelled rows for of what, and a summary strip for so what — one card for the question where did it all go. Shares are computed from the values, so the numbers can never disagree with the picture."
    />
    <BreakdownCardPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Budget Split" description="Quarterly cloud spend — donut for the shape, rows for the detail, strip for the totals." code={budgetSplitCode} filename="BudgetSplit.tsx"><BudgetSplit /></ExampleCard>
      <ExampleCard title="Leads By Source" description="Where displayValue earns its keep: values feed the donut, formatted strings feed the rows." code={leadsBySourceCode} filename="LeadsBySource.tsx"><LeadsBySource /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>title</code>, <code>caption</code>, <code>items</code>{" "}
          (<code>{`{ id, label, value, displayValue?, tone? }`}</code>),{" "}
          <code>stats</code> (<code>{`{ label, value }[]`}</code>),{" "}
          <code>ctaLabel</code> with <code>onCta</code> (React; the{" "}
          <code>cta</code> event in Vue) plus <code>ctaVariant</code> (follows
          the card's own variant unless pinned) and <code>loading</code> (the
          card's own shape in placeholder ink while the numbers are in flight),
          and the usual card surface —{" "}
          <code>variant</code>, <code>tone</code>, <code>padding</code>,{" "}
          <code>corner</code>; everything else lands on the card. Each item's{" "}
          <code>tone</code> paints its slice and its legend dot — the kit's
          TrueColors, no raw hex anywhere. The donut renders through the
          kit's own <code>Chart.Pie</code> (a native SVG donut in the Vue
          kit), so slice hover — the pop-out the engine's <code>Chart.Hover</code>{" "}
drives — theming and animation are the chart's; the Vue kit's native donut
mirrors the same 150ms radial pop. A
          total of <code>0</code> is a first-class state: an empty ring and
          dashes instead of shares.
        </p>
      </div>
    </section>
  </div>
);

export default BreakdownCardPage;
