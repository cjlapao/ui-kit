import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SmartInputPlayground } from "./SmartInputPlayground";
import EnvironmentConfig from "./examples/EnvironmentConfig";
import environmentConfigCode from "./examples/EnvironmentConfig.tsx?raw";
import MissingVariables from "./examples/MissingVariables";
import missingVariablesCode from "./examples/MissingVariables.tsx?raw";
import CustomResolver from "./examples/CustomResolver";
import customResolverCode from "./examples/CustomResolver.tsx?raw";

export const SmartInputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Smart Input"
      description={`A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin.`}
    />
    <SmartInputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Environment config"
        description={`The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.`}
        code={environmentConfigCode}
        filename="EnvironmentConfig.tsx"
      >
        <EnvironmentConfig />
      </ExampleCard>
      <ExampleCard
        title="Missing variables"
        description="A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge."
        code={missingVariablesCode}
        filename="MissingVariables.tsx"
      >
        <MissingVariables />
      </ExampleCard>
      <ExampleCard
        title="Custom resolver"
        description="Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups."
        code={customResolverCode}
        filename="CustomResolver.tsx"
      >
        <CustomResolver />
      </ExampleCard>
    </section>

    <PropsTable
      props={[
        {
          name: "value / onChange",
          type: "string",
          description:
            "Always controlled — the plain string in, the whole plain string back out on every keystroke and every insertion. Tokens live inside it as `{{ var::group::NAME }}` text; the kit never stores a second copy.",
        },
        {
          name: "groups",
          type: "SmartVariableGroup[]",
          description:
            "The taxonomy is entirely the caller&rsquo;s: a group&rsquo;s `id` becomes the token&rsquo;s middle segment, so a group `deploy` yields `{{ var::deploy::REGION }}`. Each group names its tab in the picker.",
        },
        {
          name: "resolve",
          type: "SmartVariableResolver",
          description:
            "Turns a token into `{ value, state }`. Defaults to a lookup over `groups` (value → defaultValue → runtime → missing); supply your own for derived or environment-dependent values.",
        },
        {
          name: "placeholder",
          type: "string",
          description:
            "Shown in the edit field and italic in the empty preview (which falls back to the translated “Empty”), and it doubles as the preview button&rsquo;s accessible name when no `aria-label` is given.",
        },
        {
          name: "multiline / rows",
          type: "boolean / number",
          default: "false / 4",
          description:
            "A textarea instead of a single-line field, with the platform scrollbar thinned and given a gutter. Tokens stay editable as plain text either way.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared five-step control scale — `xs` through `xl`, from the same padding table as the `Input`, `Textarea` and `SearchBar` beside it. It used to be a local three-step scale whose padding matched none of them.",
        },
        {
          name: "variant / tone",
          type: "InputVariant / TrueColor",
          default: '"flat" / "blue"',
          description:
            "The shared input surfaces — `glass` really blurs, `gradient` really glows — and the accent for the focus border/ring (the shared field tokens, on every tone) and the picker trigger.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: '"auto"',
          description:
            "The field&rsquo;s radius on the shared corner scale. `auto` is the theme&rsquo;s **control** corner — the same `rounded-lg` every sibling field wears, one step looser than the container default so the control sits proud of its card; an explicit token replaces it, glass fills and tone-tinted ghost surfaces included.",
        },
        {
          name: "glowIntensity / gradientFrom / gradientTo",
          type: "GlowIntensity / string",
          default: '"subtle" / the tone’s 600 → 400 shades',
          description:
            "The two-lobe focus halo of the `gradient` variant, identical to `Input`, `Textarea` and `SearchBar`.",
        },
        {
          name: "panelVariant",
          type: '"auto" | SurfaceVariant',
          default: '"auto"',
          description:
            "The picker card&rsquo;s surface. `auto` follows the field through `SURFACE_VARIANT_FOR_FIELD` — a glass field gets a glass picker, a flat field an outlined card — and an explicit choice overrules. The same contract the `DatePicker` calendar makes; inside a glass card the picker&rsquo;s own search box goes glass with it.",
        },
        {
          name: "panelCorner",
          type: "SurfaceCorner",
          default: '"auto"',
          description:
            "The picker card&rsquo;s radius. `auto` resolves to the theme&rsquo;s **container** corner — the ladder holds even here: the card stays one step tighter than the field poking out of it. An explicit token overrules.",
        },
        {
          name: "defaultViewMode",
          type: '"token" | "value"',
          default: '"token"',
          description:
            "Which view the preview opens in; the eye toggle swaps every badge at once. Values mode masks secrets.",
        },
        {
          name: "autocomplete",
          type: "boolean",
          default: "true",
          description:
            "Typing the opening `{{` in edit mode opens the picker filtered to what you type next, and inserting replaces the partial token instead of stacking braces.",
        },
        {
          name: "flagMissing",
          type: "boolean",
          default: "true",
          description:
            "Tokens naming no declared variable get dashed badges and a counted badge. A variable that is declared but has no value yet is a softer, separate state — amber “empty”, not counted as missing.",
        },
        {
          name: "disabled / aria-label / className",
          type: "boolean / string / string",
          description:
            "Standard. Without `aria-label` the preview button falls back to the placeholder, then to the translated “Edit value”.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          At rest the control is one <C>role="button"</C> — named by{" "}
          <C>aria-label</C>, falling back to the placeholder, then to{" "}
          <em>Edit value</em> — not an unlabeled blob of badges. Inside it the
          badges are visual (their state lives in a tooltip), which is the
          honest gap: an unknown token is not announced on its own. The missing
          badge is decoration with a tooltip, not a live region. The eye and{" "}
          <em>+</em> buttons carry names, and <em>+</em> publishes{" "}
          <C>aria-expanded</C> / <C>aria-controls</C> while the picker is open —
          a Panel with a real heading, a labelled <C>SearchBar</C>, and rows
          named with the full token.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Tab reaches the preview; Enter or Space opens it into the field, with
          focus already inside. <em>+</em> opens the picker (Enter/Space or
          click), <C>Escape</C> closes it, and an outside pointer or a keyboard
          move elsewhere closes it too — clicking the picker&rsquo;s own chrome
          never does. An insertion returns focus to the field with the caret
          sitting after the token, not dumped at the end of the value. Picker
          rows are ordinary buttons — Tab and Enter, no arrow grid.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Toggle labels, the picker trigger, the empty fallback, the missing
          badge (a real ICU plural — <C>1 fehlt</C>, <C>2 fehlen</C>) and the
          badge titles ride <C>kit.smartinput.*</C>; the picker&rsquo;s own
          strings ride <C>kit.variablepicker.*</C> — five locales, byte-parity
          tested. What deliberately stays put: the <C>VAR:</C> / <C>ENV:</C>{" "}
          prefixes and the token grammar they echo, and the{" "}
          <C>&bull;&bull;&bull;&bull;&bull;&bull;</C> secret mask.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default SmartInputPage;
