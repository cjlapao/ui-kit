// The public Vue i18n surface (spec §8.3).
export { default as I18nProvider } from "./I18nProvider.vue";
export { I18nKey, getDefaultEngine, injectEngine, resolveEngine } from "./I18nContext";
export { useI18n, useKitT, type UseI18n } from "./useI18n";
