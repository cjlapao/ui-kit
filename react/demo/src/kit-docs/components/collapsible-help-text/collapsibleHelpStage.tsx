import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The fixtures the Collapsible Help Text playground shares.
 *
 * The two paragraphs are the whole demo: `CollapsibleHelpText` decides whether a
 * toggle exists at all by counting characters against `maxLength` (:277), so the
 * playground has to know the real lengths to know whether the trigger it is
 * showing — and every prop that hangs off it — is real.
 */

/** 75 characters: truncated only if the slider drops below that. */
export const SHORT_COPY =
  "We encrypt your API tokens client-side using the session keys you set here.";

/** 239 characters: truncated under the default `maxLength` of 160. */
export const LONG_COPY =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field.";

export const TITLE_TEXT = "Why we ask for reviews";

/**
 * The copy `children` becomes. Not gated by the toggle: `children` is rendered
 * outside the collapsed branch (:234-244), so it is visible whether or not the
 * summary is open — which is the one thing about this component a reader is most
 * likely to assume backwards.
 */
export const CHILDREN_TEXT =
  "Extra content passed as children — always visible, whether or not the summary is expanded.";

/** Printed as the `renderMarkdown` const; it receives the *truncated* text. */
export const RENDER_MARKDOWN_BODY =
  "(text: string) => <p className=\"text-sm leading-6\">{text}</p>";

/**
 * The function behind that printed source. They are the same renderer — the
 * Code view may not describe a nicer preview than the one on screen — so change
 * the two together.
 */
export const renderMarkdownFixture = (text: string) => (
  <p className="text-sm leading-6">{text}</p>
);

/** The component's own `maxLength` (CollapsibleHelpText.tsx:254). */
export const DEFAULT_MAX_LENGTH = 160;

export const copyFor = (state: PlaygroundState): string =>
  (state.copy ?? "long") === "long" ? LONG_COPY : SHORT_COPY;

/** `needsTruncation` as the component computes it (:276-277). */
export const isTruncated = (state: PlaygroundState): boolean =>
  copyFor(state).trim().length > Number(state.maxLength ?? DEFAULT_MAX_LENGTH);

/** `plain` renders no `Panel` at all (:305-311), so nothing surface-related applies. */
export const hasCard = (state: PlaygroundState): boolean =>
  (state.variant ?? "card") !== "plain";

/** The variants `Panel` gives a specular highlight to (Panel.tsx:1431). */
const SPECULAR_VARIANTS = ["glass", "liquid-glass", "default"];
export const hasSpecular = (state: PlaygroundState): boolean => {
  const variant = String(state.variant ?? "card");
  return SPECULAR_VARIANTS.includes(variant === "card" ? "outlined" : variant);
};

/** `vibrancy`/`glassOpacity` are read by the `liquid-glass` branch alone. */
export const isLiquid = (state: PlaygroundState): boolean =>
  String(state.variant ?? "card") === "liquid-glass";

/** An absent colour — `""` is the control's "no prop", not a hue. */
export const defined = (value: unknown): string | undefined => {
  const text = typeof value === "string" ? value : "";
  return text === "" || text === "auto" ? undefined : text;
};
