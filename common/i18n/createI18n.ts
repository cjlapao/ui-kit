// The engine factory (spec §8.1). Environment-neutral on purpose: no
// localStorage, no document — the provider wrappers (provider.ts) own the
// side effects, which is what keeps this testable under jsdom and Node.

import { buildResolution } from "./catalog";
import { BUILT_IN_CATALOGS } from "./builtIn";
import { getLocalizedParseNames, getMonthNames, getWeekdayNames } from "./dates";
import { isRTLLocale, matchTag, resolveInitialLocale } from "./detect";
import { IcuParseError, parseMessage, resolveNodes, type IcuNode } from "./icu";
import { readStoredLocale } from "./storage";
import { devWarnOnce, isDev } from "./warn";
import type { I18nConfig, I18nEngine, I18nMessage } from "./types";

const PARSE_ERROR: unique symbol = Symbol("icu-parse-error");

export function createI18n(config: I18nConfig): I18nEngine {
  const fallbackLocale = config.fallbackLocale ?? "en";
  const resolution = buildResolution(config.locales, BUILT_IN_CATALOGS, fallbackLocale);
  const available = new Set(resolution.availableLocales());

  const languages =
    typeof navigator !== "undefined" && Array.isArray(navigator.languages)
      ? [...navigator.languages]
      : [];

  let locale = resolveInitialLocale({
    explicit: config.locale,
    detect: config.detect !== false,
    stored: readStoredLocale(config),
    languages,
    available,
    fallback: fallbackLocale,
  });
  if (!available.has(locale)) locale = "en"; // belt-and-braces: en always exists

  let isRTL = isRTLLocale(locale);
  let version = 0;
  const listeners = new Set<() => void>();
  const messageCache = new Map<string, IcuNode[] | typeof PARSE_ERROR>();

  const renderMessage = (key: string, source: string, values: Record<string, unknown>): string => {
    const cacheKey = `${locale}\u0000${source}`;
    const cached = messageCache.get(cacheKey);
    if (cached === undefined) {
      try {
        const parsed = parseMessage(source, key);
        messageCache.set(cacheKey, parsed);
        return resolveNodes(parsed, values, locale, isDev(), key);
      } catch (error) {
        if (error instanceof IcuParseError) {
          messageCache.set(cacheKey, PARSE_ERROR);
          if (isDev()) throw error;
          devWarnOnce(`icu:${key}:${locale}`, error.message);
          return key;
        }
        throw error;
      }
    }
    if (cached === PARSE_ERROR) return key;
    return resolveNodes(cached, values, locale, isDev(), key);
  };

  const t = (keyOrMessage: string | I18nMessage, values?: Record<string, unknown>): string => {
    const id = typeof keyOrMessage === "string" ? keyOrMessage : keyOrMessage.id;
    const msgValues = typeof keyOrMessage === "string" ? values : keyOrMessage.values;
    const found = resolution.lookup(id, locale);
    if (found) return renderMessage(id, found.value, msgValues ?? {});
    const defaultMessage = typeof keyOrMessage === "object" ? keyOrMessage.defaultMessage : undefined;
    config.onFallbackKey?.(id, locale, fallbackLocale);
    if (defaultMessage !== undefined) {
      devWarnOnce(
        `fallback:${locale}:${id}`,
        `i18n: key "${id}" missing for "${locale}" — using the default message`,
      );
      return renderMessage(id, defaultMessage, msgValues ?? {});
    }
    devWarnOnce(`missing:${locale}:${id}`, `i18n: key "${id}" missing for "${locale}" — rendering the key`);
    return id;
  };

  const engine: I18nEngine = {
    t,
    get locale() {
      return locale;
    },
    get locales() {
      return resolution.availableLocales();
    },
    has(key, localeArg) {
      return resolution.has(key, localeArg ?? locale);
    },
    setLocale(tag) {
      const resolved = matchTag([tag], available);
      if (!resolved) {
        devWarnOnce(
          `setlocale:${tag}`,
          `i18n: setLocale("${tag}") ignored — no catalog for it (available: ${[...available].sort().join(", ")})`,
        );
        return;
      }
      if (resolved === locale) return;
      locale = resolved;
      isRTL = isRTLLocale(locale);
      version += 1;
      for (const listener of [...listeners]) listener();
    },
    formatNumber(value, options) {
      try {
        return new Intl.NumberFormat(locale, options).format(value);
      } catch {
        try {
          return new Intl.NumberFormat(fallbackLocale, options).format(value);
        } catch {
          return String(value);
        }
      }
    },
    formatDate(value, options) {
      try {
        return new Intl.DateTimeFormat(locale, options).format(value);
      } catch {
        try {
          return new Intl.DateTimeFormat(fallbackLocale, options).format(value);
        } catch {
          return value.toString();
        }
      }
    },
    monthNames(tag = locale, short = false) {
      return getMonthNames(tag, short, resolution.catalogFor(tag));
    },
    weekdayNames(tag = locale, short = false) {
      return getWeekdayNames(tag, short, resolution.catalogFor(tag));
    },
    parseNames(tag = locale) {
      return getLocalizedParseNames(tag, resolution.catalogFor(tag));
    },
    get isRTL() {
      return isRTL;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getVersion() {
      return version;
    },
  };

  return engine;
}
