import React from "react";
import {
  Accordion,
  Combobox,
  DatePicker,
  SearchBar,
  Select,
  useI18n,
} from "@cjlapao/ui-kit";
import { DEMO_LOCALE_TAGS } from "./catalog";
import {
  PlaygroundPanel,
  type BackdropType,
} from "../../shared/PlaygroundPanel";

/**
 * The live i18n playground: one <I18nProvider> for the whole panel, a
 * locale switcher that calls setLocale() (the same API an app would use),
 * and real kit components that render through the active locale — including
 * RTL direction for Arabic via the <html dir> side effect.
 */
const Switcher: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        aria-label="Locale"
        value={i18n.locale}
        onChange={(event) => i18n.setLocale(event.target.value)}
        className="w-28"
      >
        {DEMO_LOCALE_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </Select>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        setLocale() — persisted to localStorage, updates &lt;html lang/dir&gt;
      </span>
    </div>
  );
};

const LiveComponents: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-end gap-5">
        <div className="w-64">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            DatePicker
          </p>
          <DatePicker aria-label="Date" />
        </div>
        <div className="w-64">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            SearchBar
          </p>
          <SearchBar aria-label="Search" />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Combobox — no matches (empty state)
          </p>
          <Combobox
            aria-label="Fruit"
            options={[]}
            onChange={() => {}}
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Accordion — empty state
          </p>
          <Accordion items={[]} />
        </div>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Current locale: <code className="font-mono">{i18n.locale}</code> —
        every label, placeholder and aria-label above is a{" "}
        <code className="font-mono">kit.*</code> message resolved from the
        built-in catalog (user content would sit alongside in the provider).
      </p>
    </div>
  );
};

/**
 * The live i18n playground — rendered INSIDE the page's single
 * <I18nProvider>, so the switcher and the examples below it share the same
 * engine (one setLocale() updates every demo on the page).
 */
export const I18nPlayground: React.FC<{ backdrop?: BackdropType }> = ({
  backdrop = "gradient",
}) => (
  <PlaygroundPanel backdrop={backdrop}>
    <div className="flex w-full flex-col gap-6">
      <Switcher />
      <LiveComponents />
    </div>
  </PlaygroundPanel>
);

export default I18nPlayground;
