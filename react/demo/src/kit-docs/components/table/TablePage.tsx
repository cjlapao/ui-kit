import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TablePlayground } from "./TablePlayground";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import Densities from "./examples/Densities";
import densitiesCode from "./examples/Densities.tsx?raw";
import Persistence from "./examples/Persistence";
import persistenceCode from "./examples/Persistence.tsx?raw";

export const TablePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Table"
      description="A data grid on the shared panel surface — sorting, grouping, pagination, column management, and opt-in settings persistence, with a three-step density scale, an optional bordered grid, and Panel-style loading states (spinner, progress, skeleton)."
    />
    <TablePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Surfaces"
        description="The table's variant is the panel surface family — outlined, tonal, glass and liquid-glass, each tinted by the tone."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="Densities"
        description="default, compact and minimal — the same table at three row scales; bordered adds the full grid, minimal drops it."
        code={densitiesCode}
        filename="Densities.tsx"
      >
        <Densities />
      </ExampleCard>
      <ExampleCard
        title="Persistence"
        description="With a storageKey, column visibility, column widths, group-by and pinned columns are stored in localStorage and restored on the next mount."
        code={persistenceCode}
        filename="Persistence.tsx"
      >
        <Persistence />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "data / columns",
          type: "T[] / TableColumn<T>[]",
          description:
            "The only two required props. A column is an id, a header and an accessor, plus opt-ins: sortable, hideable, resizable, sticky and groupable - the toolbar buttons appear as the columns allow them.",
        },
        {
          name: "variant / tone",
          type: '"outlined" | "tonal" | "subtle" | "glass" | "liquid-glass" / TrueColor | neutral',
          default: '"outlined" / "neutral"',
          description:
            "The table sits on the panel surface family; tone tints the card and the header wash. Neutral keeps the data quiet - the sensible reading default - and only an explicit tone washes rows and headers.",
        },
        {
          name: "color",
          type: "TrueColor",
          default: "the kit blue, or the table tone",
          description:
            "The accent for the interactive marks: the selected-row wash, sorted headers, toolbar controls and focus rings. It defaults to the kit\u2019s blue, so a plain table highlights like the rest of the kit - not gray.",
        },
        {
          name: "selectedItems / rowKey",
          type: "T[] / (row, index) => key",
          description:
            "Selection is a wash the caller owns - the table paints the chosen rows in the accent; giving rowKey is what lets a row be matched across re-sorts and pages.",
        },
        {
          name: "sortState / defaultSort / onSortChange",
          type: "TableSortState | null",
          description:
            "Uncontrolled with defaultSort, or fully controlled via sortState + onSortChange (pair it with manualSorting and sort the data yourself). Headers carry aria-sort, and the cycle is ascending, descending, cleared.",
        },
        {
          name: "pagination",
          type: "TablePaginationState",
          description:
            "A controlled { page, pageSize, total, onPageChange, onPageSizeChange } renders the footer: a localized \u201cShowing X to Y of Z\u201d, a page-size select, and Previous / Next - all translated in the five built-in locales.",
        },
        {
          name: "groupable / userStickyColumns / showColumnSelector",
          type: "boolean",
          description:
            "The toolbar\u2019s three menus - group by a column, pin columns left or right, toggle visibility. Each is a portaled popup that floats over the page and flips at the viewport edge, closing on outside click and on Escape, scrolls with the kit\u2019s overlay bars, and every label in it is localized.",
        },
        {
          name: "panelVariant / panelTone / panelCorner",
          type: '"auto" | SurfaceVariant / "auto" | TrueColor / SurfaceCorner',
          default: '"auto" - follows the table',
          description:
            "The menus are the table\u2019s shadow: by default they sit on the table\u2019s own surface, tone and corner. One map-over keeps them honest - a glass table\u2019s menus land on the kit\u2019s frosted popup surface, because glass chrome meant for colourful backdrops goes invisible over a white page; pin `glass` if you want the literal look.",
        },
        {
          name: "storageKey / onTableSettingsChange",
          type: "string | (settings) => void",
          description:
            "Opt-in persistence: column visibility, widths, grouping, pins and the active view round-trip through localStorage under a versioned key. Without it the table stores nothing.",
        },
        {
          name: "loading / loaderType",
          type: 'boolean / "spinner" | "progress" | "skeleton"',
          description:
            "Panel-style loading: the spinner and progress overlay stay pinned over the scrolling body (aria-busy marks the region), while skeleton swaps the rows for pulsing placeholders. loadingMessage names the overlay for screen readers.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A real <C>table</C>: <C>th scope="col"</C> on every header,{" "}
          <C>aria-sort</C> on the sorted one, and <C>aria-busy</C> on the region
          while loading. Group rows carry <C>aria-expanded</C>, the toolbar
          toggles carry <C>aria-pressed</C>, and the menu controls are native
          checkboxes, radios and buttons with localized labels - nothing here
          relies on a visible caption.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Everything the mouse can reach is a real button or input in tab order:
          sort cycles through the header control, the group toggle answers{" "}
          <C>Enter</C> / <C>Space</C> on its row, and <C>Escape</C> closes
          whichever settings menu is open before the host sees it. Outside the
          menus, arrow keys scroll the body - it is a plain scrolling region,
          not a widget that traps the keys.
        </p>
      </A11yTopic>
      <A11yTopic title="Visible focus">
        <p>
          Rows, headers, toolbar controls and menu items all show a{" "}
          <C>focus-visible</C> ring in the table\u2019s accent, and the row
          hover wash doubles as the highlight - a keyboard user can see exactly
          where they are in a long list.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default TablePage;
