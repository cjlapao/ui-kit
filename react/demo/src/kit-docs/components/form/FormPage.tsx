import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { FormPlayground } from "./FormPlayground";
import AccountForm from "./examples/AccountForm";
import accountFormCode from "./examples/AccountForm.tsx?raw";
import Sections from "./examples/Sections";
import sectionsCode from "./examples/Sections.tsx?raw";
import Layouts from "./examples/Layouts";
import layoutsCode from "./examples/Layouts.tsx?raw";
import InlineFields from "./examples/InlineFields";
import inlineFieldsCode from "./examples/InlineFields.tsx?raw";
import FieldStates from "./examples/FieldStates";
import fieldStatesCode from "./examples/FieldStates.tsx?raw";

export const FormPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Form"
      description={`Three primitives that build a form: \`FormSection\` is a Panel with a header, body and footer; \`FormLayout\` is the responsive grid inside it; \`FormField\` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present.`}
    />
    <FormPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Account form"
        description="All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio."
        code={accountFormCode}
        filename="AccountForm.tsx"
      >
        <AccountForm />
      </ExampleCard>
      <ExampleCard
        title="Section surfaces"
        description="A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface."
        code={sectionsCode}
        filename="Sections.tsx"
      >
        <Sections />
      </ExampleCard>
      <ExampleCard
        title="Column counts"
        description={`\`columns\` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows stretch, so a field carrying a description does not push its own input below its neighbour\'s.`}
        code={layoutsCode}
        filename="Layouts.tsx"
      >
        <Layouts />
      </ExampleCard>
      <ExampleCard
        title="Inline fields"
        description="`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room."
        code={inlineFieldsCode}
        filename="InlineFields.tsx"
      >
        <InlineFields />
      </ExampleCard>
      <ExampleCard
        title="Field states"
        description="An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse."
        code={fieldStatesCode}
        filename="FieldStates.tsx"
      >
        <FieldStates />
      </ExampleCard>
    </section>

    <PropsTable
      title="FormField"
      props={[
        {
          name: "label / labelFor / description",
          type: "ReactNode / string / ReactNode",
          description:
            "A real <label htmlFor> — against labelFor, the child&rsquo;s own id, or an id FormField generates and clones onto the child. The description rides along in aria-describedby.",
        },
        {
          name: "hint / helpText / error",
          type: "ReactNode",
          description:
            "Notes under the control, all wired into aria-describedby. An error replaces the hint visually and adds aria-invalid on the child — even when you forget validationStatus. helpText never gets replaced: it stays beside the error.",
        },
        {
          name: "required / optionalLabel",
          type: "boolean / ReactNode",
          default: "false / —",
          description:
            "required paints the asterisk and sets aria-required on the child — the announcement, not just the decoration. optionalLabel marks the inverse.",
        },
        {
          name: "validationStatus",
          type: '"none" | "error" | "success"',
          default: 'error ? "error" : "none"',
          description:
            "Tints the notes; error also invalidates. Defaults are derived from error, so setting only error is correct, not incomplete.",
        },
        {
          name: "layout / width / size / labelAction",
          type: '"stacked" | "inline" / "auto" | "full" / ControlSize / ReactNode',
          default: '"stacked" / "auto" / "md" / —',
          description:
            "Inline moves the label to its own column on wide screens; labelAction is a button slot — opposite the label when stacked, under the description when inline.",
        },
      ]}
    />
    <PropsTable
      title="FormLayout"
      props={[
        {
          name: "columns",
          type: "1 | 2 | 3 | 4",
          default: "1",
          description:
            "Responsive — every count collapses to one column on narrow screens. No horizontal padding of its own, so fields stay in line with the section heading.",
        },
        {
          name: "align",
          type: '"start" | "center" | "stretch"',
          default: '"stretch"',
          description:
            "Stretch fills every field with the row&rsquo;s height, and FormField spends it on a spacer above its control — so inputs start on one line across a row however much label, description or hint each field carries. `start` top-aligns labels but lets controls drift; `center` centres whole fields.",
        },
        {
          name: "gap / verticalPadding",
          type: "ControlSize",
          default: '"md" / "sm"',
          description: "Spacing on the shared xs&rarr;xl ladder.",
        },
      ]}
    />
    <PropsTable
      title="FormSection"
      props={[
        {
          name: "title / description / footer",
          type: "ReactNode",
          description:
            "A Panel with a header (border-b + heading + description), a body and an action footer — heading, notes and dividers all take the surface&rsquo;s text tokens, so glass darkens its copy instead of losing it.",
        },
        {
          name: "variant / tone / corner",
          type: "PanelVariant / TrueColor / PanelCorner",
          default: '"elevated" / "neutral" / "rounded-md"',
          description:
            "The full Panel surface set — a FormSection <em>is</em> a Panel, not a copy of one.",
        },
        {
          name: "vibrancy / glassOpacity / specularMode",
          type: "GlassVibrancy / GlassOpacity / PanelSpecularMode",
          description: "Forwarded to Panel for the liquid-glass surface.",
        },
        {
          name: "padding",
          type: "ControlSize",
          default: '"md"',
          description:
            "Header, body and footer padding, on the shared scale (the footer is deliberately tighter).",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          These primitives own one thing: <em>association</em>. FormField points
          a real <C>label htmlFor</C> at the control (its <C>id</C>, or a
          generated one cloned onto the child — the clone is <em>always</em>{" "}
          applied, because a label pointing at an id that exists nowhere is
          worse than no label element at all), threads description, help, hint
          and error into <C>aria-describedby</C>, sets <C>aria-invalid</C>{" "}
          whenever an error shows and <C>aria-required</C> when required — the
          asterisk itself is <C>aria-hidden</C> decoration. What the field{" "}
          <em>says</em> is all yours: the components render no strings of their
          own, so nothing needs translating here.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          None of the three intercepts keys — Tab visits label-then-control
          exactly as the markup lays them out (label clicks focus the control;
          the footer buttons are ordinary buttons). The <C>labelAction</C>{" "}
          button sits in the label row, so in DOM order it comes <em>before</em>{" "}
          the field it describes — put it somewhere it makes sense to reach on
          the way, or leave it out.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          No catalog keys exist because no strings exist: label, description,
          hint, help, error and optionalLabel are ReactNodes you supply, so your
          i18n layer — including any provider you use elsewhere — feeds them
          untouched. Even the required asterisk is typography, not text.
          Direction flows from the document like any other container.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default FormPage;
