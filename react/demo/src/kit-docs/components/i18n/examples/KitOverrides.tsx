import React from "react";
import { I18nProvider, SmartGridLayout } from "@cjlapao/ui-kit";
import type {
  MessageCatalog,
  SmartGridItemDefinition,
  SmartGridSectionDefinition,
} from "@cjlapao/ui-kit";

/**
 * Tuning the kit's own strings. Resolution is `user[locale] → kit[locale] →
 * kit[en] → the key`, so a handful of `kit.*` keys in your catalog replaces
 * exactly the words a component says without forking its catalog — and every
 * string you leave alone keeps shipping with the kit's five translations.
 * The grid below overrides four of its 54 keys; the rest of the German
 * chrome falls through to the built-in catalog.
 */
const german: MessageCatalog = {
  "kit.smartgrid.editLayout": "Layout anpassen",
  "kit.smartgrid.done": "Fertig",
  "kit.smartgrid.undo": "Verwerfen",
  "kit.smartgrid.addNewItem": "Kachel hinzufügen",
};

const items: SmartGridItemDefinition[] = [
  {
    id: "uptime",
    title: "Uptime",
    active: true,
    single: false,
    render: () => (
      <span className="text-xl font-semibold tabular-nums">99.98%</span>
    ),
  },
  {
    id: "calls",
    title: "Calls",
    active: true,
    single: false,
    render: () => (
      <span className="text-xl font-semibold tabular-nums">1.2M/h</span>
    ),
  },
];

const layout: SmartGridSectionDefinition[] = [
  { title: "Übersicht", rows: [{ itemIds: ["uptime", "calls"] }] },
];

export const KitOverrides: React.FC = () => (
  <I18nProvider
    locale="de"
    detect={false}
    storageKey={null}
    updateDocument={false}
    locales={{ de: german }}
  >
    <div className="flex flex-col gap-3">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Four <code className="font-mono">kit.smartgrid.*</code> keys overridden
        in the provider above — the toolbar and palette pick them up;{" "}
        <em>Redo</em>, the drop zone and the screen-reader narration fall
        through to the kit&rsquo;s own German catalog.
      </p>
      <SmartGridLayout
        items={items}
        defaultLayout={layout}
        maxColumns={6}
        defaultEditMode
      />
    </div>
  </I18nProvider>
);

export default KitOverrides;
