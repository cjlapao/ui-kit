import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11ySection,
  A11yTopic,
  C,
  Kbd,
  PropsTable,
} from "../../shared/A11ySections";
import { TogglePlayground } from "./TogglePlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import Labeled from "./examples/Labeled";
import labeledCode from "./examples/Labeled.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";

export const TogglePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toggle"
      description="A switch for a single on/off setting. Five treatments from Button's vocabulary — solid, soft, outline, ghost and glass — labels and descriptions live with the control, and the whole row is the click target. Works uncontrolled out of the box."
    />
    <TogglePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled: defaultChecked seeds the state and the control toggles on its own."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description={`The five \`variant\` treatments from \`Button\`'s vocabulary — each row shows the off and the on state. The off-state track is neutral in every variant; the on-state fill carries the treatment. \`color\` takes any of the 21 palette tones.`}
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="`iconOn` and `iconOff` each live in the half of the track the thumb is not in — `iconOn` on the left (visible while checked), `iconOff` on the right (visible while unchecked) — centered in that half with breathing room to both the thumb and the wall, scaled to the toggle's size, and cross-fading with the thumb."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="Labeled"
        description="A label plus a description, stacked under the label or inline beside it."
        code={labeledCode}
        filename="Labeled.tsx"
      >
        <Labeled />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Five sizes — the shared control scale every input, button and search bar offers — from dense settings lists to onboarding screens. The thumb always travels the full track, landing flush against the far wall."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="Both disabled states stay legible — the position, not the fill, carries the meaning."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Under the track is a native <code>checkbox</code> with{" "}
          <C>role="switch"</C> — so readers announce{" "}
          <em>&ldquo;on&rdquo;/&ldquo;off&rdquo;</em>, not{" "}
          <em>&ldquo;checked&rdquo;</em>, which is what a toggle means. The
          visible <C>label</C> is a real <code>label htmlFor</code>, the{" "}
          <C>description</C> is attached via <C>aria-describedby</C>, and the
          decorative track, thumb and icons are <C>aria-hidden</C> — the state
          lives in the input, nowhere else. An unlabeled Toggle warns in
          development like every kit control (<C>warnIfMissingName</C>);{" "}
          <C>aria-label</C> substitutes when there is genuinely no visible
          label.
        </p>
        <p>
          A <C>tooltip</C> is portalled with <C>role="tooltip"</C> and linked
          via <C>aria-describedby</C> while visible, spoken alongside the switch
          state.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          All of it is native: <Kbd>Tab</Kbd> reaches the checkbox,{" "}
          <Kbd>Space</Kbd> toggles it — no hand-rolled key handlers to drift
          from browser behaviour. The row (track plus label plus padding) is the
          click target, and clicking it performs a <em>real</em> programmatic
          click on the input, so uncontrolled state, the thumb and{" "}
          <C>onChange</C> all move together; clicks the browser already handled
          — the input and its label — are ignored on the way up so nothing
          double-fires. <C>readOnly</C> prevents the flip rather than ignoring
          the key, and <C>disabled</C> leaves the tab order entirely.
        </p>
        <p>
          The focus indicator is <C>peer-focus-visible</C> on the track —
          keyboard focus rings the switch itself, a mouse click does not, and
          the ring sits on the visible control rather than the invisible input
          behind it.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Toggle is entirely language-free: no built-in strings exist to
          localize — the label, description and tooltip are all the
          caller&rsquo;s text and pass through untouched, and <C>iconOn</C>/
          <C>iconOff</C> are registry glyphs, which carry no words. On/off
          itself is communicated by the platform (the switch role&rsquo;s
          state), so there is nothing to translate and nothing to mistranslate.
          Localized labels come free from your i18n layer — the i18n page shows
          how kit-level strings are overridden when a component does have them.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "label",
          type: "ReactNode",
          description:
            "Rendered as a real <label htmlFor> — the accessible name, and part of the click target.",
        },
        {
          name: "description",
          type: "ReactNode",
          description:
            "Helper line under (or beside) the label, attached with `aria-describedby`.",
        },
        {
          name: "descriptionPlacement",
          type: '"stacked" | "inline"',
          default: '"stacked"',
          description: "Below the label, or flowing inline beside it.",
        },
        {
          name: "alignLabel",
          type: '"left" | "right"',
          default: '"right"',
          description:
            "Label beside the track on either side — `left` is the settings-row layout (label first), `right` puts it after the switch.",
        },
        {
          name: "variant",
          type: "ToggleVariant",
          default: '"solid"',
          description:
            "The Button family: solid · soft · outline · ghost · glass. The off-state track is neutral in every variant; the on-state fill carries the treatment.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "On-state fill and focus ring, from the 21 true colours. The glass variant tints with the full-chroma 500 step at a translucent alpha — the pastel big glass surfaces use washes out at pill size.",
        },
        {
          name: "color",
          type: "TrueColor",
          description:
            "Deprecated spelling of `tone`; `tone` wins when both are given.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale — track, thumb, glyph and label type all derive from it, and the thumb always travels the full track to land flush against the far wall.",
        },
        {
          name: "padding",
          type: "SurfacePadding",
          default: '"sm"',
          description: "Around the row — the kit's shared padding scale.",
        },
        {
          name: "iconOn / iconOff",
          type: "string | ReactElement",
          description:
            "Glyphs in the half of the track the thumb is not in, cross-fading with it, scaled to the toggle.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          description:
            "Stretch the row — label to the left edge, switch to the right.",
        },
        {
          name: "disabled",
          type: "boolean",
          description:
            "Native attribute; the position, not the fill, still carries the state.",
        },
        {
          name: "readOnly",
          type: "boolean",
          description:
            "Reads like a toggle, resists like a readout — clicks and Space are prevented, not ignored.",
        },
        {
          name: "checked / defaultChecked / onChange",
          type: "native",
          description:
            "The input's own — uncontrolled out of the box, controlled whenever the app wants.",
        },
        {
          name: "tooltip / tooltipPosition",
          type: "string / TooltipPosition",
          description:
            "Portalled tooltip on hover and focus, described while visible.",
        },
        {
          name: "glass / vibrancy / glassOpacity / specularMode",
          type: "deprecated / GlassVibrancy / GlassOpacity / SpecularMode",
          description:
            '`glass` is the legacy spelling of `variant="glass"`; the tuning knobs apply to the variant.',
        },
      ]}
    />
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      Spreads native input attributes — <code>name</code>, <code>value</code>,{" "}
      <code>aria-*</code> pass straight through to the checkbox underneath.
    </p>
  </div>
);

export default TogglePage;
