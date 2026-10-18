import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PasswordInputPlayground } from "./PasswordInputPlayground";
import AsInput from "./examples/AsInput";
import asInputCode from "./examples/AsInput.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PasswordInputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Password Input"
      description="An Input that masks its value, with a reveal toggle in the trailing slot. It is the same control: every variant, size, tone, validation state, icon and native attribute behaves identically, and the field markup is asserted to match a bare Input at the same settings."
    />
    <PasswordInputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="It is an Input"
        description="Each row pairs the two at identical settings. The field markup is byte-identical in the tests — the only differences you should see are the mask and the eye."
        code={asInputCode}
        filename="AsInput.tsx"
      >
        <AsInput />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The reveal glyph is a registry icon, so it scales with the field. It used to be a raw component with a hardcoded `w-4 h-4` that stayed 16px at every size."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="When the toggle is offered"
        description="Not on a disabled or read-only field — it used to stay live there, so a password the user could not edit could still be read back."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "(Input props)",
          type: "InputProps",
          description:
            "Everything: `variant`, `size`, `tone`, `validationStatus`, the glow trio, icons, and every native attribute. The one omission is `type` — this component owns it, since &ldquo;mask it&rdquo; *is* the component. Markup is asserted byte-identical to a bare `Input` at the same settings, so a styling bug can&rsquo;t live here.",
        },
        {
          name: "revealable",
          type: "boolean",
          default: "true",
          description:
            "Offer the toggle at all — off for a secret that should never read back (a key being re-entered). Also withdrawn by `disabled` and `readOnly`, which used to leave the mask off while the field itself was locked.",
        },
        {
          name: "revealed",
          type: "boolean",
          description:
            "Controlled reveal state. Omit for uncontrolled — the component keeps its own flag and the eye just flips it.",
        },
        {
          name: "onRevealedChange",
          type: "(revealed: boolean) => void",
          description:
            "Fires on every flip — the only callback the toggle has. Safe for a log: it reports the event, never the value.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The mask is the browser&rsquo;s job — <C>type=&quot;password&quot;</C>{" "}
          is what makes dots out of characters, and no assistive tech needs to
          be told more. The toggle is a real <C>&lt;button&gt;</C> whose name
          describes the action it will take: &ldquo;Show password&rdquo; while
          masked, &ldquo;Hide password&rdquo; while revealed — so on refocus the
          name itself reports the state. It is deliberately not an{" "}
          <C>aria-pressed</C> toggle button; a pressed state pairs with a static
          label, and the name-swap pattern avoids a &ldquo;Show password,
          pressed&rdquo; double-message. The accessible name comes from the
          kit&rsquo;s catalogue, so it is the user&rsquo;s language, not yours.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          There is nothing custom, which is the point: <C>Tab</C> reaches the
          reveal button after the field, <C>Enter</C> or <C>Space</C> flips it,
          focus stays on the button either way, and the masked field behaves
          like every password field the browser knows — paste rules, autofill
          prompts, the lot. Revealing does not move focus, so the keyboard user
          sees the text where they left their hands.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Two strings, both in the kit catalogue: <C>kit.passwordinput.show</C>{" "}
          and <C>kit.passwordinput.hide</C> — the reveal button&rsquo;s
          accessible name, flipped with the state. Everything else visible is
          the caller&rsquo;s (placeholder, label) or the browser&rsquo;s
          (autofill, the dots themselves). Under a non-English locale the button
          says &ldquo;Passwort anzeigen&rdquo;, not &ldquo;Show password&rdquo;
          — an untranslated eye-button is a screen-reader bug, not a cosmetic
          one, so the key is asserted in the tests.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default PasswordInputPage;
