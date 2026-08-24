import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CollapsibleHelpTextPlayground } from "./CollapsibleHelpTextPlayground";
import ReviewQuestion from "./examples/ReviewQuestion";
import reviewQuestionCode from "./examples/ReviewQuestion.tsx?raw";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import InsideGlassPanel from "./examples/InsideGlassPanel";
import insideGlassPanelCode from "./examples/InsideGlassPanel.tsx?raw";

export const CollapsibleHelpTextPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Collapsible Help Text"
      description="Inline helper copy that truncates to a word-boundary summary and expands for more context. Renders a Panel, so it takes every container surface — plus a `plain` variant for no card at all."
    />
    <CollapsibleHelpTextPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Review question"
        description="The canonical case: a title, an icon, and copy long enough to truncate. The summary cuts on a word boundary; the chevron toggles the full text."
        code={reviewQuestionCode}
        filename="ReviewQuestion.tsx"
      >
        <ReviewQuestion />
      </ExampleCard>
      <ExampleCard
        title="All surfaces"
        description="Every variant — the eight Panel surfaces, the `card` alias of `outlined`, and `plain`, which has no card of its own."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="Inside a glass panel"
        description="A `liquid-glass` variant blends into the panel it lives in, and `plain` inherits the surface — including its copy colours. `children` stay visible whether or not the summary is expanded."
        code={insideGlassPanelCode}
        filename="InsideGlassPanel.tsx"
      >
        <InsideGlassPanel />
      </ExampleCard>
    </section>
  </div>
);

export default CollapsibleHelpTextPage;
