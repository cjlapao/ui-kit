<script setup lang="ts">
import PlaygroundSection from "../PlaygroundSection.vue";
import { I18nProvider } from "@cjlapao/ui-kit-vue";
import I18nPreview from "./I18nPreview.vue";

// Demo-owned user catalog (user namespace only — kit.* strings fall back to
// the built-in catalog). The provider wraps the preview, so the switcher and
// every component below share one engine — setLocale() updates the whole page.
const CATALOGS: Record<string, Record<string, string>> = {
  en: {
    greeting: "Hello, {name}!",
    items:
      "{count, plural, one {# item in your cart} other {# items in your cart}}",
  },
  fr: {
    greeting: "Bonjour, {name} !",
    items:
      "{count, plural, one {# article dans votre panier} other {# articles dans votre panier}}",
  },
  es: {
    greeting: "¡Hola, {name}!",
    items:
      "{count, plural, one {# artículo en tu carrito} other {# artículos en tu carrito}}",
  },
};
</script>

<template>
  <PlaygroundSection
    title="I18n"
    label="[I18n]"
    description="The kit's localization layer: a zero-dependency ICU-subset engine (interpolation, number/date, plural via Intl.PluralRules), built-in kit catalogs for en/fr/es/de/pt, and byte-identical no-provider rendering. One I18nProvider per app; setLocale() updates every component on the page."
  >
    <template #preview>
      <I18nProvider :locales="CATALOGS" storage-key="ui-kit-vue-demo:i18n">
        <I18nPreview />
      </I18nProvider>
    </template>
  </PlaygroundSection>
</template>
