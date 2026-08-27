import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ConnectionFlowPlayground } from "./ConnectionFlowPlayground";
import EdgeStyles from "./examples/EdgeStyles";
import edgeStylesCode from "./examples/EdgeStyles.tsx?raw";
import Items from "./examples/Items";
import itemsCode from "./examples/Items.tsx?raw";
import Status from "./examples/Status";
import statusCode from "./examples/Status.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Connectors from "./examples/Connectors";
import connectorsCode from "./examples/Connectors.tsx?raw";
import Structure from "./examples/Structure";
import structureCode from "./examples/Structure.tsx?raw";
import PathHighlight from "./examples/PathHighlight";
import pathHighlightCode from "./examples/PathHighlight.tsx?raw";
import ProgressExample from "./examples/Progress";
import progressCode from "./examples/Progress.tsx?raw";
import Skipped from "./examples/Skipped";
import skippedCode from "./examples/Skipped.tsx?raw";

export const ConnectionFlowPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Connection Flow"
      description="A pipeline graph: steps along a track, parallel lanes that fan out and back in, children hanging below their parent, and arcs over the steps that were skipped. Every edge comes from one port-and-route engine — a fan shares a single spine, and the edge style changes only how the corners are drawn. Zoom, pan, fit, and hover any node to light the path that reached it."
    />
    <ConnectionFlowPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Edge styles"
        description="All three styles route the same way — out along each port's normal, then an axis-aligned turn, with a whole fan sharing one spine. They differ only at the corners: `straight` mitres them, `orthogonal` rounds them by a fixed radius, `curved` rounds them as far as the segments allow. Routing and corner treatment are separate concerns, so a bypass arcs over the skipped step in every style."
        code={edgeStylesCode}
        filename="EdgeStyles.tsx"
      >
        <EdgeStyles />
      </ExampleCard>
      <ExampleCard
        title="Items"
        description="A card's body can be a list of `items` — a fixed shape rather than free content, because the layout is pure and a card's height has to be arithmetic. Progress has two homes: a `bar` under the row's text, or a `spinner` in place of its glyph, given back at 100%. Past `maxVisibleItems` the rest fold behind “show more”; expanding re-measures the card and re-routes its edges. `maxHeight` caps a card instead and scrolls its body."
        code={itemsCode}
        filename="Items.tsx"
      >
        <Items />
      </ExampleCard>
      <ExampleCard
        title="Status"
        description="`status` says what happened to a step — succeeded, running, failed, pending, skipped — and the tone and the glyph follow from it. An explicit `tone` still wins, so a status is a default rather than a constraint; `running` implies `active` and `skipped` implies bypassing, so the semantics are stated once instead of three times."
        code={statusCode}
        filename="Status.tsx"
      >
        <Status />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="`variant` is one decision, not two: the panel and the cards inside it take the same surface, painted from the same shade table `Panel` uses. A card sitting in a panel is part of that panel, not a second surface language layered on top of it. The card is drawn as an SVG path (a terminal is the card bulging), so the glass variants keep their translucent fill and light rim but cannot carry a backdrop blur."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Connectors"
        description="Where an edge meets a node, the card bulges. The silhouette is one path — a rounded rectangle detouring around each of its ports — so the bulge carries the same fill as the rest of the card and no border crosses it; a solid dot at its centre is what the edge attaches to. `ringSize` sizes the bulge on the shared control scale; `fit` leaves the outline straight."
        code={connectorsCode}
        filename="Connectors.tsx"
      >
        <Connectors />
      </ExampleCard>
      <ExampleCard
        title="Structure"
        description="`kind` borrows TreeView's connection types — step, parallel and child — so a flow can express shape as well as sequence."
        code={structureCode}
        filename="Structure.tsx"
      >
        <Structure />
      </ExampleCard>
      <ExampleCard
        title="Path highlight"
        description="Hover or focus a node and everything that had to happen for it to be reached stays lit; the rest dims."
        code={pathHighlightCode}
        filename="PathHighlight.tsx"
      >
        <PathHighlight />
      </ExampleCard>
      <ExampleCard
        title="Progress"
        description="A bar across the foot of each card, or a spinner at its end. They are alternatives — only one is ever shown."
        code={progressCode}
        filename="Progress.tsx"
      >
        <ProgressExample />
      </ExampleCard>
      <ExampleCard
        title="Skipped steps"
        description="A bypassed step is arched over rather than connected through. `autoState` infers it from tone."
        code={skippedCode}
        filename="Skipped.tsx"
      >
        <Skipped />
      </ExampleCard>
    </section>
  </div>
);

export default ConnectionFlowPage;
