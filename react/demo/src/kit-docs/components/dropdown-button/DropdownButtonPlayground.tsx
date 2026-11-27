import React from "react";
import { DropdownButton, I18nProvider, Panel } from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  ButtonVariant,
  DropdownButtonOption,
  MessageCatalog,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type { PlaygroundPreviewProps } from "../../shared/playground/schema";
import { C, Kbd } from "../../shared/A11ySections";
import {
  caretGlyphNote,
  dropdownButtonCode,
  dropdownButtonConfig,
} from "./dropdownButtonPlayground";
import {
  DROPDOWN_ICON_DEFAULT,
  SIZE_DEFAULT,
  STAGE_CLASS,
  VARIANT_DEFAULT,
  caretCaption,
  caretLabelValue,
  choiceValue,
  colorName,
  elementCaption,
  fixtureChoice,
  hasItems,
  isDisabled,
  isFullWidth,
  isSized,
  isLoading,
  isSplit,
  isTranslated,
  keepsEmptyCaret,
  labelValue,
  loadingCaption,
  localeCaption,
  localeValue,
  maxWidthValue,
  menuCaption,
  sizeName,
  tooltipValue,
  variantName,
  widthCaption,
  widthValue,
} from "./dropdownButtonStage";

/**
 * The stage. A dropdown is two buttons and a portal, so the only honest preview
 * is the real component with real handlers: whatever the reader sees is what the
 * config asked for, and the Code view prints the same state.
 */

/** The user supplies no messages: the point is the kit's own catalog (:83,:155). */
const NO_USER_CATALOGS: Record<string, MessageCatalog> = {};

/**
 * Hand the component `undefined` rather than the value it already defaults to
 * (:62-82), so the preview exercises the component's own default instead of a
 * playground's opinion of it.
 */
const atDefault = <T extends string>(
  raw: string,
  documented: string,
): T | undefined => (raw === documented ? undefined : (raw as T));

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data, set }) => {
  const items = (data.menu as DropdownButtonOption[] | undefined) ?? [];
  const glyph = choiceValue(state, "dropdownIcon", DROPDOWN_ICON_DEFAULT);
  const clickReport =
    typeof state.clickReport === "string" ? state.clickReport : "";
  const pickReport = typeof state.pickReport === "string" ? state.pickReport : "";

  const control = (
    <DropdownButton
      label={labelValue(state)}
      options={items}
      variant={atDefault<Exclude<ButtonVariant, "clear">>(
        variantName(state),
        VARIANT_DEFAULT,
      )}
      color={colorName(state) as TrueColor}
      size={atDefault<ButtonSize>(sizeName(state), SIZE_DEFAULT)}
      dropdownIcon={glyph === DROPDOWN_ICON_DEFAULT ? undefined : glyph}
      caretLabel={caretLabelValue(state) || undefined}
      split={isSplit(state) ? undefined : false}
      fullWidth={isFullWidth(state) ? true : undefined}
      disabled={isDisabled(state) ? true : undefined}
      loading={isLoading(state) ? true : undefined}
      width={widthValue(state)}
      maxWidth={maxWidthValue(state)}
      hideDropdownTriggerWhenEmpty={
        keepsEmptyCaret(state) ? false : undefined
      }
      tooltip={tooltipValue(state) || undefined}
      menuWidth={
        choiceValue(state, "menuWidth", "220") === "trigger"
          ? "trigger"
          : Number(choiceValue(state, "menuWidth", "220"))
      }
      onPrimaryClick={
        state.onPrimaryClick === true
          ? () => set("clickReport", "the primary action fired")
          : undefined
      }
      onOptionSelect={
        state.onOptionSelect === true && hasItems(state)
          ? (option) =>
              set("pickReport", `picked “${String(option.label)}” (${option.value})`)
          : undefined
      }
    />
  );

  const body = (
    <Panel variant="elevated" padding="md">
      {control}
    </Panel>
  );

  return (
    <div className={STAGE_CLASS}>
      {isTranslated(state) ? (
        <I18nProvider
          locale={localeValue(state)}
          locales={NO_USER_CATALOGS}
          detect={false}
          storageKey={null}
          updateDocument={false}
        >
          {body}
        </I18nProvider>
      ) : (
        body
      )}

      {clickReport !== "" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400" data-report="click">
          {clickReport} (:104-107,:182)
        </p>
      )}
      {pickReport !== "" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400" data-report="pick">
          {pickReport} (:97-100,:211)
        </p>
      )}

      <div className="flex flex-col gap-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
        <p>{elementCaption(state)}</p>
        <p>{caretCaption(state)}</p>
        <p>{menuCaption(state)}</p>
        <p>{widthCaption(state)}</p>
        <p>{loadingCaption(state)}</p>
        <p>{caretGlyphNote(state)}</p>
        <p>{localeCaption(state)}</p>
      </div>
    </div>
  );
};

/** The paragraph the controls column ends with, written for what is on screen now. */
const Hint: React.FC<{ state: PlaygroundPreviewProps["state"] }> = ({ state }) => (
  <p className="text-xs opacity-70">
    The two halves never interfere: the caret calls <C>stopPropagation</C> before it
    toggles, so opening the menu cannot fire the action, and the primary button never
    opens anything (:109-113). What the menu is — <C>role=&quot;menu&quot;</C> of{" "}
    <C>role=&quot;menuitem&quot;</C>s — comes from <C>DropdownMenu</C>, which is teleported
    to <C>document.body</C> and positioned against the caret with <C>align=&quot;end&quot;</C>{" "}
    and <C>side=&quot;auto&quot;</C> hardcoded (:213-214): they are not props here.
    {!hasItems(state) &&
      " With no items the caret is hidden entirely (:117) — flip hideDropdownTriggerWhenEmpty to see the other answer, a caret that stays and is disabled (:166)."}
    {hasItems(state) && fixtureChoice(state) === "flagged" &&
      " The locked item is first on purpose: the menu's roving tabindex then has to start on the second row (Menu:191-192,:498)."}
    {isSized(state)
      ? " The inline width sits on the wrapper, so the caret keeps its room and the label takes the ellipsis (:179,:190,:200)."
      : " Nothing is sized, so a long label widens the control — pin width to watch the truncate chain arrive (:123)."}
    {isLoading(state) &&
      " loading disables the primary button but not the caret: the caret reads the disabled prop, not loading (:166)."}
    {" Press the caret, then walk the open list with "}
    <Kbd>ArrowDown</Kbd>/<Kbd>ArrowUp</Kbd>, <Kbd>Home</Kbd>/<Kbd>End</Kbd>, and close it with{" "}
    <Kbd>Escape</Kbd> — focus goes back to the caret (Menu:159-164,:207-219).
  </p>
);

export const DropdownButtonPlayground: React.FC = () => {
  const playground = usePlayground(dropdownButtonConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={dropdownButtonCode}
      filename="DropdownButtonDemo.tsx"
      hint={(state) => <Hint state={state} />}
    />
  );
};

export { Stage };
export default DropdownButtonPlayground;
