import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PagedPanelPlayground } from "./PagedPanelPlayground";
import Loading from "./examples/Loading";
import loadingCode from "./examples/Loading.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PagedPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Paged Panel"
      description="A Panel that shows one page at a time, with a centred header and nav either side. The title can be static or one per page; the position counter is announced politely, so paging is not a silent content swap."
    />
    <PagedPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Loading"
        description="The kit's three treatments, skeleton by default. The skeleton is shaped like a page so the panel keeps its height, and the header stays put in every case — a paged panel that collapses to a bare spinner loses its nav and its position."
        code={loadingCode}
        filename="Loading.tsx"
      >
        <Loading />
      </ExampleCard>
      <ExampleCard
        title="Empty and error"
        description="Both are real EmptyStates. They used to be bare paragraphs with no glyph and no structure."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Paging is never a silent content swap: the position counter is a{" "}
          <C>role="status"</C> polite live region, so moving pages announces the
          new position. The nav buttons carry translated accessible names (and
          tooltips), disabled at the ends rather than removed. The skeleton is{" "}
          <C>aria-hidden</C> placeholder shape; spinner and progress announce
          through the loader itself. Empty and error states are real{" "}
          <C>EmptyState</C> blocks, not bare text.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          The nav is two <C>IconButton</C>s — plain Tab plus Enter/Space, with
          the kit&rsquo;s focus ring, no arrow-key pattern to learn. At the
          first or last page the dead direction is disabled (still focusable,
          announced as such) rather than vanishing.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The counter is locale-neutral digits (&ldquo;2 / 3&rdquo;) in{" "}
          <C>tabular-nums</C>; nav labels, the error title and the empty message
          come from the kit catalog across all five built-in locales. Page
          content is whatever the caller passes, and the flex header mirrors
          under <C>dir="rtl"</C> so the previous-page chevron flips to the
          physical right, matching its meaning.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "pages",
          type: "ReactNode[]",
          description:
            "One entry per page, shown one at a time. Empty array renders the empty state.",
        },
        {
          name: "title",
          type: "ReactNode | ReactNode[]",
          description:
            "Static, or one per page — an array swaps with the page.",
        },
        {
          name: "subtitle",
          type: "ReactNode",
          description: "Static line under the title.",
        },
        {
          name: "page / onPageChange",
          type: "number / (page) => void",
          description:
            "Omit page for uncontrolled paging; supply it to drive from app state. Index clamps when pages shrink under a reload.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description: (
            <>
              Replaces the page; the header and nav stay put — a paged panel
              that collapses to a bare spinner loses its position.
            </>
          ),
        },
        {
          name: "loaderType",
          type: '"skeleton" | "spinner" | "progress"',
          default: "skeleton",
          description:
            "The skeleton is shaped like a page so the panel keeps its height; progress takes a determinate value.",
        },
        {
          name: "progress / loadingLabel / loadingState",
          type: "number / ReactNode / ReactNode",
          description:
            "0–100 for progress, copy beside spinner or bar, or full custom loading content.",
        },
        {
          name: "error",
          type: "string | null",
          description: (
            <>
              Replaces the page with an <C>EmptyState</C>; the title line is
              translated.
            </>
          ),
        },
        {
          name: "emptyState / emptyMessage",
          type: "ReactNode / string",
          description:
            'Override the default empty block or just its copy (default "No data available.", translated).',
        },
        {
          name: "tone",
          type: "TrueColor",
          default: "blue",
          description: "Standard surface tone; also drives the nav buttons.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: "md",
          description: "Header type, counter and nav-button scale together.",
        },
        {
          name: "bare",
          type: "boolean",
          default: "false",
          description:
            "Render without the Panel wrapper, for embedding inside a Panel the app already owns.",
        },
        {
          name: "…panel props",
          type: "PanelProps",
          description:
            "Variant, corner, padding and the rest pass through to the wrapping Panel (unless bare).",
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// Paging announces itself: "2 / 3" arrives politely in the
// reader's queue whenever the page changes.
<PagedPanel
  pages={regions}
  title={["eu-west-1", "us-east-1", "ap-south-1"]}
  onPageChange={setPage}
/>`;

export default PagedPanelPage;
