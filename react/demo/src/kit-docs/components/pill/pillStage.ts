import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Everything the Pill playground knows about the component, kept apart from the
 * controls so the config, the stage and the two test files read from one source
 * of truth. Line references are to `react/src/components/Pill.tsx` unless they
 * name another file.
 */

/** The stage's own layout — a test hook as much as a class list. */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";

/** The five variants (:19-25). The two see-through ones are the glass pair (:44-45). */
export const VARIANTS = ["solid", "soft", "outline", "glass", "liquid-glass"] as const;
export const VARIANT_DEFAULT = "soft"; // :79-80,:129
export const SIZE_DEFAULT = "md"; // :81-82,:130
export const CORNER_DEFAULT = "full"; // :83-84,:131
export const TONE_DEFAULT = "blue"; // :128
export const GLASS_OPACITY_DEFAULT = "frosted"; // :86-87,:133
export const VIBRANCY_DEFAULT = "medium"; // :88-89,:134
export const LABEL_DEFAULT = "Operational";

/** 0 means "no `maxWidth` at all" — the prop is `number | string` and optional (:118-119). */
export const MAX_WIDTH_NONE = 0;
export const MAX_WIDTH_EXAMPLE = 140;

/** Registry names the two adornment knobs offer. `none` is the documented absence (:95-98). */
export const ICON_NONE = "none";
export const ICON_OPTIONS = [
  { label: "None", value: ICON_NONE },
  { label: "Check", value: "Check" },
  { label: "Search", value: "Search" },
];
export const TRAILING_ICON_OPTIONS = [
  { label: "None", value: ICON_NONE },
  { label: "ArrowRight", value: "ArrowRight" },
  { label: "ChevronRight", value: "ChevronRight" },
];

/**
 * `specularMode` is optional and its default is per-variant (:90-94,:197-198), so
 * the control needs a fourth entry meaning "say nothing and let the variant decide".
 */
export const SPECULAR_DEFAULT_CHOICE = "default";
export const SPECULAR_OPTIONS = [
  { label: "Variant default", value: SPECULAR_DEFAULT_CHOICE },
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];

/**
 * The locales the kit ships a `pill.remove` string for, with the line that holds
 * each one. `common/i18n/builtIn/*` — the reference catalog is English (:1-6).
 */
export const LOCALES = [
  { label: "English (the kit default)", value: "en", word: "Remove", catalog: "builtIn/en.ts:376-378" },
  { label: "Français", value: "fr", word: "Supprimer", catalog: "builtIn/fr.ts:346-348" },
  { label: "Deutsch", value: "de", word: "Entfernen", catalog: "builtIn/de.ts:344-346" },
  { label: "Español", value: "es", word: "Quitar", catalog: "builtIn/es.ts:343-345" },
  { label: "Português", value: "pt", word: "Remover", catalog: "builtIn/pt.ts:343-345" },
] as const;
export const LOCALE_DEFAULT = "en";
export const REMOVE_LABEL_EXAMPLE = "Remove filter";

// ── Reading the state ────────────────────────────────────────────────────────

export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

export const textValue = (state: PlaygroundState, id: string): string => {
  const raw = state[id];
  return typeof raw === "string" ? raw : "";
};

export const choiceValue = (
  state: PlaygroundState,
  id: string,
  fallback: string,
): string => {
  const raw = state[id];
  return typeof raw === "string" && raw !== "" ? raw : fallback;
};

export const numberValue = (state: PlaygroundState, id: string): number => {
  const raw = state[id];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : MAX_WIDTH_NONE;
};

export const variantName = (state: PlaygroundState): string =>
  choiceValue(state, "variant", VARIANT_DEFAULT);

/** The see-through pair, exactly as the component decides it (:44-45,:154). */
export const isGlass = (state: PlaygroundState): boolean => {
  const variant = variantName(state);
  return variant === "glass" || variant === "liquid-glass";
};

export const isLiquid = (state: PlaygroundState): boolean =>
  variantName(state) === "liquid-glass";

export const sizeName = (state: PlaygroundState): string =>
  choiceValue(state, "size", SIZE_DEFAULT);

export const cornerName = (state: PlaygroundState): string =>
  choiceValue(state, "corner", CORNER_DEFAULT);

export const toneName = (state: PlaygroundState): string =>
  choiceValue(state, "tone", TONE_DEFAULT);

export const labelText = (state: PlaygroundState): string =>
  textValue(state, "labelText") === "" ? LABEL_DEFAULT : textValue(state, "labelText");

export const isDot = (state: PlaygroundState): boolean => flag(state, "dot");

export const dotLabel = (state: PlaygroundState): string =>
  textValue(state, "dotLabel").trim();

export const hasDotLabel = (state: PlaygroundState): boolean => dotLabel(state) !== "";

export const isDisabled = (state: PlaygroundState): boolean => flag(state, "disabled");

/** `pulse` and `disabled` are not equals: the dimmed pill wins (:166). */
export const isPulsing = (state: PlaygroundState): boolean =>
  flag(state, "pulse") && !isDisabled(state);

/** Hover, focus ring and the button element all hang off this one boolean (:159). */
export const isClickable = (state: PlaygroundState): boolean => flag(state, "onClick");

/**
 * Whether a remove button can exist at all. The dot branch returns before any of
 * the content is built, so a dot has no remove button, no adornments, no
 * maxWidth and no onClick however the knobs are set (:218-242).
 */
export const canRemove = (state: PlaygroundState): boolean =>
  flag(state, "onRemove") && !isDot(state);

export const isRemovable = (state: PlaygroundState): boolean => flag(state, "onRemove");

export const removeLabelValue = (state: PlaygroundState): string =>
  textValue(state, "removeLabel").trim();

export const hasRemoveLabel = (state: PlaygroundState): boolean =>
  canRemove(state) && removeLabelValue(state) !== "";

export const iconName = (state: PlaygroundState): string =>
  choiceValue(state, "icon", ICON_NONE);

export const showsIcon = (state: PlaygroundState): boolean =>
  !isDot(state) && iconName(state) !== ICON_NONE;

export const trailingIconName = (state: PlaygroundState): string =>
  choiceValue(state, "trailingIcon", ICON_NONE);

export const showsTrailingIcon = (state: PlaygroundState): boolean =>
  !isDot(state) && trailingIconName(state) !== ICON_NONE;

/** Adornments ride the pill's size, in two steps only (:68-74,:210-215). */
export const adornmentSize = (state: PlaygroundState): "xs" | "sm" =>
  sizeName(state) === "lg" || sizeName(state) === "xl" ? "sm" : "xs";

export const maxWidthValue = (state: PlaygroundState): number | undefined => {
  const width = numberValue(state, "maxWidth");
  return width > MAX_WIDTH_NONE ? width : undefined;
};

export const isTruncating = (state: PlaygroundState): boolean =>
  maxWidthValue(state) !== undefined && !isDot(state);

export const specularChoice = (state: PlaygroundState): string =>
  choiceValue(state, "specularMode", SPECULAR_DEFAULT_CHOICE);

/** The variant's own answer, for when the prop is not passed (:197-198). */
export const specularResolved = (state: PlaygroundState): string =>
  specularChoice(state) === SPECULAR_DEFAULT_CHOICE
    ? isLiquid(state)
      ? "classic"
      : "none"
    : specularChoice(state);

/** `none` buys no element at all: the helper returns null (:199-200 ← glass.ts:280-294). */
export const showsSpecular = (state: PlaygroundState): boolean =>
  isGlass(state) && specularResolved(state) !== "none";

export const localeValue = (state: PlaygroundState): string =>
  choiceValue(state, "locale", LOCALE_DEFAULT);

export const localeEntry = (value: string) =>
  LOCALES.find((entry) => entry.value === value) ?? LOCALES[0];

export const isTranslated = (state: PlaygroundState): boolean =>
  localeValue(state) !== LOCALE_DEFAULT;

export const onBackdrop = (state: PlaygroundState): boolean => flag(state, "backdrop");

// ── What the stage says about what it rendered ───────────────────────────────

/** Which element the component returned, and what that means for the keyboard. */
export const elementCaption = (state: PlaygroundState): string => {
  if (isDot(state)) {
    const named = hasDotLabel(state);
    return `A bare <span>: no children, no button, and the size token deliberately left off rather than cancelled by a second utility (:218-242,:59-66). ${
      named
        ? `label gives it role="img" and that name (:236-237), so it is one thing a reader hears.`
        : `No label, so aria-hidden and nothing in the reading order (:238).`
    } Neither form is focusable — a dot is a status mark, not a control (:223-241).`;
  }
  if (isClickable(state)) {
    return `A real <button type="button"> (:299-316): Tab reaches it, Enter and Space activate it, and the focus ring is focus-visible:ring-2 ring-current (:302,:307) — the tone's own colour, so it reads on solid, soft, outline and glass alike.`;
  }
  return `A <span> (:318-325): a label, not a control. It is absent from the tab order, no key does anything to it, and the tone hover classes are not applied either — hover only answers to onClick (:156-159,:282; Theme.ts:2912-2914).`;
};

/** Why the pill is the colour it is, opaque or see-through. */
export const toneCaption = (state: PlaygroundState): string => {
  const tone = toneName(state);
  if (isGlass(state)) {
    return `"${tone}" paints a glass pill from a different set of helpers: the opaque tone map is dropped entirely because it would paint a solid fill (:174-183), and the tint, the copy colour and the rim come from the glass trio (:185-195). The fill is bg-${tone}-200/65 at frosted, the copy text-${tone}-900 (:191-193 ← glass.ts:98-130,:321-335). The rim stays white (:333) and, with no onClick, so does the hover — getGlassChromeClasses is asked for no interactive chrome at all (:193 ← glass.ts:311-319).`;
  }
  const variant = variantName(state);
  const paint =
    variant === "solid"
      ? `bg-${tone}-500 text-white, answering a click with hover:bg-${tone}-400 dark:hover:bg-${tone}-300 (:2921-2922)`
      : variant === "outline"
        ? `text-${tone}-600 plus a hairline border-${tone}-200, and outline is the only entry in the map carrying a border token — which is why it is the only variant that gets a rim (:229,:281 ← Theme.ts:2929-2931)`
        : `bg-${tone}-50 text-${tone}-700, its hover a translucent bg-${tone}-100 (:2925-2926)`;
  return `"${tone}" on ${variant}: ${paint}. The whole map is one theme-table lookup with a blue fallback, so a tone the theme does not know still paints something (:3715-3719).`;
};

/** Blur, saturation and the highlight — the three things only the glass pair gets. */
export const glassCaption = (state: PlaygroundState): string => {
  if (!isGlass(state)) return "";
  const blur = isLiquid(state) ? "backdrop-blur-md" : "backdrop-blur-sm";
  const lines = [
    `${variantName(state)} blurs what is behind it at ${blur} (:190) and saturates it at backdrop-saturate-[1.2] for the medium preset (:192 ← glass.ts:223-233).`,
  ];
  if (specularChoice(state) === SPECULAR_DEFAULT_CHOICE) {
    lines.push(
      `specularMode was left alone, so the variant answers: liquid-glass resolves to classic, glass to none (:197-198) — that resolved default is the entire difference between the two variants.`,
    );
  } else {
    lines.push(
      `specularMode is asked for explicitly as "${specularResolved(
        state,
      )}", so it overrides the variant's own answer (:197-198).`,
    );
  }
  lines.push(
    showsSpecular(state)
      ? `The highlight is one aria-hidden overlay filling the pill, never a second thing in the reading order (:200-208).`
      : `With the highlight resolved to none the helper returns null, so no overlay element exists at all (:199-200 ← glass.ts:280-283).`,
  );
  if (!onBackdrop(state)) {
    lines.push(
      `There is nothing behind this pill to see through — on a plain page background glass reads as a pale soft pill. Turn on the backdrop to see the blur and the saturation do anything.`,
    );
  }
  return lines.join(" ");
};

export const pulseCaption = (state: PlaygroundState): string => {
  if (!flag(state, "pulse")) return "";
  if (isDisabled(state)) {
    return `pulse is set and the pulse class is not on the element: pulsing is pulse && !disabled (:166), and an attention call on a pill the app itself has dimmed is a contradiction (:161-166).`;
  }
  return `The glow rides in as two custom properties — --pill-glow in the tone's -500, its dark-theme partner at -300 (:167-172) — so the keyframes stay colour-agnostic and a new tone needs no CSS of its own. It is an inset shadow, which is why a dense row needs no padding to survive it (:105-106), and reduced-motion readers get a static inner glow instead of the animation (:107-108).`;
};

export const removeCaption = (state: PlaygroundState): string => {
  if (!isRemovable(state) || isDot(state)) return "";
  const lines = [
    `The remove button is a second, nested focus stop inside the pill (:259-273): its click calls stopPropagation first, so removing a tag never also activates it (:263-267) — without that line a removable filter pill would delete the filter and fire its own click in one press.`,
  ];
  lines.push(
    hasRemoveLabel(state)
      ? `Its accessible name is the removeLabel you gave, "${removeLabelValue(
        state,
      )}" (:268) — the catalog string is only a fallback.`
      : `Its accessible name is removeLabel ?? t("kit.pill.remove") (:268) — the remove button is never the unnamed button a reader hears and cannot act on.`,
  );
  if (isDisabled(state)) {
    lines.push(`disabled takes it out of the tab order as a real disabled attribute (:262), not just a dimmed look.`);
  }
  return lines.join(" ");
};

export const dotCaption = (state: PlaygroundState): string => {
  if (!isDot(state)) return "";
  const dropped = [
    labelText(state) !== "" ? "children" : "",
    showsIcon(state) ? "icon" : "",
    showsTrailingIcon(state) ? "trailingIcon" : "",
    isRemovable(state) ? "onRemove" : "",
  ].filter(Boolean);
  return dropped.length === 0
    ? `The dot is 10px of circle at md — its own ladder, matching Badge's dot so the two line up in a mixed row (:59-66,:227).`
    : `dot wins: ${dropped.join(
        ", ",
      )} ${dropped.length === 1 ? "is" : "are"} set and all dropped, which is what keeps it a dot (:99-103,:218-242). Its size comes from DOT_STYLES, not SIZE_STYLES (:227,:59-66).`;
};

export const sizeCaption = (state: PlaygroundState): string => {
  const px: Record<string, string> = {
    xs: "16px tall at 11px text",
    sm: "20px at 12px",
    md: "24px at 12px (text-xs)",
    lg: "28px at 14px",
    xl: "32px at 14px",
  };
  const adornment = showsIcon(state) || showsTrailingIcon(state);
  return `size "${sizeName(state)}" is ${px[sizeName(state)] ?? "?"} with the padding that goes with it (:51-57).${
    adornment
      ? ` The adornment is sized by ICON_SIZE, which collapses the five steps to two — ${adornmentSize(
          state,
        )} here (:68-74,:214).`
      : ""
  }`;
};

export const truncateCaption = (state: PlaygroundState): string => {
  const width = maxWidthValue(state);
  if (width === undefined || isDot(state)) return "";
  return `maxWidth={${width}} does two jobs: truncate on the label span (:251) and style.maxWidth on the element, a bare number becoming px (:291-297). The full text is now clipped, and Pill has no title prop of its own to hand it back with — title arrives through the spread (:77,:321), so ask for it.`;
};

/** The one string the component owns, and whether the provider is translating it. */
export const localeCaption = (state: PlaygroundState): string => {
  const entry = localeEntry(localeValue(state));
  if (!isRemovable(state) || isDot(state)) {
    return `The locale is set to "${entry.value}", but the only string the pill translates is the remove button's accessible name (:268) — turn on Remove to see it move.`;
  }
  if (hasRemoveLabel(state)) {
    return `removeLabel wins over the catalog (:268), so at locale "${entry.value}" the button is still named "${removeLabelValue(
      state,
      )}" — a caller can always step outside i18n.`;
  }
  return `At locale "${entry.value}" the remove button's name is "${entry.word}" (:268 ← ${entry.catalog}). Nothing else in the pill is translated: the label, the dot's name and the icons are the caller's text (:244-253,:236-237), and useKitT falls back to the built-in English catalog rather than warning when there is no provider at all (I18nContext.tsx:119-135).`;
};
