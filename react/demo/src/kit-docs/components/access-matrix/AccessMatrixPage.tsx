import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { AccessMatrixPlayground } from "./AccessMatrixPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import CollapseAndLimit from "./examples/CollapseAndLimit";
import collapseAndLimitCode from "./examples/CollapseAndLimit.tsx?raw";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const AccessMatrixPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Access Matrix"
      description="A read-only RBAC grid on the shared table surface — one flat permission list becomes collapsible group rows, a sticky resource column and one column per action, with a show-more group limit and full loading/empty treatment."
    />
    <AccessMatrixPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="The whole API is one prop: a flat list of (group, resource, action, enabled) rows. Group headers show a resource count, collapse on click, and the Resource column stays pinned while the actions scroll."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Collapse and limit"
        description="Seven groups with limit={3}: the last four sit behind a “Show 4 more groups” button, and every group header row toggles its resources. Group headers stay a shade darker than the striped data rows so they keep reading as headers."
        code={collapseAndLimitCode}
        filename="CollapseAndLimit.tsx"
      >
        <CollapseAndLimit />
      </ExampleCard>
      <ExampleCard
        title="Surfaces"
        description="The variant is the panel surface family — outlined, tonal, glass and liquid-glass — each tinted by the tone, which also colours the enabled check marks."
        code={surfacesCode}
        filename="Surfaces.tsx"
        previewClassName="items-stretch"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="A matrix-shaped loading skeleton, the empty state, full-height mode (pinned header, internally scrolling body) and a transparent sticky column so a tinted surface shows through instead of the default opaque white."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default AccessMatrixPage;
