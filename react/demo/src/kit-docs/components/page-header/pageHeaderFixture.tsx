import { Breadcrumb, Button, IconButton } from "@cjlapao/ui-kit";

/**
 * The content the playground puts in each region, in one place so the preview and
 * the Code view mount and print exactly the same elements.
 *
 * These are real components rather than a `<span>` of text, for the reason the
 * keyboard topic makes: the bar itself has no bindings of its own, so what a
 * reader tabs through here is what the kit actually renders.
 */

/** `start` — the page's name and where it sits in the tree. */
export const TRAIL = (
  <>
    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
      ui-kit
    </span>
    <Breadcrumb
      ariaLabel="Playground breadcrumb"
      items={[
        { label: "Reports", to: "#" },
        { label: "Quarterly", current: true },
      ]}
    />
  </>
);

/** `center` — the narrow status note the JSDoc at :30-32 warns about. */
export const NOTE = (
  <span className="text-sm text-neutral-400 dark:text-neutral-500">
    Q3 &middot; draft
  </span>
);

/** `end` — the page's controls. */
export const ACTIONS = (
  <>
    <IconButton icon="Search" variant="ghost" srLabel="Search" />
    <Button size="sm" leadingIcon="Settings" variant="soft">
      Configure
    </Button>
  </>
);

/** `children` — the fourth group, appended after the regions (:191). */
export const EXTRA = (
  <Button variant="ghost" size="sm" leadingIcon="Refresh">
    Regenerate
  </Button>
);

/** Every component a fixture mounts, so the Code view can name it. */
export const FIXTURE_NAMES = { Breadcrumb, Button, IconButton };
