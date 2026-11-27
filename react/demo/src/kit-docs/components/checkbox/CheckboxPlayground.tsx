import React from "react";
import { Checkbox } from "@cjlapao/ui-kit";
import type {
  CheckboxAlign,
  CheckboxDescriptionPlacement,
  CheckboxSize,
  CheckboxValidationStatus,
  CheckboxVariant,
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
import {
  checkboxConfig,
  hostStateLines,
  stageCaption,
  toneSpelling,
} from "./checkboxPlayground";
import {
  ALIGN_DEFAULT,
  PLACEMENT_DEFAULT,
  SIZE_DEFAULT,
  STAGE_CLASS,
  TONE_DEFAULT,
  VALIDATION_DEFAULT,
  VARIANT_DEFAULT,
  changeReport,
  flag,
  hasDescription,
  hasMessage,
  isControlled,
  textValue,
  usesLegacyColor,
} from "./checkboxStage";

/**
 * The engine-driven playground for one `Checkbox`. The tag the Code view prints and
 * the tag that paints come from the same config, so the only difference between the
 * two panes is that one of them is alive.
 */

/**
 * A knob left at the component's own default is not passed at all: the destructured
 * default (:192-206) has to earn its keep in front of the reader.
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

/** The same question for a boolean, whose kit default is `false` (:197-205). */
const on = (state: PlaygroundState, id: string): true | undefined =>
  flag(state, id) ? true : undefined;

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const legacy = usesLegacyColor(state);
  const tone = textValue(state, "tone") || TONE_DEFAULT;
  const painted = tone === TONE_DEFAULT ? undefined : (tone as TrueColor);
  const controlled = isControlled(state);
  const reported = changeReport(state);

  // `defaultChecked` and `checked` are decided at mount (:295), so changing one of
  // them has to remount the box — otherwise the DOM node keeps the state it was
  // created with and the knob looks broken.
  const mount = `${controlled ? "controlled" : "free"}:${
    flag(state, "defaultChecked") ? "on" : "off"
  }`;

  const box = (
    <Checkbox
      key={mount}
      variant={atDefault<CheckboxVariant>(state, "variant", VARIANT_DEFAULT)}
      size={atDefault<CheckboxSize>(state, "size", SIZE_DEFAULT)}
      controlAlign={atDefault<CheckboxAlign>(state, "controlAlign", ALIGN_DEFAULT)}
      descriptionPlacement={atDefault<CheckboxDescriptionPlacement>(
        state,
        "descriptionPlacement",
        PLACEMENT_DEFAULT,
      )}
      validationStatus={atDefault<CheckboxValidationStatus>(
        state,
        "validationStatus",
        VALIDATION_DEFAULT,
      )}
      tone={legacy ? undefined : painted}
      color={legacy ? painted : undefined}
      label={textValue(state, "label") || undefined}
      description={
        hasDescription(state) ? textValue(state, "description") : undefined
      }
      validationMessage={
        hasMessage(state) ? textValue(state, "validationMessage") : undefined
      }
      aria-label={textValue(state, "ariaLabel") || undefined}
      inputClassName={textValue(state, "inputClassName") || undefined}
      fullWidth={on(state, "fullWidth")}
      required={on(state, "required")}
      indeterminate={on(state, "indeterminate")}
      disabled={on(state, "disabled")}
      defaultChecked={
        !controlled && flag(state, "defaultChecked") ? true : undefined
      }
      checked={controlled ? reported === "true" : undefined}
      onChange={(event) => set("report", String(event.target.checked))}
    />
  );

  return (
    <div className={STAGE_CLASS}>
      {box}
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {stageCaption(state)}
      </p>
      {controlled ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          <C>isOn</C> is {reported === "true" ? "true" : "false"} — the input carries{" "}
          <C>checked</C>, so the tick only appears when your own state does (:295).
        </p>
      ) : null}
    </div>
  );
};

export const checkboxCode = ({ state, h }: PlaygroundCodeContext): string => {
  const root = h.element("Checkbox", [...h.props()], 1);
  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ];
  const snippet = h.snippet({
    imports: ["Checkbox"],
    decls: [],
    body: demo.join("\n"),
  });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

/** What the stage is actually showing, in the reader's own language. */
const CheckboxHint: React.FC<{ state: PlaygroundState }> = ({ state }) => (
  <>
    <p>
      <strong>The box you see is a picture; the input underneath is the real
      control.</strong> The kit used to keep the native checkbox and paint classes
      over it — and a native box ignores every one of them (the source measured{" "}
      <C>border-width: 0</C>, <C>border-radius: 0</C>, so only <C>accent-color</C>{" "}
      ever did anything, and dark mode still drew the browser&rsquo;s light widget)
      (:148-156). Now the input is an invisible overlay (:289) and the box, tick and
      dash beside it are the kit&rsquo;s own (:300-342). The overlay keeps its pointer
      events on purpose: <C>peer-hover</C> is the input&rsquo;s <C>:hover</C> seen from
      a sibling, and muting it would have deadened every variant&rsquo;s hover border
      (:283-288).
    </p>
    <p>
      <strong>Every drawn layer is a sibling of the input, never a child.</strong>{" "}
      <C>peer-checked:</C> and <C>peer-indeterminate:</C> compile to a
      general-sibling selector, so a glyph nested inside the box would simply never
      match (:297-299). That is also why only one glyph shows at a time and why{" "}
      <C>indeterminate</C> wins (:326-328) — which is what the native control does.
    </p>
    <p>
      <strong>The accent is {toneSpelling(state)}=
      {`"${textValue(state, "tone") || TONE_DEFAULT}"`}</strong>, and its checked fill
      is the <C>700</C> step in light mode and <C>400</C> in dark, not the <C>500</C>{" "}
      one: a white tick on <C>bg-blue-500</C> is about 3.1:1, which fails the contrast
      bar for a graphic that carries meaning (:3442-3453). <C>glass</C> is the
      exception — it fills with the <C>500</C> step at 40% alpha and gives the tick a
      drop-shadow instead of trusting the fill behind it (:251-261,:3434-3440).
    </p>
    <p>
      <strong>
        <C>indeterminate</C> is a DOM property, not an attribute.
      </strong>{" "}
      It is set imperatively on mount and on change (:227-245) because React has no
      attribute for it, and <C>aria-checked=&quot;mixed&quot;</C> is written from the
      prop (:292). The browser clears <C>indeterminate</C> the moment you activate the
      box — so if the parent never recomputes it, the dash disappears from the screen
      while a reader is still told &ldquo;mixed&rdquo;. That is the trap the{" "}
      <em>Select all</em> example exists to demonstrate.
    </p>
    <p>
      <strong>Two names that do not mean what they say.</strong>{" "}
      <C>inputClassName</C> is applied to the visible box, not to the input (:89,:320)
      — type something in and watch where the ring lands. And a disabled box keeps
      whatever fill its state has: a <C>peer-disabled:bg-neutral-100</C> once won a
      same-specificity fight against the checked fill and made a disabled{" "}
      <em>checked</em> box lose its white tick (:314-319). <C>disabled</C> also puts
      the real attribute on the input (:293) and dims the row (:415), while{" "}
      <C>validationStatus=&quot;error&quot;</C> replaces the variant&rsquo;s border
      outright rather than layering over it (:305-310).
    </p>
    <p>
      <C>fullWidth</C> grows the label block, not just the wrapper (:364-372): a label
      that lays itself out — pills pinned to the trailing edge with{" "}
      <C>margin-inline-start: auto</C> — spends free space, and a shrink-wrapped
      column has none to spend. Try it with <C>controlAlign=&quot;right&quot;</C> to
      see the box travel to the far edge (:412).
    </p>
  </>
);

export const CheckboxPlayground: React.FC = () => {
  const playground = usePlayground(checkboxConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={checkboxCode}
      filename="CheckboxDemo.tsx"
      hint={<CheckboxHint state={playground.state} />}
    />
  );
};

export default CheckboxPlayground;
