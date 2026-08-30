import React from "react";
import { I18nProvider } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { I18nPlayground } from "./I18nPlayground";
import { DEMO_LOCALES } from "./catalog";
import Interpolation from "./examples/Interpolation";
import interpolationCode from "./examples/Interpolation.tsx?raw";
import Pluralization from "./examples/Pluralization";
import pluralizationCode from "./examples/Pluralization.tsx?raw";
import Formatting from "./examples/Formatting";
import formattingCode from "./examples/Formatting.tsx?raw";
import Detection from "./examples/Detection";
import detectionCode from "./examples/Detection.tsx?raw";
import MissingKeys from "./examples/MissingKeys";
import missingKeysCode from "./examples/MissingKeys.tsx?raw";
import DefaultMessages from "./examples/DefaultMessages";
import defaultMessagesCode from "./examples/DefaultMessages.tsx?raw";

/**
 * I18n — the kit's localization layer: a zero-dependency ICU-subset engine
 * (interpolation, number/date styles, plural via Intl.PluralRules, select),
 * one provider per app, built-in kit.* catalogs for five locales, and
 * byte-identical no-provider rendering.
 */
export const I18nPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="I18n"
      description="A zero-dependency internationalization engine bundled with the kit: ICU-subset messages (interpolation, number/date, plural via Intl.PluralRules, select), built-in kit.* catalogs for en/fr/es/de/pt, locale detection + persistence, and byte-identical no-provider rendering. User catalogs layer on top and can override any kit.* key per locale."
    />
    <I18nProvider locales={DEMO_LOCALES} storageKey="ui-kit-demo:i18n-locale">
      <I18nPlayground />
      <section className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Examples
        </h2>
        <ExampleCard
          title="Interpolation"
          description="One message source, every locale — the switcher above drives the whole page through a single setLocale()."
          code={interpolationCode}
          filename="Interpolation.tsx"
        >
          <Interpolation />
        </ExampleCard>
        <ExampleCard
          title="Pluralization"
          description="English, French and Arabic side by side: the plural categories (one/other, one/many, zero/one/two/few/many/other) come from Intl.PluralRules, so one ICU message source serves them all — Arabic renders right-to-left."
          code={pluralizationCode}
          filename="Pluralization.tsx"
        >
          <Pluralization />
        </ExampleCard>
        <ExampleCard
          title="Number & date formatting"
          description="formatNumber/formatDate are Intl.NumberFormat/DateTimeFormat bound to the active locale — the same binding the kit's date panels use."
          code={formattingCode}
          filename="Formatting.tsx"
        >
          <Formatting />
        </ExampleCard>
        <ExampleCard
          title="Language detection"
          description="With no explicit locale the engine reads navigator.languages on mount and matches exact or base-language tags against the catalogs (pt-BR → pt); SSR detection is a no-op."
          code={detectionCode}
          filename="Detection.tsx"
        >
          <Detection />
        </ExampleCard>
        <ExampleCard
          title="Missing keys"
          description="Resolution is user[locale] → kit[locale] → kit[en] → the key itself. In development an unknown user key warns once in the console and renders the key, so gaps are loud where it matters."
          code={missingKeysCode}
          filename="MissingKeys.tsx"
        >
          <MissingKeys />
        </ExampleCard>
        <ExampleCard
          title="Default messages"
          description="t({ id, defaultMessage, values }) renders the message inline when the id is unregistered — self-documenting calls without pre-registering every string."
          code={defaultMessagesCode}
          filename="DefaultMessages.tsx"
        >
          <DefaultMessages />
        </ExampleCard>
      </section>
    </I18nProvider>
  </div>
);

export default I18nPage;
