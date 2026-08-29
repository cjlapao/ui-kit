import type { LocaleTag, MessageCatalog } from "../types";
import { EN_KIT_CATALOG } from "./en";

/**
 * Built-in kit catalogs (spec §4.3). Phase 1 ships a placeholder `en` —
 * the full reference catalog plus the curated `fr`/`es`/`de`/`pt` land in
 * Phase 2 (plan Tasks 2.1–2.2).
 */
export const BUILT_IN_CATALOGS: Record<LocaleTag, MessageCatalog> = {
  en: EN_KIT_CATALOG,
};

/** Locales the kit ships curated kit strings for (the CLI's scaffold set). */
export const CURATED_LOCALES: LocaleTag[] = ["en"];
