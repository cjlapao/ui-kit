import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { BreadcrumbPlayground } from "./BreadcrumbPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Route from "./examples/Route";
import routeCode from "./examples/Route.tsx?raw";
import CustomSeparator from "./examples/CustomSeparator";
import customSeparatorCode from "./examples/CustomSeparator.tsx?raw";
import Ellipsis from "./examples/Ellipsis";
import ellipsisCode from "./examples/Ellipsis.tsx?raw";
import CustomItem from "./examples/CustomItem";
import customItemCode from "./examples/CustomItem.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";

export const BreadcrumbPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Breadcrumb"
      description="The page hierarchy as a trail of crumbs — items carry a router path, an href or a click handler, the current page gets aria-current, and the tone matches the rest of the UI."
    />
    <BreadcrumbPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description={'A home crumb and the trail to the current page, which renders as text with `aria-current="page"`.'}
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Route"
        description="Real navigation — `to` renders the router's `Link`, so clicking a crumb goes back up the hierarchy."
        code={routeCode}
        filename="Route.tsx"
      >
        <Route />
      </ExampleCard>
      <ExampleCard
        title="Custom Separator"
        description={`Any node between items — here a plain \"/" instead of the default chevron.`}
        code={customSeparatorCode}
        filename="CustomSeparator.tsx"
      >
        <CustomSeparator />
      </ExampleCard>
      <ExampleCard
        title="Ellipsis"
        description="An icon-only crumb stands in for the hidden levels above."
        code={ellipsisCode}
        filename="Ellipsis.tsx"
      >
        <Ellipsis />
      </ExampleCard>
      <ExampleCard
        title="Custom Item"
        description="Items can carry icons and extra content — a `Badge` after the label here."
        code={customItemCode}
        filename="CustomItem.tsx"
      >
        <CustomItem />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description={`The \`color\` prop takes any of the 21 TrueColors — it tints the link hover, the focus ring and the current crumb.`}
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
    </section>
  </div>
);

export default BreadcrumbPage;
