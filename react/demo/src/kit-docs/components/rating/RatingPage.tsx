import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { RatingPlayground } from "./RatingPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import HalfStars from "./examples/HalfStars";
import halfStarsCode from "./examples/HalfStars.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import StarCount from "./examples/StarCount";
import starCountCode from "./examples/StarCount.tsx?raw";
import Vertical from "./examples/Vertical";
import verticalCode from "./examples/Vertical.tsx?raw";
import CustomIcons from "./examples/CustomIcons";
import customIconsCode from "./examples/CustomIcons.tsx?raw";
import Emoji from "./examples/Emoji";
import emojiCode from "./examples/Emoji.tsx?raw";
import ReadOnly from "./examples/ReadOnly";
import readOnlyCode from "./examples/ReadOnly.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";
import Sample from "./examples/Sample";
import sampleCode from "./examples/Sample.tsx?raw";

export const RatingPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Rating"
      description="Star-based selection — typed or clicked, with half stars, hover preview, tones, sizes, vertical layout and custom icons."
    />
    <RatingPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled, with the value set by `defaultValue`. Clicking a star updates the rating and the stars ahead of it light up."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Half Stars"
        description="`allowHalf` splits every star into two half values, so a rating can land on 2.5 or 3.5."
        code={halfStarsCode}
        filename="HalfStars.tsx"
      >
        <HalfStars />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="Drive the rating from your own state — the buttons snap it to exact values and `onChange` follows along."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Star Count"
        description="The number of stars to display is set with `stars`."
        code={starCountCode}
        filename="StarCount.tsx"
      >
        <StarCount />
      </ExampleCard>
      <ExampleCard
        title="Vertical"
        description={`orientation="vertical" stacks the stars for tight side-by-side layouts.`}
        code={verticalCode}
        filename="Vertical.tsx"
      >
        <Vertical />
      </ExampleCard>
      <ExampleCard
        title="Custom Icons"
        description="`onIcon` and `offIcon` swap the star for any registry icon, element or per-position function."
        code={customIconsCode}
        filename="CustomIcons.tsx"
      >
        <CustomIcons />
      </ExampleCard>
      <ExampleCard
        title="Emoji"
        description="A function icon computes each star's content from its index — lit faces in full colour, unlit ones dimmed and greyed."
        code={emojiCode}
        filename="Emoji.tsx"
      >
        <Emoji />
      </ExampleCard>
      <ExampleCard
        title="Read Only"
        description="`readOnly` shows the value as a non-interactive display — the stars leave the tab order and cannot be changed."
        code={readOnlyCode}
        filename="ReadOnly.tsx"
      >
        <ReadOnly />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="`disabled` freezes the rating — the existing value stays visible but untouchable."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
      <ExampleCard
        title="Sample"
        description="A support sign-off: the value readout and submit action unlock only once a rating is given."
        code={sampleCode}
        filename="Sample.tsx"
      >
        <Sample />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "value / defaultValue",
          type: "number | null",
          description:
            "The rating — controlled and uncontrolled as on a native field. `null` or `0` leaves every star unlit.",
        },
        {
          name: "onChange",
          type: "(value: number) => void",
          description: "Fires when a star (or half star) is picked.",
        },
        {
          name: "stars",
          type: "number",
          default: "5",
          description:
            "Star count, clamped to 1–15 so a typo cannot render a wall.",
        },
        {
          name: "allowHalf",
          type: "boolean",
          default: "false",
          description:
            "Splits every star into two radios — the value can land on 2.5 or 3.5. Hover previews the nearer half.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Name shared by the radio inputs, which is what gives the group its native keyboard behaviour. Unique per rating; generated when omitted.",
        },
        {
          name: "orientation",
          type: "Orientation",
          default: '"horizontal"',
          description:
            "The shared orientation family; vertical stacks the stars.",
        },
        {
          name: "onIcon / offIcon",
          type: "RatingIcon",
          default: '"Star" / "Star"',
          description:
            "A registry name, a ready element, or a function computed per star — the emoji ladder is just that function.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale, driving the icon square and gap.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"amber"',
          description:
            "Lit-star colour — every tone through the shared map, `amber` kept as the default by product convention (a blue star reads as &ldquo;favourited&rdquo;, not &ldquo;rated&rdquo;).",
        },
        {
          name: "invalid / disabled / readOnly",
          type: "boolean",
          default: "false",
          description:
            "`invalid` paints the lit stars with the error colour; `readOnly` keeps the value announced (`aria-readonly`) but out of the tab order.",
        },
        {
          name: "ariaLabel",
          type: "string",
          default: '"Rating" (`kit.rating.label`)',
          description: "Names the radiogroup.",
        },
        {
          name: "className / ref",
          type: "string / Ref<HTMLDivElement>",
          description: "Land on the group.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A real <C>role="radiogroup"</C> of real radios — each star (or half
          star) is an <C>input[type="radio"]</C> named through the catalog (
          <em>&ldquo;3 stars&rdquo;</em>, <em>&ldquo;2.5 stars&rdquo;</em>), so
          state and value are the browser&rsquo;s own, not a WAI-ARIA impression
          of them. The icon spans are decoration. <C>readOnly</C> sets{" "}
          <C>aria-readonly</C> on the group while keeping the value announced;{" "}
          <C>disabled</C> takes the radios out of the tab order natively.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          It&rsquo;s a native radio group, so the browser provides it: Tab (or
          Shift+Tab from behind) reaches the group at the current value, arrow
          keys move the selection — with <C>allowHalf</C> each half is a stop —
          and Space picks. There is no custom keymap to drift out of sync. Hover
          is preview-only; nothing commits before an actual pick.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The group name (<C>kit.rating.label</C>) and each radio&rsquo;s value
          string (<C>kit.rating.value</C> — a real ICU plural, so <C>1 Stern</C>{" "}
          against <C>2 Sterne</C>, and half steps ride the decimal through to
          the <em>other</em> category) ride the catalog in five locales. The
          tone is themeable but the grammar is not hardcoded anywhere.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default RatingPage;
