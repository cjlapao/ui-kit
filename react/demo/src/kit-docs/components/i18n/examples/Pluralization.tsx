import React from "react";
import { createI18n, type MessageCatalog } from "@cjlapao/ui-kit";

/**
 * Pluralization side by side — English (one/other), French (one/many) and
 * Arabic (zero/one/two/few/many/other). Each column runs its own engine; the
 * categories come from the same `Intl.PluralRules` the kit uses, so a single
 * message source serves every category.
 */
const CATALOGS: Record<string, MessageCatalog> = {
  en: {
    items:
      "{count, plural, one {# item in your cart} other {# items in your cart}}",
  },
  fr: {
    items:
      "{count, plural, one {# article dans votre panier} many {# articles dans votre panier} other {# articles dans votre panier}}",
  },
  ar: {
    items:
      "{count, plural, zero {لا توجد عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}",
  },
};

const COUNTS = [0, 1, 2, 3, 11];
const LOCALES = ["en", "fr", "ar"] as const;

export const Pluralization: React.FC = () => {
  const engines = React.useMemo(
    () =>
      LOCALES.map(
        (locale) =>
          createI18n({
            locales: { [locale]: CATALOGS[locale] },
            locale,
            storageKey: null,
            updateDocument: false,
          }),
      ),
    [],
  );
  return (
    <div className="flex flex-col gap-3">
      {engines.map((engine, index) => (
        <div key={LOCALES[index]} className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {LOCALES[index]}
          </span>
          <ul className="grid grid-cols-5 gap-2 text-xs sm:grid-cols-5">
            {COUNTS.map((count) => (
              <li
                key={count}
                className="rounded-md border border-neutral-200 px-2 py-1.5 dark:border-neutral-700"
              >
                <span className="mb-0.5 block font-mono text-[10px] text-neutral-400">
                  {count}
                </span>
                {engine.t("items", { count })}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Pluralization;
