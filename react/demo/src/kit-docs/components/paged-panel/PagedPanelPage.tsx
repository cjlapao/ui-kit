import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type PropDoc,
} from "../../shared/A11ySections";
import { PagedPanelPlayground } from "./PagedPanelPlayground";
import Loading from "./examples/Loading";
import loadingCode from "./examples/Loading.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PAGEDPANEL_PROPS: PropDoc[] = [
  {
    name: "pages",
    type: "ReactNode[]",
    description: (
      <>
        One entry per page, shown one at a time (:33-34,:306). It decides the
        rest of the component: an empty array is what draws the empty state
        (:294) and more than one is what creates the nav (:175).
      </>
    ),
  },
  {
    name: "title",
    type: "ReactNode | ReactNode[]",
    description: (
      <>
        Static, or one per page — <C>title[current]</C> is read per page (:343).
        An array with an empty <C>pages</C> resolves to nothing, so the header
        keeps only the subtitle (:176).
      </>
    ),
  },
  {
    name: "subtitle",
    type: "ReactNode",
    description: (
      <>
        Static line under the title (:40-41,:217-227). A header appears for a
        title, a subtitle, or a nav to sit in (:176).
      </>
    ),
  },
  {
    name: "page / onPageChange",
    type: "number / (page) => void",
    description: (
      <>
        Omit <C>page</C> and <C>usePager</C> owns the index (:44-53); pass it and
        the caller does (:62-67). <C>onPageChange</C> fires in both modes, and
        with the <em>clamped</em> index (:55-61) — a controlled <C>{"page={9}"}</C>{" "}
        over three pages shows the third page, it does not read <C>undefined</C>{" "}
        (:28-32). There is no <C>loop</C> prop: the ends stop (:10-11,:57-58).
      </>
    ),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: (
      <>
        Replaces the page while the header, nav and counter stay put (:176,:263).
        It is checked first, so <C>loading</C> plus <C>error</C> shows the loader
        (:264-284).
      </>
    ),
  },
  {
    name: "loaderType",
    type: '"skeleton" | "spinner" | "progress"',
    default: "skeleton",
    description: (
      <>
        :22-23,:44-45. The skeleton is shaped like a page and <C>aria-hidden</C>{" "}
        (:270-273) so the block keeps its real height and nothing jumps when the
        data lands (:18-21).
      </>
    ),
  },
  {
    name: "progress / loadingLabel / loadingState",
    type: "number / ReactNode / ReactNode",
    description: (
      <>
        0–100, read only by <C>loaderType="progress"</C> (:276-282); copy beside
        the spinner or bar — the skeleton draws none (:266-274); or a block that
        replaces all three treatments in one blow (:50-51,:264-265).
      </>
    ),
  },
  {
    name: "error",
    type: "string | null",
    description: (
      <>
        An <C>EmptyState</C> whose title is translated (:284-293) and whose
        subtitle is this string. An empty string counts as no error (:284).
      </>
    ),
  },
  {
    name: "emptyState / emptyMessage",
    type: "ReactNode / string",
    description: (
      <>
        Replace the whole block, or only its copy. The kit&rsquo;s default title
        is <C>t("kit.pagedpanel.empty")</C> — &ldquo;No data
        available.&rdquo; in English and a different sentence in each of the
        other four built-in locales (:56-57,:352).
      </>
    ),
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: '"none" → neutral',
    description: (
      <>
        One knob for the nav buttons <em>and</em> the wrapping Panel (:334,:378).
        The JSDoc says <C>@default "blue"</C> (:58-59); the destructure says{" "}
        <C>"none"</C> (:322) and <C>getSurfaceAccentColor</C> paints that{" "}
        <C>neutral</C> (Theme.ts:69), which is what a panel without a tone
        actually looks like.
      </>
    ),
  },
  {
    name: "size",
    type: "ControlSize",
    default: "md",
    description: (
      <>
        Header type, counter, padding and the nav-button scale move together
        (:78-123,:171); the empty and error states follow{" "}
        <C>PANE_EMPTY_STATE_SIZE</C>, so only <C>lg</C> and <C>xl</C> get a bigger
        one (Theme.ts:1690-1696,:174).
      </>
    ),
  },
  {
    name: "bare",
    type: "boolean",
    default: "false",
    description: (
      <>
        No Panel at all — a plain <C>relative overflow-hidden</C> div carrying
        your <C>className</C> (:367-372), for sitting inside a Panel the app
        already owns (:67-72).
      </>
    ),
  },
  {
    name: "…panel props",
    type: "PanelProps",
    description: (
      <>
        Everything else reaches the wrapping Panel (:376-382), except{" "}
        <C>title</C>, <C>loading</C>, <C>loaderType</C>, <C>progress</C> and{" "}
        <C>loadingState</C> — owned here, which is why they are omitted from the
        type (:29-32) — plus <C>padding</C>, forced to <C>"none"</C>, and{" "}
        <C>bodyClassName</C>, set for the empty state (:379-380). Passing them is
        silently pointless.
      </>
    ),
  },
];

export const PagedPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
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
          Paging is never a silent content swap: the counter beside the title is
          a <C>role="status"</C> polite live region, so moving pages announces
          the new position (:229-241) — the comment there says exactly that, and
          it is why the element is not a <C>div</C> with a class. The two nav
          buttons are named by <C>srLabel</C> (:196,:253), which becomes both the
          accessible name and the tooltip (IconButton :239,:282-290).
        </p>
        <p>
          At an end, the dead direction is given the native <C>disabled</C>{" "}
          attribute (:198,:255), and IconButton passes it straight through
          (IconButton :259) — so it leaves the tab order entirely instead of
          sitting there as a focusable button a reader can reach and cannot
          press. The skeleton is <C>aria-hidden</C> placeholder shape, not content
          (:270-273); spinner and progress announce through the loader itself
          (:276-282). Empty and error are real <C>EmptyState</C> blocks with a
          glyph, a translated title and the pane&rsquo;s own scale (:284-305).
        </p>
        <A11yCode code={SEMANTICS_CODE} filename="Semantics.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The whole keyboard surface is two <C>IconButton</C>s: plain{" "}
          <C>Tab</C> to reach one and <C>Enter</C> or <C>Space</C> to press it,
          with the kit&rsquo;s focus ring (<C>focus-visible:outline-none</C> plus{" "}
          <C>focus-visible:ring-2 ring-offset-2</C>, IconButton :45,:136). There
          is no key handler anywhere in the 388 lines of this component — which is
          worth saying as plainly as the bindings above.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action:
                "Reaches the previous-page button, then the next-page one. At the first page the left button carries the native disabled attribute and is skipped, not announced as a dead stop (:198, IconButton :259).",
            },
            {
              keys: ["Shift", "Tab"],
              action:
                "Leaves the header. The counter, the title and the page content have no tab stop of their own (:204-243), so whatever focusable markup the caller put in pages is what comes next.",
            },
            {
              keys: ["Enter", "Space"],
              action:
                "Presses the focused nav button. Both are type=\"button\" (IconButton :238,:252), so paging never submits an enclosing form.",
            },
            {
              keys: ["←", "→"],
              action:
                "Nothing. This is a pair of buttons, not a tablist or a carousel — there is no arrow-key pattern to learn, and none to discover half-implemented.",
            },
            {
              keys: ["Home", "End"],
              action:
                "Nothing either. usePager exposes goTo (:63,:70) but the panel wires no key to it, so jumping to the first or last page is a caller's own button away.",
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Four strings, and none of them are written here: the nav labels, the
          error title and the empty copy come from <C>useKitT</C> (:170,:335) at{" "}
          <C>kit.pagedpanel.previousPage</C>, <C>nextPage</C>, <C>error</C> and{" "}
          <C>empty</C> (:196-197,:253-254,:289,:352), and all four exist in every
          built-in catalog — English&rsquo;s block is en.ts:364-369 and Spanish
          es.ts:331-336, with French, German and Portuguese beside them. The
          counter is locale-neutral digits (&#123;current + 1&#125; /
          &#123;total&#125;) in <C>tabular-nums</C> (:235,:240), so it needs no
          plural rules.
        </p>
        <p>
          What is physical, and stays physical: the header is a flex row that{" "}
          <em>does</em> mirror under <C>dir="rtl"</C> (:181-187), so the
          previous-page button moves to the physical right — but its glyph is the
          fixed <C>ArrowChevronLeft</C> (:192) and IconButton has no right-to-left
          flip, so the arrow still points left while the button sits on the right.
          The <C>border-b</C> divider and the <C>p-4</C> body are physical too
          (:183,:263). Page content is the caller&rsquo;s, untranslated by
          design; only the kit&rsquo;s own four strings are localised.
        </p>
        <A11yCode code={RTL_CODE} filename="rtl.tsx" />
      </A11yTopic>

      <A11yTopic title="Who owns the index">
        <p>
          The index lives in <C>usePager</C> unless you pass <C>page</C>
          (:44-53,:62-67). The clamp is applied on <em>read</em>, and the resync
          is an effect — doing it during render would be a render-phase state
          update, which is exactly what the hook&rsquo;s comment refuses to do
          (:34-36,:49-53). That is what keeps a list that shrinks under a reload
          from crashing on <C>undefined</C> (:28-32). <C>onPageChange</C> reports
          the clamped value in both modes (:55-61), and with no pages at all it
          never fires (:56).
        </p>
        <A11yCode code={CONTROLLED_CODE} filename="Controlled.tsx" />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={PAGEDPANEL_PROPS} />
  </div>
);

const SEMANTICS_CODE = `// The counter is the announcement. This is the markup the kit
// emits for the header centre (:229-241), not a class on a div.
<div role="status" aria-live="polite" className="mt-0.5 tabular-nums">
  {current + 1} / {total}
</div>`;

const RTL_CODE = `// Arabic, French, German — the four strings travel, the layout does not
// need to know. Only the caller's page content decides direction.
<I18nProvider locale="ar">
  <PagedPanel pages={regions} title={titles} />
</I18nProvider>
// The header row mirrors (dir flips the flex order, :181-187), so the
// previous-page button lands on the physical right. Its chevron is a fixed
// glyph (:192) — the kit does not rotate it, so point that at your own icon
// if the direction matters to your readers.`;

const CONTROLLED_CODE = `// The caller owns the index; the clamp still happens in the hook (:49).
const [region, setRegion] = useState(0);
<PagedPanel
  pages={PAGES}
  page={region}
  // Fires with the clamped index, controlled or not (:55-61) — so a
  // page past the end lands on the last one instead of crashing.
  onPageChange={setRegion}
/>`;

export default PagedPanelPage;
