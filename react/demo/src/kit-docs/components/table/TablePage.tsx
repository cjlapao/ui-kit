import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TablePlayground } from "./TablePlayground";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import Densities from "./examples/Densities";
import densitiesCode from "./examples/Densities.tsx?raw";
import Persistence from "./examples/Persistence";
import persistenceCode from "./examples/Persistence.tsx?raw";

export const TablePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Table"
      description="A data grid on the shared panel surface — sorting, grouping, pagination, column management, and opt-in settings persistence, with a three-step density scale and an optional bordered grid."
    />
    <TablePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Surfaces"
        description="The table's variant is the panel surface family — outlined, tonal, glass and liquid-glass, each tinted by the tone."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="Densities"
        description="default, compact and minimal — the same table at three row scales; bordered adds the full grid, minimal drops it."
        code={densitiesCode}
        filename="Densities.tsx"
      >
        <Densities />
      </ExampleCard>
      <ExampleCard
        title="Persistence"
        description="With a storageKey, column visibility, column widths, group-by and pinned columns are stored in localStorage and restored on the next mount."
        code={persistenceCode}
        filename="Persistence.tsx"
      >
        <Persistence />
      </ExampleCard>
    </section>
  </div>
);

export default TablePage;
