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
import { AccordionPlayground } from "./AccordionPlayground";
import CloudRegions from "./examples/CloudRegions";
import cloudRegionsCode from "./examples/CloudRegions.tsx?raw";
import Faq from "./examples/Faq";
import faqCode from "./examples/Faq.tsx?raw";
import GlassSettings from "./examples/GlassSettings";
import glassSettingsCode from "./examples/GlassSettings.tsx?raw";

export const AccordionPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Accordion"
      description="A stacked disclosure list on the shared container surface: it renders Panel, so variant, tone, corner, padding and every glass prop come from the same scales as every other card, and it stands on the container standard — elevated, no tone, sm padding, medium corner. Rows carry their own icon, badge, action, disabled and loading state; the open set is one array, uncontrolled or controlled; collapsed content is inert, not hidden, and the arrow keys walk the headers without toggling them."
    />
    <AccordionPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Cloud regions"
        description="Dense rows on the shared control scale, controlled through the same useAccordion hook the component uses internally — openIds and onChange are the parent&rsquo;s copy of the array. Only the first row carries a Refresh action, and while its timeout runs that row alone gets its own loader overlay."
        code={cloudRegionsCode}
        filename="CloudRegions.tsx"
      >
        <CloudRegions />
      </ExampleCard>
      <ExampleCard
        title="Faq"
        description="Outlined surface, plain rows, no icons: title and content only, with the row inset left at its default. One question is open at start and the other three are collapsed, inert and aria-hidden — not announced, and nothing inside them can take focus."
        code={faqCode}
        filename="Faq.tsx"
      >
        <Faq />
      </ExampleCard>
      <ExampleCard
        title="Glass settings"
        description="A see-through accordion over a busy gradient: the card tints with the tone, and the row copy, hairline and icon chip take their colours from the surface context Panel publishes rather than from a per-tone class table."
        code={glassSettingsCode}
        filename="GlassSettings.tsx"
      >
        <GlassSettings />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The list is a <C>role="group"</C> named by <C>ariaLabel</C> (:290) —
          leave it out and the group is announced as an unlabelled group, which is
          the difference between <em>one of four things</em> and <em>Cloud
          regions, 3 items</em>. Each header is a <C>div</C> with{" "}
          <C>role="button"</C> (:332-341), not a native <C>&lt;button&gt;</C>,
          because a row <C>action</C> may itself be a button and nesting one inside
          the other is invalid markup; the actions render as siblings inside the
          header and stop both activation paths (:417-424). The header carries{" "}
          <C>aria-expanded</C> (:343), <C>aria-controls</C> (:344) and{" "}
          <C>aria-disabled</C> (:345); a disabled row also drops out of the tab
          order (<C>tabIndex=&#123;-1&#125;</C>, :342) and has its{" "}
          <C>onClick</C> and <C>onKeyDown</C> removed outright (:346-351), so it is
          unreachable rather than merely dimmed.
        </p>
        <p>
          Each content box is a <C>role="region"</C> labelled by its own header
          (:437-439), so a screen reader can jump row to row by landmark. Collapsed
          rows are <C>aria-hidden</C> (:440) and <C>inert</C> (:446-448) —{" "}
          <C>hidden</C> would be <C>display: none</C> and would kill the height
          transition (:441-445), so the region stays rendered and simply stops
          being focusable or announced. The trigger/content ids come from{" "}
          <C>useId</C> (:521), which is why two accordions sharing item ids still
          point <C>aria-controls</C> at their own content (:518-520).
        </p>
        <p>
          Two states the component names for you: an empty <C>items</C> list
          replaces the body with an <C>EmptyState</C> (:213-226), and a row whose{" "}
          <C>loading</C> is true gets a <C>Loader</C> overlay on top of that row
          alone (:465-473). Both pull their title from the kit catalog (:220,:468)
          — see Internationalization.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The header is the WAI-ARIA APG accordion pattern: arrows move focus
          between headers and never toggle, activation is explicit, and the walk
          skips rows that cannot answer. One deviation worth knowing —{" "}
          <C>tabIndex=&#123;0&#125;</C> is set on every enabled header (:342), so
          each row is its own tab stop; APG&rsquo;s single-tab-stop roving
          <C>tabindex</C> is not implemented, which means a 20-row list is 20 stops
          with <C>Tab</C>.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Move to the next header. Every enabled row is its own tab stop;
                  disabled rows are removed from the order (:342).
                </>
              ),
            },
            {
              keys: ["enter"],
              action: (
                <>
                  Toggle the focused row — only when the header itself is focused
                  (:235-242).
                </>
              ),
            },
            {
              keys: ["space"],
              action: (
                <>
                  Toggle the focused row, with <C>preventDefault</C> so the page
                  does not scroll (:239-242).
                </>
              ),
            },
            {
              keys: ["down"],
              action: (
                <>
                  Focus the next enabled header, wrapping from the last to the
                  first (:272-275).
                </>
              ),
            },
            {
              keys: ["right"],
              action: <>Same as <C>Down</C> (:272-275).</>,
            },
            {
              keys: ["up"],
              action: (
                <>
                  Focus the previous enabled header, wrapping from the first to the
                  last (:276-279).
                </>
              ),
            },
            {
              keys: ["left"],
              action: <>Same as <C>Up</C> (:276-279).</>,
            },
            {
              keys: ["home"],
              action: <>Focus the first enabled header (:280-284).</>,
            },
            {
              keys: ["end"],
              action: <>Focus the last enabled header (:280-284).</>,
            },
          ]}
        />
        <p>
          None of the arrow keys toggles: they are filtered out of the activation
          branch and <C>preventDefault</C>ed before the walk (:245-258), and the
          walk runs over the rows that are not disabled, so a disabled row is
          stepped over rather than landed on (:260-268). Focus moves through the{" "}
          <C>headerRefs</C> map the headers register themselves into (:211,
          :334-340). Row actions swallow <C>onClick</C> <em>and</em>{" "}
          <C>onKeyDown</C> (:419-420) — pressing Enter on a Refresh button
          activates the button and leaves the row alone, which is exactly what the{" "}
          <C>event.target === event.currentTarget</C> guard (:235-237) protects.
        </p>
        <A11yCode filename="Keyboard.tsx" code={KEYBOARD_CODE} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Accordion speaks two strings of its own, and both come from the kit
          catalog: <C>kit.accordion.noItemsTitle</C> (&quot;No items&quot;) for the
          empty list (:220) and <C>kit.accordion.loadingTitle</C>
          (&quot;Loading&quot;) for a loading row (:468) — declared in{" "}
          <C>common/i18n/builtIn/en.ts:215-218</C> and shipped in five catalogs
          (English, Spanish, French, German, Portuguese; the Spanish pair is
          &quot;Sin elementos&quot; and &quot;Cargando&quot;,{" "}
          <C>es.ts:181-184</C>). Everything a reader can read is otherwise
          caller-supplied <C>ReactNode</C> — <C>title</C>, <C>subtitle</C>,{" "}
          <C>description</C>, <C>badge</C>, <C>actions</C>, <C>content</C>{" "}
          (:29-40) — so its translation is the application&rsquo;s business, and
          the row order is data order, not a locale-dependent sort.
        </p>
        <p>
          With no provider in the tree the built-ins still resolve (:32 of{" "}
          <C>I18nContext.tsx</C>); with one, your catalog wins and the kit fills
          the gaps, <C>fallbackLocale</C> defaults to <C>"en"</C> and detection
          reads <C>navigator.languages</C> (:46-53). Override the two keys rather
          than forking the component, and note that <C>updateDocument</C> keeps{" "}
          <C>&lt;html lang dir&gt;</C> in step (:56-57) — which matters here
          because the header is <C>text-left</C> (:353), a physical alignment that
          does not follow <C>dir</C>, while <C>gap</C>, the hairline and the icon
          chip are direction-neutral. The arrow keys mean previous/next, not
          west/east (:272-279), so an RTL reader walks the list in reading order
          with the same keys a LTR reader uses.
        </p>
        <A11yCode filename="Translate.tsx" code={I18N_CODE} />
      </A11yTopic>

      <A11yTopic title="Motion and reduced motion">
        <p>
          The height is animated with <C>grid-template-rows</C>: the wrapper is a
          <C>grid</C> whose rows go <C>0fr → 1fr</C> (:433) and the transition is
          on <C>grid-template-rows</C> and <C>opacity</C> for 200ms (:428-432).
          That transition class is added by <C>animated</C> —{" "}
          <C>false</C> does not pause it, it never appears (:71-75, :430-431), so
          the rows switch instantly — and it carries{" "}
          <C>motion-reduce:transition-none</C>, so a reader who asked for less
          motion gets the instant switch without the prop.
        </p>
        <p>
          Two things animate outside that gate, and knowing them is the honest
          version of this page. The indicator rotates <C>rotate-180</C> (chevron) or{" "}
          <C>rotate-45</C> (plus/minus) with its own{" "}
          <C>transition-transform duration-200</C> (:301-309); it honours{" "}
          <C>motion-reduce</C> but not <C>animated=&#123;false&#125;</C>, so with
          animation off the body snaps and the chevron still turns. And the header
          wash is <C>transition-colors</C> (:353) with the tone&rsquo;s hover alpha
          and inset focus ring from <C>getSurfaceTriggerTokens</C> (
          <C>Theme.ts:1195-1196,1201-1204</C>) — a colour fade, not movement, and
          it is not gated either. Nothing here animates on scroll, and no part of
          the row moves horizontally, so an RTL layout inherits the same motion.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={ACCORDION_PROPS} />
  </div>
);

/**
 * The API as the component actually declares it (:55-83 plus the
 * `UseAccordionOptions` it spreads in, useAccordion.ts:3-8). Every row the
 * playground can print is here; the rows for things it deliberately does not do
 * say so rather than implying a knob that is not there.
 */
export const ACCORDION_PROPS: PropDoc[] = [
  {
    name: "items",
    type: "AccordionItem[]",
    description: (
      <>
        The rows. Per item: <C>id</C> and <C>title</C> and <C>content</C> are the
        three that are not optional; <C>subtitle</C>, <C>description</C>,{" "}
        <C>icon</C> (an <C>IconName</C> or your own element), <C>badge</C> (rendered
        inside a <C>Pill</C>, :384-393), <C>actions</C>, <C>disabled</C> and{" "}
        <C>loading</C> are (:29-40).
      </>
    ),
  },
  {
    name: "size",
    type: "ControlSize",
    default: "md",
    description: (
      <>
        Type, icon-chip and indicator density only (:96-159, :483) — the inset is{" "}
        <C>padding</C>&rsquo;s job, so the header matches the card scale.
      </>
    ),
  },
  {
    name: "indicator",
    type: '"chevron" | "plus-minus" | "none"',
    default: "chevron",
    description: (
      <>
        The expand affordance, <C>aria-hidden</C> (:311) because{" "}
        <C>aria-expanded</C> already carries the meaning. The old{" "}
        <C>caret</C> value is gone: it rendered the same <C>ArrowDown</C> glyph (
        :21-26).
      </>
    ),
  },
  {
    name: "indicatorPlacement",
    type: '"left" | "right"',
    default: "right",
    description: (
      <>
        Which side of the header the indicator sits on (:365,425). Nothing to place
        when <C>indicator="none"</C>.
      </>
    ),
  },
  {
    name: "animated",
    type: "boolean",
    default: "true",
    description: (
      <>
        <C>false</C> drops the <C>transition-[grid-template-rows,opacity]</C> class
        rather than pausing it (:430-431) — the switch is instant. The indicator
        keeps its own 200ms rotation either way (:301).
      </>
    ),
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    description: (
      <>
        Opening a row replaces the open array with <C>[id]</C> when off and appends
        to it when on (useAccordion.ts:50-54). Nothing forces one row open: toggling
        the only open row leaves the list closed.
      </>
    ),
  },
  {
    name: "defaultOpenIds",
    type: "string[]",
    default: "— [] (useAccordion.ts:26)",
    description: (
      <>
        The seed for uncontrolled mode, read once by <C>useState</C> (:25-27).
        Changing it later does not move a list that is already open; re-key the
        component if you need to.
      </>
    ),
  },
  {
    name: "openIds",
    type: "string[]",
    default: "— absent (uncontrolled)",
    description: (
      <>
        Presence decides the mode, not contents: it is read as{" "}
        <C>controlledOpenIds ?? internalOpenIds</C> (:29), so <C>&#123;[]&#125;</C>{" "}
        is a controlled accordion with nothing open. Ids that are not in{" "}
        <C>items</C> are never pruned.
      </>
    ),
  },
  {
    name: "onChange",
    type: "(openIds: string[]) => void",
    default: "— absent",
    description: (
      <>
        Fires with the <em>next array</em> after every toggle (:31-39), and the
        internal state is skipped when you are controlling the list (:33). Without
        it a controlled accordion cannot be moved by its own headers.{" "}
        <C>useAccordion</C> is the same logic, exported.
      </>
    ),
  },
  {
    name: "onItemToggle",
    type: "(id: string, isOpen: boolean) => void",
    default: "— absent",
    description: (
      <>
        Per-row convenience: called with the row and the direction after the array
        has moved, in both modes (:523-527).
      </>
    ),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "— absent (unnamed group)",
    description: (
      <>
        Names the <C>role="group"</C> (:290). Nothing falls back to a default, so
        with several accordions on a page this is how a reader tells them apart.
      </>
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: (
      <>
        Disables every row (:292): 60% opacity (:328), <C>cursor-not-allowed</C>{" "}
        (:357), out of the tab order (:342), handlers removed (:346-351) — and
        forwarded to the card as well (:539).
      </>
    ),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: (
      <>
        Forwarded to <C>Panel</C>, which swaps the whole body for its skeleton (
        <C>Panel.tsx:1217,1234-1237</C>) — rows and hairlines included. Per-row
        loaders are the item&rsquo;s own <C>loading</C> field, which overlays a{" "}
        <C>Loader</C> on that row instead (:465-473).
      </>
    ),
  },
  {
    name: "loaderType",
    type: '"skeleton" | "spinner" | "progress"',
    default: "skeleton",
    description: (
      <>
        Forwarded untouched; it only matters while <C>loading</C> is true, and only
        <C>skeleton</C> replaces the body — the other two overlay it (
        <C>Panel.tsx:1487</C>).
      </>
    ),
  },
  {
    name: "variant",
    type: "PanelVariant",
    default: "elevated",
    description: (
      <>
        The container surface, on the shared scale (:499, :532) — no accordion-only
        variant family.
      </>
    ),
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: "— none (:509)",
    description: (
      <>
        Resolved once by <C>resolvePanelTone(tone, color)</C> and used for the card
        <em>and</em> the row internals — hover wash, focus ring, icon chip and badge
        (<C>:207-208</C>).
      </>
    ),
  },
  {
    name: "color",
    type: "SurfaceTone",
    default: "— deprecated alias",
    description: (
      <>
        The older name for <C>tone</C>; both land in the same resolver (:501,509),
        which is what keeps the hover ring from disagreeing with the card.
      </>
    ),
  },
  {
    name: "corner",
    type: "PanelCorner",
    default: "rounded-md",
    description: "The card&rsquo;s radius (:503, Theme.ts:1531).",
  },
  {
    name: "padding",
    type: "PanelPadding",
    default: "sm",
    description: (
      <>
        The inset of every <em>header</em> and <em>content</em> box (:209,333,456) —
        the card is pinned <C>padding="none"</C> (:537) so the rows&rsquo; hover
        wash reaches the card edge.
      </>
    ),
  },
  {
    name: "hoverable",
    type: "boolean",
    default: "false",
    description: (
      <>
        This component&rsquo;s override of Panel&rsquo;s <C>Boolean(onClick)</C> (
        :504, <C>Panel.tsx:725</C>): a list whose rows are the controls should not
        light up as if the card were one.
      </>
    ),
  },
  {
    name: "transparency / specularMode / vibrancy / glassOpacity",
    type: "Panel glass props",
    default: "— per variant",
    description: (
      <>
        Forwarded to the card. <C>specularMode</C> is read on the three
        glass-aware variants (<C>Panel.tsx:391</C>) and <C>vibrancy</C> /{" "}
        <C>glassOpacity</C> in the liquid branch alone (<C>Panel.tsx:1011-1012</C>)
        — passing them elsewhere is inert, so the playground hides them.
      </>
    ),
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description: (
      <>
        Forces the underlying Panel&rsquo;s depth step — the tinted-card-on-a-
        matching-background fix.
      </>
    ),
  },
  {
    name: "itemClassName",
    type: "string",
    description: (
      <>
        Extra classes on each row wrapper, the element that owns the hairline (
        :321-330).
      </>
    ),
  },
  {
    name: "headerClassName",
    type: "string",
    description: "Extra classes on each header (:352-363).",
  },
  {
    name: "contentClassName",
    type: "string",
    description: "Extra classes inside the content region (:451-459).",
  },
  {
    name: "iconClassName",
    type: "string",
    description: "Extra classes on the icon chip (:368-379).",
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Merged onto the card after <C>w-full</C> (:531).
      </>
    ),
  },
  {
    name: "…Panel props",
    type: "PanelProps",
    description: (
      <>
        Everything else rides along in <C>&#123;...panelProps&#125;</C> (:542):
        border, shadow, backdrop, badge slots and the rest of the container API —
        except <C>title</C>, <C>subtitle</C>, <C>actions</C>, <C>children</C> and{" "}
        <C>onChange</C>, which the accordion takes for its own (:57-60), and{" "}
        <C>padding</C> / <C>scrollable</C>, which are pinned (:537,541).
      </>
    ),
  },
  {
    name: "ref",
    type: "— none",
    description: (
      <>
        No imperative handle: the component is a plain function (:481), so the card
        element is not reachable. Drive it through <C>openIds</C> /{" "}
        <C>onChange</C> or <C>useAccordion</C> instead.
      </>
    ),
  },
];

const NAMING_CODE = `// Name the group; the rows are already announced correctly:
// each header is role=button + aria-expanded, each content a labelled region.
<Accordion
  items={regions}
  ariaLabel="Cloud regions"
  multiple
  defaultOpenIds={["us-east"]}
/>`;

const KEYBOARD_CODE = `// Arrow keys move focus, they never toggle (:245-258), and the walk
// skips rows that cannot answer (:260-268). Disabled rows are also out
// of the tab order (:342) with their handlers removed (:346-351).
//
// Row actions are safe: the wrapper stops click AND keydown (:419-420),
// and Enter/Space only toggle when the header itself is the target
// (:235-237) — so Enter on an action button does not collapse the row.
<Accordion
  items={regionsWithActions}
  ariaLabel="Cloud regions"
  onItemToggle={(id, open) => analytics.track("region", { id, open })}
/>`;

const I18N_CODE = `// The kit's two accordion strings, in your words:
<I18nProvider
  locales={{
    fr: {
      kit: {
        accordion: {
          noItemsTitle: "Aucun élément",
          loadingTitle: "Chargement",
        },
      },
    },
  }}
  locale="fr"
>
  <Accordion items={[]} ariaLabel="Régions" />
</I18nProvider>`;

export default AccordionPage;
