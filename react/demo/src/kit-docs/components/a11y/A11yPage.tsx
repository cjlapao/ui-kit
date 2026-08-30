import React from "react";
import { PageHeader } from "../../shared/PageHeader";

/**
 * A11y — the kit's accessibility support statement and consumer guide.
 *
 * Content kept factual and verified: keyboard rows describe the handlers the
 * components actually implement, and "known behaviours" states what a screen
 * reader hears today (including the honest gaps). When a component's
 * behaviour changes, this page changes with it.
 */

const SectionHeading: React.FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
    {title}
    {children}
  </h2>
);

const Prose: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex max-w-3xl flex-col gap-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
    {children}
  </div>
);

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
    {children}
  </kbd>
);

interface KeyRow {
  widget: string;
  access: string;
  keys: React.ReactNode;
  note?: string;
}

const KEY_ROWS: KeyRow[] = [
  {
    widget: "Select",
    access: "native <select> inside a styled wrapper",
    keys: (
      <>
        <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> <Kbd>↑</Kbd> <Kbd>↓</Kbd> <Kbd>Home</Kbd> <Kbd>End</Kbd>, type-ahead
      </>
    ),
    note: "Keyboard support is the browser's own — full native select semantics, no custom listbox to get wrong.",
  },
  {
    widget: "Combobox",
    access: "text input + listbox popup",
    keys: (
      <>
        type to filter · <Kbd>↓</Kbd> open/move · <Kbd>↑</Kbd> move · <Kbd>Enter</Kbd> select · <Kbd>Home</Kbd>/<Kbd>End</Kbd> first/last · <Kbd>Esc</Kbd> close
      </>
    ),
    note: "aria-activedescendant tracks the highlighted option for screen readers.",
  },
  {
    widget: "TagPicker",
    access: "trigger (mouse) + chevron button (keyboard)",
    keys: (
      <>
        <Kbd>↓</Kbd> on the chevron opens · <Kbd>↑</Kbd>/<Kbd>↓</Kbd> move · <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> select · <Kbd>Esc</Kbd> close · <Kbd>⌫</Kbd> (empty query) removes the last chip in multi mode
      </>
    ),
    note: "The trigger itself is a plain element (it would be invalid HTML to nest chip buttons inside a button); the chevron carries the listbox button role with aria-haspopup / aria-expanded / aria-controls.",
  },
  {
    widget: "DropdownMenu",
    access: "button trigger + listbox menu",
    keys: (
      <>
        <Kbd>↓</Kbd> open/focus first · <Kbd>↑</Kbd>/<Kbd>↓</Kbd> move · <Kbd>Enter</Kbd> activate · <Kbd>Home</Kbd>/<Kbd>End</Kbd> · <Kbd>Esc</Kbd> close
      </>
    ),
    note: "Focus returns to the trigger when the menu closes.",
  },
  {
    widget: "Tree",
    access: "tree with roving tabindex",
    keys: (
      <>
        <Kbd>↑</Kbd>/<Kbd>↓</Kbd> move · <Kbd>→</Kbd> expand / into first child · <Kbd>←</Kbd> collapse / to parent · <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> toggle · <Kbd>Home</Kbd>/<Kbd>End</Kbd>
      </>
    ),
    note: "Only the focused node is tabbable (one tab stop for the whole tree), per the ARIA tree pattern.",
  },
  {
    widget: "Accordion",
    access: "disclosure navigation with roving tabindex",
    keys: (
      <>
        <Kbd>↓</Kbd>/<Kbd>→</Kbd> next header · <Kbd>↑</Kbd>/<Kbd>←</Kbd> previous · <Kbd>Home</Kbd>/<Kbd>End</Kbd> · <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> toggle
      </>
    ),
    note: "Collapsed headers are skipped when disabled; one tab stop for the whole accordion, per the ARIA disclosure navigation pattern.",
  },
  {
    widget: "Modal / SidePanel dialogs",
    access: "dialog with focus containment",
    keys: (
      <>
        <Kbd>Tab</Kbd> cycles inside only · <Kbd>Esc</Kbd> closes (unless the prop opts out)
      </>
    ),
    note: "Focus moves into the dialog on open and returns to the trigger on close; aria-modal plus an inert backdrop keep screen readers inside.",
  },
  {
    widget: "SidePanel resize handle",
    access: "tabbable separator",
    keys: (
      <>
        <Kbd>←</Kbd>/<Kbd>→</Kbd> resize by 20px · <Kbd>Home</Kbd>/<Kbd>End</Kbd> snap to min/max
      </>
    ),
    note: "Exposes slider value traits (aria-valuenow/min/max) so screen readers announce the panel width.",
  },
  {
    widget: "Slider",
    access: "role=slider",
    keys: (
      <>
        <Kbd>←</Kbd>/<Kbd>→</Kbd> (and <Kbd>↑</Kbd>/<Kbd>↓</Kbd>) step · <Kbd>Home</Kbd>/<Kbd>End</Kbd> min/max
      </>
    ),
  },
  {
    widget: "Carousel",
    access: "arrow controls + region",
    keys: (
      <>
        <Kbd>→</Kbd>/<Kbd>←</Kbd> next/previous (<Kbd>↓</Kbd>/<Kbd>↑</Kbd> in vertical mode)
      </>
    ),
  },
  {
    widget: "Toast",
    access: "none — it is an announcement, not a control",
    keys: <span className="text-neutral-400 dark:text-neutral-500">—</span>,
    note: "Informative toasts use role=status (polite); errors use role=alert (assertive). Dismiss buttons are ordinary buttons.",
  },
  {
    widget: "Icon-only controls (Button/IconButton)",
    access: "tab stop",
    keys: (
      <>
        <Kbd>Tab</Kbd> · <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> activate
      </>
    ),
    note: "Named by aria-label; the kit warns in development when an icon-only control has no name.",
  },
];

const KeyTable: React.FC = () => (
  <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
    <table className="w-full min-w-[640px] text-left text-sm">
      <caption className="sr-only">
        Keyboard interaction model per widget
      </caption>
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          <th scope="col" className="px-4 py-2.5 font-semibold">
            Widget
          </th>
          <th scope="col" className="px-4 py-2.5 font-semibold">
            Access
          </th>
          <th scope="col" className="px-4 py-2.5 font-semibold">
            Keys
          </th>
        </tr>
      </thead>
      <tbody>
        {KEY_ROWS.map((row) => (
          <tr
            key={row.widget}
            className="border-b border-neutral-100 align-top last:border-b-0 dark:border-neutral-800"
          >
            <th scope="row" className="px-4 py-2.5 font-medium text-neutral-900 dark:text-neutral-100">
              {row.widget}
            </th>
            <td className="px-4 py-2.5 text-neutral-500 dark:text-neutral-400">
              {row.access}
            </td>
            <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-300">
              {row.keys}
              {row.note ? (
                <p className="mt-1.5 text-xs leading-5 text-neutral-400 dark:text-neutral-500">
                  {row.note}
                </p>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const A11yPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:px-8">
    <PageHeader
      name="A11y"
      description="Accessibility is a first-class requirement of the kit, targeted at WCAG 2.1 AA. This page states what is supported, how every widget behaves on the keyboard, what screen readers hear today, and what consumers should do to keep their apps in an accessible state."
    />

    <section className="flex flex-col gap-3">
      <SectionHeading title="Support statement" />
      <Prose>
        <p>
          The kit targets <strong>WCAG 2.1 AA</strong>, with the ARIA Authoring
          Practices Guide (APG) as the companion for interactive widgets.
          Concretely: all interactive states are reachable and operable by
          keyboard alone (2.1.1), every interactive element carries an
          accessible name (4.1.2), semantic roles are used rather than
          click-only divs, text and non-text contrast meet AA (1.4.3 /
          1.4.11), and focus is always visible (the kit renders
          <code className="mx-1 rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">focus-visible</code> rings
          on every control).
        </p>
        <p>
          The claim is enforced in CI, not in a wiki: a{" "}
          <strong>jsx-a11y lint gate</strong> fails the build on missing
          names, click-only divs, invalid ARIA usage and aria-hidden on
          focusable elements; an <strong>axe-core harness</strong> renders 47
          fixture states of the widgets and fails on serious/critical
          violations; and a <strong>contrast gate</strong> measures every
          theme token pair (surface text and every button state, light and
          dark) against WCAG relative luminance. In development the kit also
          warns in the console when a control renders without an accessible
          name (Button, Toggle, Checkbox, Tree, headless Modal, SidePanel).
        </p>
        <p>
          What still needs a human: screen readers. A manual NVDA +
          VoiceOver pass over the demo is part of the release checklist —
          automation covers structure, not the listening experience.
        </p>
      </Prose>
    </section>

    <section className="flex flex-col gap-3">
      <SectionHeading title="Keyboard support" />
      <Prose>
        <p>
          Every widget follows the APG keyboard model for its pattern. The
          rows below are the implemented handlers, not aspirations:
        </p>
      </Prose>
      <KeyTable />
    </section>

    <section className="flex flex-col gap-3">
      <SectionHeading title="What screen readers hear" />
      <Prose>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Select</strong> is a real{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">
              &lt;select&gt;</code>{" "}
            inside a styled wrapper — screen readers get the browser's
            native select semantics, the strongest there is.
          </li>
          <li>
            <strong>Combobox / DropdownMenu / TagPicker</strong> expose
            listbox options with <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">aria-activedescendant</code>{" "}
            tracking, and their triggers advertise{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">
              aria-haspopup</code>, <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">aria-expanded</code>{" "}
            and <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">aria-controls</code>.
          </li>
          <li>
            <strong>TagPicker chips</strong> are individual remove buttons
            named "Remove {value}" — the trigger is deliberately not a
            button (a button cannot contain buttons in valid HTML), so the
            keyboard affordance lives on the chevron.
          </li>
          <li>
            <strong>Modal and SidePanel dialogs</strong> set{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">
              aria-modal</code>, contain focus while open, hide the backdrop
            from the accessibility tree, and restore focus to the trigger
            when closed.
          </li>
          <li>
            <strong>Toast</strong> is a live region: <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">role=status</code>{" "}
            (polite) for information, <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">role=alert</code>{" "}
            (assertive) for errors.
          </li>
          <li>
            <strong>Tree and Accordion</strong> use roving tabindex — one tab
            stop per widget, arrows to move, exactly as the APG prescribes.
          </li>
          <li>
            <strong>Known gaps (tracked, not hidden):</strong> light-mode{" "}
            <em>green</em> text buttons on their hover/active tint measure
            4.497:1 — 0.003 under the AA floor (a one-step theme fix away);
            and decorative icons in the MarkdownEditor toolbar are
            aria-hidden next to their visible labels.
          </li>
        </ul>
      </Prose>
    </section>

    <section className="flex flex-col gap-3">
      <SectionHeading title="Labelling your app" />
      <Prose>
        <p>The kit handles its own labels; these keep your app's in check:</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Name icon-only controls.</strong> A Button or IconButton
            with no text children needs an <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">aria-label</code>
            — the kit warns in development when it renders without one.
          </li>
          <li>
            <strong>Prefer visible labels.</strong> For text controls the
            visible text <em>is</em> the accessible name; aria-label on
            a text-bearing button would replace it, not extend it.
          </li>
          <li>
            <strong>Label every form input.</strong> Use the label prop /{" "}
            <code className="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800">htmlFor</code>{" "}
            rather than a bare placeholder — placeholders disappear on
            focus and are not accessible names.
          </li>
          <li>
            <strong>Never aria-hidden a focusable element.</strong> The lint
            gate exists for this one; it removes the element from screen
            readers while Tab still lands on it.
          </li>
          <li>
            <strong>Give dialogs a title.</strong> Modal and SidePanel take a
            title (or aria-label) — that is what the screen reader announces
            when the dialog opens.
          </li>
          <li>
            <strong>Announce with semantics, not timeouts.</strong> Status
            changes go through Toast (or a role=status region) so they land
            in the live region instead of being spoken out of order.
          </li>
          <li>
            <strong>Don't remove focus rings.</strong> If you restyle a
            control, keep a visible focus indicator at least as strong as the
            default ring — non-text contrast (1.4.11) is part of AA.
          </li>
        </ol>
      </Prose>
    </section>
  </div>
);

export default A11yPage;
