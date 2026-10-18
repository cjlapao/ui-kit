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
import { TagPanelPlayground } from "./TagPanelPlayground";
import Overflow from "./examples/Overflow";
import overflowCode from "./examples/Overflow.tsx?raw";

export const TagPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tag Panel"
      description="A titled group of pills with a collapse limit. The header's scale and the pills' scale are separate props — they used to share one, so a SectionSize reached a Pill that expects a PillSize."
    />
    <TagPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Overflow and empty"
        description="The +N chip unfolds the ColorSwatches way — cascaded in, rippled out — and it is one focusable control for both directions; it used to be a bare button wrapping a Pill, a nested interactive with no focus ring. The empty case is an EmptyState at the pane scale, not italic grey text."
        code={overflowCode}
        filename="Overflow.tsx"
      >
        <Overflow />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The overflow pills are always mounted — the cascade needs them in the
          flow — but collapsed ones are <C>aria-hidden</C>, so the announced
          content matches the visible one. The chip is one button carrying{" "}
          <C>aria-expanded</C> and <C>aria-controls</C>, its name switching
          between &ldquo;Show N more tags&rdquo; and &ldquo;Collapse
          tags&rdquo;; the pills sit in a labelled group. The empty copy, the
          chip names and the group label come from the kit catalog.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          One Tab stop for the whole fold: the chip is a plain button with the
          kit&rsquo;s focus ring, toggled with Enter or Space. (It used to be a
          bare button <em>wrapping</em> a Pill — a nested interactive whose
          focus was invisible.) Expanding moves focus nowhere; the new pills
          simply appear in reading order after it.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Every string the component owns — the chip&rsquo;s accessible names,
          the group label, the default &ldquo;No tags&rdquo; — resolves through
          the catalog in all five locales, with ICU plurals on the count. Tag
          labels are the caller&rsquo;s. The row is flex flow, so long labels
          wrap and everything mirrors under <C>dir="rtl"</C>, the cascade
          included.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "title / subtitle",
          type: "ReactNode",
          description: (
            <>
              Section header, rendered by <C>Section</C>; omit the title to hide
              the header entirely.
            </>
          ),
        },
        {
          name: "tags",
          type: "TagPanelTag[]",
          description:
            "Each carries its own tone (neutral), variant (soft), size (falls back to tagSize) and optional icon.",
        },
        {
          name: "tagLimit",
          type: "number",
          default: "5",
          description:
            "Pills shown before the +N chip folds the rest; 0 shows everything.",
        },
        {
          name: "overflowTone",
          type: "TrueColor",
          default: "neutral",
          description: "Tone of the fold chip.",
        },
        {
          name: "size",
          type: "SectionSize",
          default: "md",
          description: (
            <>
              The <em>header&rsquo;s</em> scale — also picks the empty state via{" "}
              <C>PANE_EMPTY_STATE_SIZE</C>.
            </>
          ),
        },
        {
          name: "tagSize",
          type: "PillSize",
          default: "sm",
          description:
            "The pills' own scale; separate from size, which once leaked into it.",
        },
        {
          name: "variant",
          type: "SectionVariant",
          default: "uppercase",
          description: "Header style.",
        },
        {
          name: "emptyState / emptyMessage",
          type: "ReactNode / string",
          description:
            'Override the empty block or just its copy (default "No tags", translated).',
        },
        {
          name: "actions",
          type: "ReactNode",
          description: "Right side of the section header.",
        },
        {
          name: "className / bodyClassName / noPadding",
          type: "string / string / boolean",
          description: "Root classes, tag-row classes, header padding off.",
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// Collapsed pills are mounted for the animation but hidden
// from the tree; the chip says what it will do.
<TagPanel title="Labels" tags={tags} tagLimit={5} />;`;

export default TagPanelPage;
