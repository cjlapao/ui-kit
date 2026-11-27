import { Button, Pill } from "@cjlapao/ui-kit";

/**
 * The stuff that goes *inside* the panel, written once.
 *
 * A docked panel is mostly slots, and a slot is the easiest place for a Code view
 * to lie: the preview mounts four buttons while the snippet prints a comment
 * saying "your actions here". Everything below is mounted by the preview and
 * printed by the Code view from the same object — `h.jsx` walks the very elements
 * rendered here, so a drift becomes a test failure rather than a reader's
 * surprise.
 */

/**
 * `position: absolute` (:899,:904) — the panel fills the box it is placed in and
 * needs a positioned ancestor, so the stage is part of the example rather than
 * decoration around it. `flex` because a `docked` panel is `relative shrink-0`
 * (:898): in a block container it would sit *under* the page instead of beside it.
 */
export const STAGE_CLASS =
  "relative flex h-80 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700";

/** The host's own page, which the panel overlays instead of pushing aside. */
export const PageContent = () => (
  <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
    <p className="font-medium text-neutral-800 dark:text-neutral-100">
      Deployment 412
    </p>
    <p className="mt-1">
      The panel floats over this rather than taking a column, so nothing here
      moves when it opens.
    </p>
  </div>
);

export const PAGE_CONTENT = <PageContent />;

/**
 * The same markup, written out: what the Code view prints for the component the
 * reader would actually declare — the right-hand side of the declaration, which
 * `h.const` puts its own `const PageContent = ` in front of. It is checked against
 * the mounted text by the preview test, so the two cannot drift.
 */
export const PAGE_CONTENT_SOURCE = [
  "() => (",
  '  <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">',
  '    <p className="font-medium text-neutral-800 dark:text-neutral-100">',
  "      Deployment 412",
  "    </p>",
  '    <p className="mt-1">',
  "      The panel floats over this rather than taking a column, so nothing here",
  "      moves when it opens.",
  "    </p>",
  "  </div>",
  ")",
].join("\n");

/**
 * The header the demo always shows. `title` is optional to the component, and the
 * kit warns in development when a panel has none (:491 → common/a11y/warn.ts:76);
 * a playground that left it out would be demonstrating the warning, not the panel.
 */
export const TITLE = "Build 412";
export const SUBTITLE = "eu-west-1 · 4m 12s";

/** The body's rows — data, so the list is one thing the snippet can account for. */
export const ROWS: string[] = [
  "Trigger — push to main by cjlapao",
  "Region — eu-west-1, 3 instances",
  "Artifacts — 3 files, 12.4 MB",
  "Duration — 4m 12s",
  "Health checks — 6 passed, 0 failed",
  "Rollback — available to 411",
];

/**
 * The body as the reader is shown it: the markup the preview mounts, written out
 * verbatim, list included. A `map` printed as a `map` is the honest form of a
 * generated fixture.
 */
export const BODY_SOURCE = [
  '<div className="space-y-3 p-4 text-sm">',
  '  <p className="font-medium">Build details</p>',
  "  {ROWS.map((row) => (",
  '    <p key={row} className="text-neutral-500 dark:text-neutral-400">',
  "      {row}",
  "    </p>",
  "  ))}",
  "</div>",
].join("\n");

/** The same markup, mounted. */
export const Body = () => (
  <div className="space-y-3 p-4 text-sm">
    <p className="font-medium">Build details</p>
    {ROWS.map((row) => (
      <p key={row} className="text-neutral-500 dark:text-neutral-400">
        {row}
      </p>
    ))}
  </div>
);

/**
 * `subHeader`: the non-scrolling strip. Filters, because that is what the prop
 * exists for — they stay put while the rows above scroll under them.
 */
export const SUB_HEADER = (
  <div className="flex items-center gap-1">
    <Button size="xs" variant="solid" color="blue">
      All
    </Button>
    <Button size="xs" variant="ghost" color="slate">
      Failing
    </Button>
    <Button size="xs" variant="ghost" color="slate">
      Logs
    </Button>
  </div>
);

/**
 * `headerPills`: centred with the close button, ahead of it — a count and a
 * status, which is the pair this slot was separated from `headerActions` for.
 */
export const HEADER_PILLS = (
  <>
    <Pill size="xs" tone="blue">
      3 new
    </Pill>
    <Pill size="xs" tone="green" variant="outline" icon="Check">
      Passing
    </Pill>
  </>
);

/** `footer`: outside the scroll container, so it never travels with the body. */
export const FOOTER = (
  <div className="flex justify-end gap-2">
    <Button size="xs" variant="ghost" color="slate">
      Cancel
    </Button>
    <Button size="xs" variant="solid" color="blue">
      Save
    </Button>
  </div>
);

/** The header's own buttons — the slot that stays free for real actions. */
export const HEADER_ACTIONS = (
  <Button size="xs" variant="outline" color="slate">
    Open build
  </Button>
);

/** Identifiers the printer needs: the key is what gets printed, never `fn.name`. */
export const SLOT_NAMES = { Button, Pill };
