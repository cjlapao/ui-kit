import React from "react";
import { Toggle } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
  ToggleAlign,
  ToggleDescriptionPlacement,
  TogglePadding,
  ToggleSize,
  ToggleVariant,
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
import {
  hostStateLines,
  stageCaption,
  toggleConfig,
} from "./togglePlayground";
import {
  ALIGN_DEFAULT,
  GLASS_OPACITY_DEFAULT,
  PADDING_DEFAULT,
  PLACEMENT_DEFAULT,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT,
  STAGE_CLASS,
  TONE_DEFAULT,
  TOOLTIP_POSITION_DEFAULT,
  VARIANT_DEFAULT,
  VIBRANCY_DEFAULT,
  changeReport,
  flag,
  hasDescription,
  iconOf,
  isControlled,
  textValue,
  usesLegacyColor,
} from "./toggleStage";

/**
 * The engine-driven playground for one `Toggle`. The tag the Code view prints and the
 * tag that paints come from the same config, so the only difference between the two
 * panes is that one of them is alive.
 */

/**
 * A knob left at the component's own default is not passed at all: the destructured
 * default (:194-215) has to earn its keep in front of the reader.
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

/** The same question for a boolean, whose kit default is `false` (:206-215). */
const on = (state: PlaygroundState, id: string): true | undefined =>
  flag(state, id) ? true : undefined;

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const legacy = usesLegacyColor(state);
  const tone = textValue(state, "tone") || TONE_DEFAULT;
  const painted = tone === TONE_DEFAULT ? undefined : (tone as TrueColor);
  const controlled = isControlled(state);
  const reported = changeReport(state);

  // `defaultChecked` and `checked` are decided at mount (:333), so changing one of
  // them has to remount the switch — otherwise the DOM node keeps the state it was
  // created with and the knob looks broken.
  const mount = `${controlled ? "controlled" : "free"}:${
    flag(state, "defaultChecked") ? "on" : "off"
  }`;

  const toggle = (
    <Toggle
      key={mount}
      variant={atDefault<ToggleVariant>(state, "variant", VARIANT_DEFAULT)}
      size={atDefault<ToggleSize>(state, "size", SIZE_DEFAULT)}
      padding={atDefault<TogglePadding>(state, "padding", PADDING_DEFAULT)}
      alignLabel={atDefault<ToggleAlign>(state, "alignLabel", ALIGN_DEFAULT)}
      descriptionPlacement={atDefault<ToggleDescriptionPlacement>(
        state,
        "descriptionPlacement",
        PLACEMENT_DEFAULT,
      )}
      tooltipPosition={atDefault<TooltipPosition>(
        state,
        "tooltipPosition",
        TOOLTIP_POSITION_DEFAULT,
      )}
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
      tone={legacy ? undefined : painted}
      color={legacy ? painted : undefined}
      label={textValue(state, "label") || undefined}
      description={
        hasDescription(state) ? textValue(state, "description") : undefined
      }
      iconOn={iconOf(state, "iconOn")}
      iconOff={iconOf(state, "iconOff")}
      tooltip={textValue(state, "tooltip") || undefined}
      fullWidth={on(state, "fullWidth")}
      disabled={on(state, "disabled")}
      readOnly={on(state, "readOnly")}
      glass={on(state, "glass")}
      defaultChecked={
        !controlled && flag(state, "defaultChecked") ? true : undefined
      }
      checked={controlled ? reported === "true" : undefined}
      onChange={(event) => set("report", String(event.target.checked))}
    />
  );

  return (
    <div className={STAGE_CLASS}>
      {toggle}
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {stageCaption(state)}
      </p>
      {controlled ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          <C>isOn</C> is {reported === "true" ? "true" : "false"} — the input carries{" "}
          <C>checked</C>, so the thumb only moves when your own state does (:333).
        </p>
      ) : null}
    </div>
  );
};

export const toggleCode = ({ state, h }: PlaygroundCodeContext): string => {
  const root = h.element("Toggle", [...h.props()], 1);
  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ].join("\n");

  const snippet = h.snippet({ imports: ["Toggle"], decls: [], body: demo });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

const ToggleHint: React.FC = () => (
  <>
    <p>
      <strong>The row is a hit area, not a second control.</strong> There is one
      interactive element here: an <C>sr-only</C> checkbox (:312-324). The row around it
      carries a click handler with the a11y lint switched off (:271-309) because the
      keyboard already lives on the input. It deliberately ignores the clicks the browser
      has already handled — the input itself and the <C>&lt;label htmlFor&gt;</C>{" "}
      (:301) — and otherwise calls <C>input.click()</C> (:308) rather than fabricating a
      change event, so an uncontrolled thumb really moves (:303-307).
    </p>
    <p>
      <strong>Two props still spell one decision.</strong> The colour is <C>tone</C>;{" "}
      <C>color</C> is the deprecated spelling, and <C>tone</C> wins when both are present
      (:75,:251) — flip <em>Use the deprecated</em> <C>color</C> and the snippet switches
      to the old name, which is the only way to see what you are being asked to stop
      writing. <C>glass</C> (:91) is the same shape of thing for{" "}
      <C>variant=&quot;glass&quot;</C> (:247), and the three glass knobs are inert until
      one of those two is set (:262-265).
    </p>
    <p>
      <strong>What a screen reader gets.</strong>{" "}
      <C>role=&quot;switch&quot;</C> on the checkbox (:316) makes the checked state an
      announced state rather than a picture; the name comes from the{" "}
      <C>&lt;label htmlFor&gt;</C> (:394-410) and the description is wired with{" "}
      <C>aria-describedby</C> (:229,:325). Clear the label and nothing is left to read,
      which is what the dev-only warning at :221-225 is for.
    </p>
    <p>
      <strong>Two ways to say &ldquo;don&rsquo;t touch this&rdquo;.</strong>{" "}
      <C>disabled</C> puts the real attribute on the input (:326): unfocusable, skipped
      by the form. <C>readOnly</C> keeps it focusable and still submitted, and instead
      cancels the row click (:292-294) and the input&rsquo;s own (:328-332) — the cursor
      is the only thing that changes (:282-283).
    </p>
    <p>
      <strong>Two of these props are decided at mount.</strong> <C>defaultChecked</C>{" "}
      seeds the browser&rsquo;s own state and <C>checked</C> takes it over (:333) — the
      playground therefore remounts the switch when either changes, which is the only
      honest way to watch a seed take effect.
    </p>
  </>
);

export const TogglePlayground: React.FC = () => {
  const playground = usePlayground(toggleConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={toggleCode}
      filename="ToggleDemo.tsx"
      hint={<ToggleHint />}
    />
  );
};

export default TogglePlayground;
