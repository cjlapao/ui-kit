import {
  alertIntentOptions,
  alertVariantOptions,
  controlSizeOptions,
  toastModeOptions,
  toastPositionOptions,
  trueColorOptions,
} from "../../shared/options";
import type {
  PlaygroundCodeContext,
  PlaygroundConfig,
} from "../../shared/playground/schema";

/**
 * Toast's playground as data: the option list, the fixture, and the template
 * that prints them.
 *
 * Toast is the awkward shape the engine has to cover — it is not one element.
 * A message is raised imperatively through `useToast().show({...})` and lands
 * in a `ToastViewport` mounted elsewhere, so the fields split into two
 * `set`s: the message's, and the viewport's. `toastCode` prints both from the
 * same state, which is the only way the snippet can be trusted to describe the
 * deck on screen.
 *
 * Every `default` is the component's own, read from `Toast/types.ts` and
 * `Toast/ToastViewport.tsx` — `neutral`, `top-right`, `18.75rem`. The playground
 * opens wearing the kit's defaults and the Code view opens minimal; a line
 * appears when the reader moves something. The two content fields are the
 * exception: a card with no text is not a preview, so they carry sample copy
 * against a documented default of "absent" and print from the start.
 */

/** The routing key the deck and its viewport share. */
export const TOAST_PLAYGROUND_GROUP = "toast-playground";

/** What the snippet calls it: an identifier, not the tag itself. */
const GROUP_CONST = "GROUP";

/** Fields that configure the `<ToastViewport>`, not the message. */
export const VIEWPORT_SET = "viewport";

/** Demo presets for the auto-dismiss window. */
const LIFE_OPTIONS: { label: string; value: string }[] = [
  { label: "5 s (default)", value: "5000" },
  { label: "2 s", value: "2000" },
  { label: "10 s", value: "10000" },
  { label: "Sticky", value: "0" },
];

/**
 * Deck widths, in CSS `width` values — the geometry axis.
 *
 * Width is its own lever on purpose. `Size` is the type-and-padding scale: it
 * moves the title, the detail, the glyph and the card's height together, so
 * "wider" is not something it can say. The viewport's `width` sets the column
 * the cards fill (every card is `width: 100%` of it), which is what a deck of
 * long details actually needs.
 */
const WIDTH_OPTIONS: { label: string; value: string }[] = [
  { label: "18.75rem (kit default)", value: "18.75rem" },
  { label: "22.5rem (360px)", value: "22.5rem" },
  { label: "26rem", value: "26rem" },
  { label: "30rem", value: "30rem" },
  { label: "Fill the corner (92vw, ≤34rem)", value: "min(92vw, 34rem)" },
];

/** The progress the playground raises a card with, 0..100. */
export const PLAYGROUND_PROGRESS = 62;

export const toastConfig: PlaygroundConfig = {
  groups: [
    { id: "core", title: "Core" },
    { id: "tone", title: "Tone" },
    { id: "behavior", title: "Behavior" },
    { id: "content", title: "Content" },
  ],
  fields: [
    {
      kind: "choice",
      id: "intent",
      label: "Intent",
      group: "core",
      options: alertIntentOptions,
      default: "neutral",
    },
    {
      kind: "choice",
      id: "variant",
      label: "Variant",
      group: "core",
      options: alertVariantOptions,
      default: "glass",
      control: "select",
    },
    {
      kind: "choice",
      id: "size",
      label: "Size",
      group: "core",
      options: controlSizeOptions,
      default: "md",
      control: "segments",
    },
    {
      kind: "choice",
      id: "mode",
      label: "Mode",
      group: "core",
      options: toastModeOptions,
      default: "stacked",
      control: "select",
      set: VIEWPORT_SET,
    },
    {
      kind: "choice",
      id: "position",
      label: "Position",
      group: "core",
      options: toastPositionOptions,
      default: "top-right",
      control: "select",
      set: VIEWPORT_SET,
    },
    {
      kind: "choice",
      id: "width",
      label: "Width",
      group: "core",
      options: WIDTH_OPTIONS,
      // `18.75rem` is the kit's own default, so the Code view prints nothing
      // here until the reader widens the column.
      default: "18.75rem",
      control: "select",
      set: VIEWPORT_SET,
    },
    {
      kind: "toggle",
      id: "overrideTone",
      label: "Override the intent's tone",
      group: "tone",
      default: false,
      // A playground convenience that gates the picker below it; the message
      // only ever carries `color`, so this never reaches the code.
      prop: null,
    },
    {
      kind: "choice",
      id: "color",
      label: "Colour",
      group: "tone",
      options: trueColorOptions,
      default: "emerald",
      control: "select",
      when: (state) => state.overrideTone === true,
      // There is no documented default to compare against — `color`'s default
      // is "the intent's tone" — and a tone you chose is never a line worth
      // leaving out.
      alwaysEmit: true,
    },
    {
      kind: "choice",
      id: "life",
      label: "Auto-dismiss",
      group: "behavior",
      options: LIFE_OPTIONS,
      default: "5000",
      control: "select",
      prop: null,
      // One control, two different props: the kit expresses "no timer" as
      // `sticky: true` (or `life: 0`), and prints neither when the timer is
      // simply the default.
      emit: (value) => {
        if (value === "0") return "sticky: true";
        if (value === "5000") return null;
        return `life: ${value}`;
      },
    },
    {
      kind: "toggle",
      id: "icon",
      label: "Intent glyph",
      group: "behavior",
      default: true,
      // Only off is worth printing: on is the card doing what the intent
      // already says.
      emit: (value) => (value ? null : "icon: false"),
    },
    {
      kind: "toggle",
      id: "closable",
      label: "Closable",
      group: "behavior",
      default: true,
    },
    {
      kind: "toggle",
      id: "loading",
      label: "Loading",
      group: "behavior",
      default: false,
    },
    {
      kind: "toggle",
      id: "withProgress",
      label: "Progress",
      group: "behavior",
      default: false,
      prop: null,
      emit: (value) => (value ? `progress: ${PLAYGROUND_PROGRESS}` : null),
    },
    {
      kind: "toggle",
      id: "withActions",
      label: "Actions",
      group: "behavior",
      default: false,
      // The action row is the `actions` data source; it prints itself.
      prop: null,
    },
    {
      kind: "toggle",
      id: "withGroup",
      label: "Routed by group",
      group: "behavior",
      default: true,
      // The message and the viewport must say the same thing or the card lands
      // nowhere, so one control drives both sides (see `toastCode`).
      prop: null,
      emit: (value) => (value ? `group: ${GROUP_CONST}` : null),
    },
    {
      kind: "text",
      id: "title",
      label: "Title",
      group: "content",
      default: "Build 482 shipped",
      docDefault: "",
    },
    {
      kind: "text",
      id: "detail",
      label: "Detail",
      group: "content",
      default: "All 12 services are healthy.",
      multiline: true,
      docDefault: "",
    },
  ],
  data: [
    {
      id: "actions",
      label: "Action row",
      note:
        "trigger-family buttons in the card footer; their clicks do not fire the card's own onClick",
      prop: null,
      hoist: false,
      emit: "source",
      value: () => [{ label: "Acknowledge" }],
      // Printed where it is used — inside the `show` call, where `toast` and
      // `id` are in scope. A hoisted const could not name either.
      source: () =>
        '[\n  { label: "Acknowledge", onClick: () => toast.close(id) },\n]',
    },
  ],
};

/**
 * The runnable block: provider, the hook call that raises the card, and the
 * viewport that pins the deck to its corner — the three pieces a reader needs
 * to reproduce what the playground is showing.
 */
export const toastCode = ({ state, h }: PlaygroundCodeContext): string => {
  const grouped = state.withGroup === true;
  const entries = h.payload();
  if (state.withActions) entries.push(`actions: ${h.source("actions")}`);
  // The tag is what ties the message to the deck below, so it reads first.
  const tagged = `group: ${GROUP_CONST}`;
  const at = entries.indexOf(tagged);
  if (at > 0) entries.unshift(...entries.splice(at, 1));

  const raise = state.withActions
    ? `const id = toast.show(${h.object(entries)});`
    : `toast.show(${h.object(entries)});`;

  const viewport = h.element(
    "ToastViewport",
    [
      // Both sides or neither: a grouped message never reaches an ungrouped
      // viewport, which is the one way this snippet could look right and fail.
      ...(grouped ? [`group={${GROUP_CONST}}`] : []),
      ...h.props({ set: VIEWPORT_SET }),
    ],
    6,
  );

  const body = [
    "function Corner() {",
    "  const { toast } = useToast();",
    "",
    "  const show = () => {",
    h.indent(raise, 4),
    "  };",
    "",
    "  return (",
    "    <>",
    '      <Button color="blue" onClick={show}>',
    "        Show toast",
    "      </Button>",
    h.indent(viewport, 6),
    "    </>",
    "  );",
    "}",
    "",
    "export default function Demo() {",
    "  return (",
    "    <ToastProvider>",
    "      <Corner />",
    "    </ToastProvider>",
    "  );",
    "}",
  ].join("\n");

  return h.snippet({
    imports: ["Button", "ToastProvider", "ToastViewport", "useToast"],
    decls: grouped
      ? [
          h.const(GROUP_CONST, {
            value: TOAST_PLAYGROUND_GROUP,
            note: "one deck, one viewport: the group tag routes the message to its corner",
          }),
        ]
      : [],
    body,
  });
};
