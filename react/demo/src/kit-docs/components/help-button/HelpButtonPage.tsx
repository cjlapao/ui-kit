import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { HelpButtonPlayground } from "./HelpButtonPlayground";
import Markdown from "./examples/Markdown";
import markdownCode from "./examples/Markdown.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Loading from "./examples/Loading";
import loadingCode from "./examples/Loading.tsx?raw";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";

export const HelpButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Help Button"
      description="An icon trigger that opens a floating panel of Markdown or node content — the full 21-colour tone set, every container surface, the shared size scale, auto-aware placement, and a loading skeleton shaped like the copy."
    />
    <HelpButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Markdown content"
        description="Pass a string and it renders as GitHub-flavoured Markdown — headings, bold, lists, tables, inline and fenced code, links and blockquotes. Click the trigger to open the panel."
        code={markdownCode}
        filename="Markdown.tsx"
      >
        <Markdown />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="The full 21-colour tone set. The trigger glyph and the panel's accent header band both track the tone — click any trigger to open it."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Loading"
        description="The right button is loading — its panel body is a pulsing skeleton shaped like the help copy instead of flashing empty text."
        code={loadingCode}
        filename="Loading.tsx"
      >
        <Loading />
      </ExampleCard>
      <ExampleCard
        title="Surfaces"
        description="The panel runs on the shared container family — elevated, outlined, glass and liquid-glass read like a Panel beside them. Click each trigger."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
    </section>
  </div>
);

export default HelpButtonPage;
