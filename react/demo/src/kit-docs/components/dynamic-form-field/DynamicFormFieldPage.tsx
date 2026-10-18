import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DynamicFormFieldPlayground } from "./DynamicFormFieldPlayground";
import ValueTypes from "./examples/ValueTypes";
import valueTypesCode from "./examples/ValueTypes.tsx?raw";
import PlainForm from "./examples/PlainForm";
import plainFormCode from "./examples/PlainForm.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";

export const DynamicFormFieldPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dynamic Form Field"
      description="One blueprint parameter, rendered as the control its value type calls for — text, secret, number, checkbox, select, list or key/value map. The label, the required marker, the hint and the error all come from `FormField`, the card defaults to the kit&rsquo;s elevated surface in the default blue, and the entry inside it follows the card."
    />
    <DynamicFormFieldPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every value type"
        description="`List` renders a line-per-entry textarea and `Map` renders the kit's key/value editor — the two types that used to fall through to nothing and draw an empty bordered card."
        code={valueTypesCode}
        filename="ValueTypes.tsx"
      >
        <ValueTypes />
      </ExampleCard>
      <ExampleCard
        title="A form, not a stack of boxes"
        description="`variant='plain'` drops the per-field card so a whole parameter set reads as one surface. Every field used to force its own bordered card with no way to turn it off."
        code={plainFormCode}
        filename="PlainForm.tsx"
      >
        <PlainForm />
      </ExampleCard>
      <ExampleCard
        title="Required and errors"
        description="The label, marker, hint and error come from `FormField` rather than being hand-rolled per branch — which is why the error now shows for a checkbox, where the old boolean branch rendered none at all."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "parameter / value / onChange",
          type: "CapsuleBlueprintParameter / DynamicFormFieldValue / (service, key, value, trigger?) => void",
          description:
            "The control is picked by the parameter's value type: text, secret (password), int (number), boolean, select, list (line-per-entry textarea) and map (the kit's key/value editor). onChange reports the parameter's own service_name so one handler can route a whole blueprint.",
        },
        {
          name: "error / isVisible",
          type: "string / boolean",
          default: "— / true",
          description:
            "The error renders through FormField for every type - including the checkbox, whose old branch showed none and validated silently. Hidden, untyped or unrenderable parameters draw nothing, not an empty card.",
        },
        {
          name: "variant",
          type: 'SurfaceVariant | "plain"',
          default: '"elevated"',
          description:
            "Every container surface for the card around the field - the elevated default is the kit's own surface, matching Panel. Tonal trades the chrome for the tone's wash (blue by default), and plain drops the card so a parameter set reads as one surface.",
        },
        {
          name: "inputVariant",
          type: 'InputVariant | "auto"',
          default: '"auto"',
          description:
            "The entry style follows the card by default through `INPUT_VARIANT_FOR_SURFACE` — a glass card gets a glass entry, a tonal or borderless card a borderless one — so the two can never read as different widgets. An explicit style wins over the card, as it must for an app that mixes them on purpose.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared field scale, passed straight to whichever control the type calls for - so a blueprint form lines up with the app's own Inputs.",
        },
        {
          name: "tone / corner / padding",
          type: "TrueColor / SurfaceCorner / SurfacePadding",
          default: '"blue" / auto / "md"',
          description:
            "Card decoration through the theme's scales - the blue default is the kit's, drawing a tonal wash blue and putting the accent on every focus ring and badge; the entry takes its tone from the same prop.",
        },
        {
          name: "required (via parameter)",
          type: "is_required | required",
          description:
            "Both blueprint spellings are read, so a parameter using `required` now gets its marker and the `required` attribute - it used to be silently ignored.",
        },
        {
          name: "help / helpTitle / helpTone",
          type: "parameter.help / ReactNode / TrueColor",
          default: '— / localized "What is this?" / the field\'s tone',
          description:
            "Parameters carrying a help text get the expanding help block; the heading routes through the kit catalogs.",
        },
        {
          name: "disabled / readOnly",
          type: "boolean",
          default: "false",
          description:
            "Both report nothing through onChange; read-only also locks the text controls rather than only muting them.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Label, hint and error come from <C>FormField</C> and are wired with{" "}
          <C>htmlFor</C> and <C>aria-describedby</C> rather than drawn as stray
          text - except the checkbox, which carries its own label and
          description instead of being announced twice. A required parameter
          sets the <C>required</C> attribute under either flag spelling.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Every branch is a real form control on the tab order. Blurring a text
          or int field that other fields depend on re-triggers their evaluation
          - previously only strings did, so an <C>Int</C> could strand a
          dependent field forever.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The help heading, the optional-select placeholder and the list&rsquo;s
          one-per-line hint resolve through the kit catalogs at render time - a
          German form shows <C>Was ist das?</C> and <C>Auswählen…</C>. Parameter
          names and hints are app data and pass through untouched.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default DynamicFormFieldPage;
