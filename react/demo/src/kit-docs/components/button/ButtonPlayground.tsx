import React from "react";
import { Button } from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  ButtonVariant,
  ButtonWeight,
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
  TooltipPosition,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import { buttonConfig, FORM_PROPS, hostStateLines } from "./buttonPlayground";
import { SLOT_NAMES, STAGE_CLASS, richLabelNode } from "./buttonFixture";
import {
  COLOR_DEFAULT,
  GLASS_OPACITY_DEFAULT,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT,
  TOOLTIP_DELAY_DEFAULT,
  TOOLTIP_POSITION_DEFAULT,
  TYPE_DEFAULT,
  VARIANT_DEFAULT,
  VIBRANCY_DEFAULT,
  WEIGHT_DEFAULT,
  accentColorOf,
  clickReport,
  flag,
  iconColorOf,
  iconOf,
  isInForm,
  isMenuOpen,
  isRichLabel,
  submitReport,
  textValue,
} from "./buttonStage";

/**
 * The engine-driven playground for one `Button`. The tag the Code view prints and
 * the tag that paints come from the same config — including the `<form>` the page
 * can wrap it in, which is printed rather than quietly added.
 */

/** The three values the element's `type` attribute accepts (:141,:300-303). */
type ButtonType = "button" | "submit" | "reset";

/**
 * A knob left at the component's own default is not passed at all: the destructured
 * default (:116-141) has to earn its keep in front of the reader.
 */
const atDefault = <T extends string | number>(
  state: PlaygroundState,
  id: string,
  documented: T,
): T | undefined => {
  const raw = state[id];
  if (typeof raw !== "string" && typeof raw !== "number") return undefined;
  return String(raw) === String(documented) ? undefined : (raw as unknown as T);
};

/** The same question for a boolean, whose kit default is `false` (:120-132). */
const on = (state: PlaygroundState, id: string): true | undefined =>
  flag(state, id) ? true : undefined;

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const label = textValue(state, "label");
  const children = isRichLabel(state) ? richLabelNode(label) : label;
  const wired = flag(state, "onClick");

  const button = (
    <Button
      variant={atDefault<ButtonVariant>(state, "variant", VARIANT_DEFAULT)}
      color={atDefault<TrueColor>(state, "color", COLOR_DEFAULT)}
      size={atDefault<ButtonSize>(state, "size", SIZE_DEFAULT)}
      weight={atDefault<ButtonWeight>(state, "weight", WEIGHT_DEFAULT)}
      type={atDefault<ButtonType>(state, "type", TYPE_DEFAULT)}
      vibrancy={atDefault<GlassVibrancy>(state, "vibrancy", VIBRANCY_DEFAULT)}
      glassOpacity={atDefault<GlassOpacity>(
        state,
        "glassOpacity",
        GLASS_OPACITY_DEFAULT,
      )}
      specularMode={atDefault<SpecularMode>(
        state,
        "specularMode",
        SPECULAR_DEFAULT,
      )}
      tooltipPosition={atDefault<TooltipPosition>(
        state,
        "tooltipPosition",
        TOOLTIP_POSITION_DEFAULT,
      )}
      tooltipDelay={
        typeof state.tooltipDelay === "number" &&
        state.tooltipDelay !== TOOLTIP_DELAY_DEFAULT
          ? state.tooltipDelay
          : undefined
      }
      fullWidth={on(state, "fullWidth")}
      iconOnly={on(state, "iconOnly")}
      accent={on(state, "accent")}
      active={on(state, "active")}
      glass={on(state, "glass")}
      loading={on(state, "loading")}
      disabled={on(state, "disabled")}
      tooltipDisabled={on(state, "tooltipDisabled")}
      accentColor={accentColorOf(state) as TrueColor | undefined}
      leadingIcon={iconOf(state, "leadingIcon")}
      trailingIcon={iconOf(state, "trailingIcon")}
      iconColor={iconColorOf(state)}
      tooltip={textValue(state, "tooltip") || undefined}
      aria-label={textValue(state, "ariaLabel") || undefined}
      aria-expanded={isMenuOpen(state) ? true : undefined}
      onClick={
        wired ? (event) => set("clickReport", event.currentTarget.type) : undefined
      }
    >
      {children}
    </Button>
  );

  const reported = clickReport(state);
  const submitted = submitReport(state);
  // A stale report is not a claim that the button can still be clicked: once the
  // element carries the attribute, there is nothing to click (:305).
  const blocked = flag(state, "disabled") || flag(state, "loading");

  return (
    <div className={STAGE_CLASS}>
      {isInForm(state) ? (
        <form
          className="flex w-full flex-col items-start gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            set("submitReport", "submitted");
          }}
        >
          {button}
          <button
            type="submit"
            className="text-xs font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400"
          >
            Submit the form
          </button>
        </form>
      ) : (
        button
      )}

      {wired ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {reported === "" || blocked ? (
            <>
              No click reported — the element carries the <C>disabled</C> attribute,
              so there is nothing to click (:305).
            </>
          ) : (
            <>
              <C>onClick</C> fired for a{" "}
              <C>
                &lt;button type=&quot;{reported}&quot;&gt;
              </C>{" "}
              element (:303,:311).
            </>
          )}
        </p>
      ) : null}

      {isInForm(state) ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {submitted === "" ? (
            <>
              The form never saw a submit: a <C>type=&quot;button&quot;</C> element
              does not submit the form it sits in (:141,:300-303). Set <C>type</C> to{" "}
              <C>submit</C> and try again.
            </>
          ) : (
            <>
              The form submitted — which only happens with{" "}
              <C>type=&quot;submit&quot;</C> (:303).
            </>
          )}
        </p>
      ) : null}
    </div>
  );
};

/** Kit components a printed block mounts, found in the text rather than guessed. */
const kitNamesIn = (printed: string): string[] =>
  ["Button", "Pill"].filter((name) => printed.includes(`<${name}`));

/** A label is JSX text, so the characters that mean something else get quoted. */
const jsxText = (label: string): string =>
  /[<>{}]/.test(label) ? `{${JSON.stringify(label)}}` : label;

export const buttonCode = ({ state, h }: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  let children: string;

  if (isRichLabel(state)) {
    decls.push(
      h.const("LABEL", {
        source: h.jsx(richLabelNode(textValue(state, "label")), {
          names: SLOT_NAMES,
        }),
        label: "children that are not a string",
        note:
          "an icon-only button with these children still announces the catalog's name — the sr-only fallback reads a string only (:268-273,:322)",
      }),
    );
    children = "{LABEL}";
  } else {
    children = jsxText(textValue(state, "label"));
  }

  const button = h.element("Button", [...h.props()], 0, children);
  const root = isInForm(state)
    ? h.element("form", [...FORM_PROPS], 0, button)
    : button;

  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ].join("\n");

  const imports = kitNamesIn(`${decls.join("\n")}${root}`).sort((a, b) =>
    a.localeCompare(b),
  );
  const snippet = h.snippet({ imports, decls, body: demo });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

const ButtonHint: React.FC = () => (
  <>
    <p>
      <strong>Two knobs reach the same mode, and one prop is four types.</strong>{" "}
      <C>iconOnly</C> and <C>variant=&quot;icon&quot;</C> both set <C>isIconMode</C>{" "}
      (:150): a square box, no text padding, and the children replaced by an sr-only
      span (:316-325). That span reads a <C>string</C> child, else the{" "}
      <C>aria-label</C>, else the catalog&rsquo;s <C>kit.button.name</C>{" "}
      (:268-273,:322) — turn on <C>Rich label</C> and the button is a glyph wearing a
      name its author never chose. The same <C>string | React.ReactElement</C> union
      is what <C>leadingIcon</C>/<C>trailingIcon</C> take (:59-60): a registry name
      here, an element there, painted identically (:279-295).
    </p>
    <p>
      <strong>Three props quietly own the colour.</strong> <C>accent</C> drops the
      variant&rsquo;s fill entirely and draws only a ring and a hover (:158-164).{" "}
      <C>accentColor</C> means two different things depending on another prop: with{" "}
      <C>active</C> it is the <em>fill</em> (:170-179); without it,{" "}
      <C>!isIconMode</C> and enabled, it replaces only the <em>hover</em> classes and
      leaves the base alone (:180-184) — so an icon-mode button ignores it outside{" "}
      <C>active</C>. <C>glass</C> (or <C>variant=&quot;glass&quot;</C>, which
      auto-enables it, :189) throws the variant&rsquo;s colour classes away and
      rebuilds the whole chrome from the glass helpers (:193-200) — which is also why
      the held-open hover sits glass out (:211-218).
    </p>
    <p>
      <strong>The open state is an attribute, not a prop.</strong> Button reads{" "}
      <C>props[&quot;aria-expanded&quot;]</C> (:211) — stamped by <C>Menu</C> on its
      trigger, or by you — and holds the variant&rsquo;s own hover classes as{" "}
      <C>aria-expanded:</C> utilities (:212-218, Theme:3127-3135). No new colour to
      keep in sync. <C>loading</C> is the opposite of an attribute: it sets the real{" "}
      <C>disabled</C> attribute so clicks cannot land (:305), keeps{" "}
      <C>aria-busy</C> (:310), hides the spinner from readers (:256), swaps the
      leading icon out and removes the trailing one (:315,:326) — and skips{" "}
      <C>disabled:opacity-50</C> so the one element that must stay visible does
      (:239,:98-101).
    </p>
    <p>
      <strong>Defaults the component sets for you.</strong> <C>type</C> defaults to{" "}
      <C>&quot;button&quot;</C>, not HTML&rsquo;s <C>&quot;submit&quot;</C>{" "}
      (:141,:300-303) — turn on <C>Sit it in a form</C> and press the form&rsquo;s
      submit: nothing happens until you set <C>type=&quot;submit&quot;</C>. The
      tooltip&rsquo;s <C>position</C> and <C>delay</C> are not Button&rsquo;s defaults
      at all but <C>TooltipWrapper</C>&rsquo;s (:334-335 ← TooltipWrapper:84-85), so
      the controls column only shows them once there is a tip to place.
    </p>
  </>
);

export const ButtonPlayground: React.FC = () => {
  const playground = usePlayground(buttonConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={buttonCode}
      filename="ButtonDemo.tsx"
      hint={<ButtonHint />}
    />
  );
};

export default ButtonPlayground;
