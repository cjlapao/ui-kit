<script setup lang="ts">
// Vue I18nProvider (spec §8.3, plan task 4.1).
//
// Slot component: builds the shared engine (common/i18n — same factory the
// React kit uses) and provides it via I18nKey. The engine is built once per
// mount from the initial props; to change config, remount the provider
// (mirrors the React kit's stable-per-config engine).
import { provide, watch } from "vue";
import { devWarnOnce } from "../../../common/i18n/warn";
import {
  createI18n,
  wrapEngineWithSideEffects,
  type I18nConfig,
  type I18nEngine,
  type MessageCatalog,
} from "../../../common/i18n";
import { I18nKey } from "./I18nContext";

const props = withDefaults(
  defineProps<{
    /** User catalogs, keyed by locale tag. `{}` is fine — the kit catalogs apply. */
    locales: Record<string, MessageCatalog>;
    /** Key-resolution fallback locale. @default "en" */
    fallbackLocale?: string;
    /** Explicit active locale — skips detection and persistence reads. */
    locale?: string;
    /** Detect from `navigator.languages`. @default true */
    detect?: boolean;
    /** localStorage key; `null` = never persist. @default "ui-kit:locale" */
    storageKey?: string | null;
    /** Update `<html lang/dir>`. @default true */
    updateDocument?: boolean;
    onFallbackKey?: (key: string, locale: string) => void;
  }>(),
  {
    fallbackLocale: "en",
    locale: undefined,
    detect: true,
    storageKey: undefined,
    updateDocument: true,
    onFallbackKey: undefined,
  },
);

const config: I18nConfig = {
  locales: props.locales,
  fallbackLocale: props.fallbackLocale,
  locale: props.locale,
  detect: props.detect,
  storageKey: props.storageKey,
  updateDocument: props.updateDocument,
  onFallbackKey: props.onFallbackKey,
};

const engine: I18nEngine = wrapEngineWithSideEffects(
  createI18n(config),
  config,
);

// Dev hint for the common mistake of swapping `:locales` after mount — the
// engine is frozen at mount time (same as the React provider's config
// identity).
watch(
  () => props.locales,
  (next, prev) => {
    if (next !== prev) {
      devWarnOnce(
        "I18nProvider:locales-changed",
        "i18n: I18nProvider's `locales` prop changed after mount — the engine was built with the initial catalogs. Remount the provider to apply new catalogs.",
      );
    }
  },
);

provide(I18nKey, engine);
</script>

<template>
  <slot />
</template>
