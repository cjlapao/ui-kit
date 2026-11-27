import React from "react";
import { I18nProvider, Panel, Pill } from "@cjlapao/ui-kit";
import type { MessageCatalog } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PillCorner,
  PillSize,
  PillTone,
  PillVariant,
  SpecularMode,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import { pillConfig, pillCode } from "./pillPlayground";
import {
  STAGE_CLASS,
  CORNER_DEFAULT,
  GLASS_OPACITY_DEFAULT,
  ICON_NONE,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT_CHOICE,
  TONE_DEFAULT,
  VIBRANCY_DEFAULT,
  VARIANT_DEFAULT,
  choiceValue,
  dotCaption,
  dotLabel,
  elementCaption,
  flag,
  glassCaption,
  hasDotLabel,
  hasRemoveLabel,
  iconName,
  isClickable,
  isDot,
  isGlass,
  isRemovable,
  isTranslated,
  labelText,
  localeCaption,
  localeValue,
  maxWidthValue,
  onBackdrop,
  pulseCaption,
  removeCaption,
  removeLabelValue,
  showsIcon,
  showsTrailingIcon,
  sizeCaption,
  specularChoice,
  trailingIconName,
  truncateCaption,
  toneCaption,
} from "./pillStage";

/**
 * The engine-driven playground for one `Pill`. The tag the Code view prints and
 * the tag that paints come from the same config, including the `<I18nProvider>`
 * the preview is genuinely inside when a locale is chosen — printed, never
 * quietly added.
 */

/** A knob left at the component's own default is not passed at all (:127-149). */
const atDefault = <T extends string | number>(
  state: PlaygroundState,
  id: string,
  documented: T,
): T | undefined => {
  const raw = state[id];
  if (typeof raw !== "string" && typeof raw !== "number") return undefined;
  return String(raw) === String(documented) ? undefined : (raw as unknown as T);
};

/** `{}` is a valid answer: the kit's own catalogs still apply (I18nContext:46-47). */
const NO_USER_CATALOGS: Record<string, MessageCatalog> = {};

const on = (state: PlaygroundState, id: string): true | undefined =>
  flag(state, id) ? true : undefined;

/** The workbench backdrop: something for a glass pill to actually see through. */
const BACKDROP_CLASS =
  "flex w-full items-center justify-center rounded-xl bg-[linear-gradient(120deg,#0ea5e9,#8b5cf6_45%,#f59e0b)] px-6 py-8";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
    {children}
  </p>
);

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const glass = isGlass(state);
  const specular = specularChoice(state);

  const pill = (
    <Pill
      variant={atDefault<PillVariant>(state, "variant", VARIANT_DEFAULT as PillVariant)}
      tone={atDefault<PillTone>(state, "tone", TONE_DEFAULT as PillTone)}
      size={atDefault<PillSize>(state, "size", SIZE_DEFAULT as PillSize)}
      corner={atDefault<PillCorner>(state, "corner", CORNER_DEFAULT as PillCorner)}
      uppercase={on(state, "uppercase")}
      icon={showsIcon(state) ? iconName(state) : undefined}
      trailingIcon={showsTrailingIcon(state) ? trailingIconName(state) : undefined}
      maxWidth={maxWidthValue(state)}
      dot={on(state, "dot")}
      label={hasDotLabel(state) ? dotLabel(state) : undefined}
      pulse={on(state, "pulse")}
      disabled={on(state, "disabled")}
      removeLabel={hasRemoveLabel(state) ? removeLabelValue(state) : undefined}
      glassOpacity={
        glass
          ? atDefault<GlassOpacity>(
              state,
              "glassOpacity",
              GLASS_OPACITY_DEFAULT as GlassOpacity,
            )
          : undefined
      }
      vibrancy={
        glass
          ? atDefault<GlassVibrancy>(state, "vibrancy", VIBRANCY_DEFAULT as GlassVibrancy)
          : undefined
      }
      specularMode={
        glass && specular !== SPECULAR_DEFAULT_CHOICE
          ? (specular as SpecularMode)
          : undefined
      }
      onClick={
        isClickable(state)
          ? () => set("clickReport", "onClick fired — the pill is a real button")
          : undefined
      }
      onRemove={
        isRemovable(state)
          ? () =>
              set(
                "removeReport",
                "onRemove fired; the remove click did not reach onClick",
              )
          : undefined
      }
    >
      {isDot(state) ? undefined : labelText(state)}
    </Pill>
  );

  const shown = isTranslated(state) ? (
    <I18nProvider
      locale={localeValue(state)}
      locales={NO_USER_CATALOGS}
      detect={false}
      storageKey={null}
      updateDocument={false}
    >
      {pill}
    </I18nProvider>
  ) : (
    pill
  );

  const captions = [
    elementCaption(state),
    toneCaption(state),
    glassCaption(state),
    sizeCaption(state),
    dotCaption(state),
    pulseCaption(state),
    removeCaption(state),
    truncateCaption(state),
    localeCaption(state),
  ].filter((line) => line !== "");

  const clickReport = typeof state.clickReport === "string" ? state.clickReport : "";
  const removeReport = typeof state.removeReport === "string" ? state.removeReport : "";

  return (
    <div className={STAGE_CLASS}>
      {onBackdrop(state) ? (
        <div className={BACKDROP_CLASS}>{shown}</div>
      ) : (
        <Panel variant="elevated" padding="md" className="w-full">
          {shown}
        </Panel>
      )}
      {clickReport !== "" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400" data-report="click">
          {clickReport} (:300-304)
        </p>
      )}
      {removeReport !== "" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400" data-report="remove">
          {removeReport} (:263-267)
        </p>
      )}
      {captions.map((line) => (
        <Caption key={line}>{line}</Caption>
      ))}
    </div>
  );
};

export const PillHint: React.FC<{ state: PlaygroundState }> = ({ state }) => (
  <>
    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
      The two toggles that change what this element <em>is</em>, not how it looks:{" "}
      <C>onClick</C> swaps the <C>&lt;span&gt;</C> for a real{" "}
      <C>&lt;button type=&quot;button&quot;&gt;</C> with a focus ring (:300-316), and{" "}
      <C>onRemove</C> nests a second focusable button inside it (:259-273). Everything
      else — <C>tone</C>, <C>variant</C>, <C>corner</C> — is paint.
    </p>
    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
      Hover is not decoration here: the tone&rsquo;s hover classes are applied only when{" "}
      <C>onClick</C> is set (:156-159,:283), because for a pill the hover{" "}
      <em>is</em> the affordance (Theme.ts:2912-2914). And{" "}
      <C>specularMode</C> has no single default — <C>liquid-glass</C> resolves to{" "}
      <C>classic</C>, <C>glass</C> to <C>none</C> (:197-198), which is the only
      difference between the two variants. Leave it on &ldquo;Variant default&rdquo; to
      see who wins.
    </p>
    {isRemovable(state) && !isDot(state) && (
      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
        {hasRemoveLabel(state) ? (
          <>
            The remove button is answering to <C>removeLabel</C>=
            &ldquo;{removeLabelValue(state)}&rdquo; (:268). Clear it and the kit&rsquo;s
            own catalog string takes over — switch the preview locale to watch it move.
          </>
        ) : (
          <>
            The remove button is named by the kit catalog (:268), so it follows the
            preview locale; type a <C>removeLabel</C> and the catalog stops being asked.
          </>
        )}
      </p>
    )}
    {choiceValue(state, "icon", ICON_NONE) !== ICON_NONE && !isDot(state) && (
      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
        An adornment given as a string is a registry lookup, not markup: it goes through
        the icon renderer at the size the pill&rsquo;s <C>size</C> implies (:210-215).
      </p>
    )}
  </>
);

export const PillPlayground: React.FC = () => {
  const playground = usePlayground(pillConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={pillCode}
      filename="PillDemo.tsx"
      hint={(state) => <PillHint state={state} />}
    />
  );
};

export default PillPlayground;
